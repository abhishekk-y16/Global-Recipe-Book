from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from serpapi import GoogleSearch
import os
from groq import Groq
import feedparser
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# API keys — loaded from .env file (never hardcode these!)
API_KEY = os.environ.get('SPOONACULAR_API_KEY', '')
BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch'
SERPAPI_KEY = os.environ.get('SERPAPI_KEY', '')

# Read Groq API Key
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')


def safe_get_nutrient(nutrients, name):
    """Safely extract a nutrient value by name."""
    for n in nutrients:
        if name.lower() in n.get('name', '').lower():
            return round(n.get('amount', 0), 1)
    return 'N/A'


def extract_instructions(recipe):
    """Extract step-by-step instructions from the analyzed instructions field."""
    steps = []
    analyzed = recipe.get('analyzedInstructions', [])
    if analyzed:
        for section in analyzed:
            for step in section.get('steps', []):
                steps.append(step.get('step', ''))
    elif recipe.get('instructions'):
        # Fallback: return raw HTML-stripped instructions as a single step
        raw = recipe.get('instructions', '')
        # Basic strip of HTML tags
        import re
        clean = re.sub(r'<[^>]+>', ' ', raw).strip()
        steps = [s.strip() for s in clean.split('.') if s.strip()]
    return steps


def get_image_from_serpapi(query):
    """Fetch a high quality image of the dish using SerpApi Google Images."""
    params = {
      "engine": "google_images",
      "q": f"{query} food recipe high quality",
      "api_key": SERPAPI_KEY,
      "num": 1
    }
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        if "images_results" in results and len(results["images_results"]) > 0:
            return results["images_results"][0]["original"]
    except Exception as e:
        print("SerpApi Image Error:", e)
    return ""


def fallback_to_groq_and_serpapi(query):
    """Fallback mechanism using Groq for recipe data and SerpApi for the image."""
    if not GROQ_API_KEY:
        print("Missing GROQ_API_KEY. Set it in environment to enable Groq fallback.")
        return []
        
    client = Groq(api_key=GROQ_API_KEY)
    prompt = f"""Generate a detailed recipe for "{query}".
    Respond ONLY with a valid JSON object matching this exact structure, with no markdown formatting or other text:
    {{
        "title": "Recipe Title",
        "preparation_time": "45",
        "servings": "4",
        "cuisine": ["Cuisine Name"],
        "vegetarian": false,
        "vegan": false,
        "glutenFree": false,
        "calories": "500",
        "protein": "30",
        "fat": "20",
        "carbs": "40",
        "summary": "A short appetizing description.",
        "ingredients": [
            {{"name": "ingredient name", "amount": "1", "unit": "cup"}}
        ],
        "instructions": [
            "Step 1 text",
            "Step 2 text"
        ]
    }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a professional chef. Always respond with valid JSON containing recipe data. Do not wrap in ```json markers."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",  # Fast formulation model
            response_format={"type": "json_object"}
        )
        
        response_text = chat_completion.choices[0].message.content
        import json
        recipe_data = json.loads(response_text)
        
        # Now fetch the image via SerpApi
        image_url = get_image_from_serpapi(query)
        
        formatted_recipe = {
            'id': str(hash(query))[:8],
            'title': recipe_data.get('title', query),
            'image': image_url,
            'cuisine': recipe_data.get('cuisine', []),
            'preparation_time': str(recipe_data.get('preparation_time', 'N/A')),
            'servings': str(recipe_data.get('servings', 'N/A')),
            'vegetarian': recipe_data.get('vegetarian', False),
            'vegan': recipe_data.get('vegan', False),
            'glutenFree': recipe_data.get('glutenFree', False),
            'calories': str(recipe_data.get('calories', 'N/A')),
            'protein': str(recipe_data.get('protein', 'N/A')),
            'fat': str(recipe_data.get('fat', 'N/A')),
            'carbs': str(recipe_data.get('carbs', 'N/A')),
            'summary': recipe_data.get('summary', ''),
            'ingredients': recipe_data.get('ingredients', []),
            'instructions': recipe_data.get('instructions', [])
        }
        return [formatted_recipe]
        
    except Exception as e:
        print("Groq API Error:", e)
        return []


# Search endpoint for fetching recipes
@app.route('/search', methods=['GET'])
def search_recipe():
    query = request.args.get('query', '')
    cuisine = request.args.get('cuisine', '')

    if not query and not cuisine:
        return jsonify({"error": "No search query or cuisine provided"}), 400

    params = {
        'apiKey': API_KEY,
        'query': query,
        'cuisine': cuisine,
        'number': 12,
        'addRecipeInformation': True,
        'addRecipeNutrition': True,
        'fillIngredients': True,
        'instructionsRequired': True,
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        recipes = parse_complex_search_results(data.get('results', []))
        
        # Fallback if Spoonacular found nothing but a query was provided
        if not recipes and query:
            recipes = fallback_to_groq_and_serpapi(query)
            
        return jsonify({"recipes": recipes})
    else:
        return jsonify({"error": "Failed to fetch recipes from Spoonacular", "details": response.text}), 500

def parse_complex_search_results(results_list):
    """Helper to parse the extensive data from Spoonacular complexSearch."""
    recipes = []
    for recipe in results_list:
            nutrients = []
            if recipe.get('nutrition') and recipe['nutrition'].get('nutrients'):
                nutrients = recipe['nutrition']['nutrients']

            recipes.append({
                'id': recipe['id'],
                'title': recipe['title'],
                'image': recipe.get('image', ''),
                'cuisine': recipe.get('cuisines', []),
                'preparation_time': recipe.get('readyInMinutes', 'N/A'),
                'servings': recipe.get('servings', 'N/A'),
                'vegetarian': recipe.get('vegetarian', False),
                'vegan': recipe.get('vegan', False),
                'glutenFree': recipe.get('glutenFree', False),
                'calories': safe_get_nutrient(nutrients, 'Calories'),
                'protein': safe_get_nutrient(nutrients, 'Protein'),
                'fat': safe_get_nutrient(nutrients, 'Fat'),
                'carbs': safe_get_nutrient(nutrients, 'Carbohydrates'),
                'summary': recipe.get('summary', ''),
                'ingredients': [
                    {
                        'name': ing.get('nameClean') or ing.get('name', ''),
                        'amount': round(ing.get('amount', 0), 2),
                        'unit': ing.get('unit', ''),
                    }
                    for ing in recipe.get('extendedIngredients', [])
                ],
                'instructions': extract_instructions(recipe),
            })
    return recipes

# Search endpoint for fetching featured curated recipes
@app.route('/featured', methods=['GET'])
def featured_recipes():
    # World's most popular dishes curated list
    curated_queries = ["Sushi", "Tacos de Adobada", "Butter Chicken"]
    
    recipes = []
    import random
    
    # We will fetch 3 curated dishes via complexSearch
    for q in curated_queries:
        params = {
            'apiKey': API_KEY,
            'query': q,
            'number': 1,
            'addRecipeInformation': True,
            'addRecipeNutrition': True,
            'fillIngredients': True,
            'instructionsRequired': True,
        }
        resp = requests.get(BASE_URL, params=params)
        if resp.status_code == 200:
            parsed = parse_complex_search_results(resp.json().get('results', []))
            if parsed:
                recipes.extend(parsed)
        
    if recipes:
        return jsonify({"recipes": recipes})
    else:
        return jsonify({"error": "Failed to fetch curated featured recipes"}), 500


@app.route('/food-news', methods=['GET'])
def get_food_news():
    try:
        feed = feedparser.parse('https://rss.nytimes.com/services/xml/rss/nyt/DiningandWine.xml')
        articles = []
        import random
        emojis = ['🥗', '🍳', '🌿', '🍫', '🥑', '🍷', '🍣', '🥐', '🍕', '🍯']
        tags = ['Dining', 'Cooking', 'Food Culture', 'Restaurant Review', 'Recipes', 'Nutrition']
        
        for entry in feed.entries[:4]:
            try:
                # Basic string manipulation to get "Feb 18" from "Wed, 18 Feb 2026 20:11:10 +0000"
                parts = entry.published.split(' ') 
                date_str = f"{parts[2]} {parts[1]}"
            except:
                date_str = "Recent"
                
            articles.append({
                'title': entry.title,
                'link': entry.link,
                'date': date_str,
                'read': f"{random.randint(3, 8)} min read",
                'emoji': random.choice(emojis),
                'tag': random.choice(tags)
            })
            
        return jsonify({"articles": articles})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

