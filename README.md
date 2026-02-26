<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/globe-showing-americas_1f30e.png" alt="Globe" width="80"/>
</p>

<h1 align="center">🍽️ Global Recipe Book</h1>

<p align="center">
  <em>Explore the world, one dish at a time.</em>
</p>

<p align="center">
  <a href="https://global-recipe-book-01.vercel.app/"><strong>🌐 Visit Live Site</strong></a>
</p>

<p align="center">
  Every country has a story to tell through its food.<br/>
  This is a place to discover those stories — from the smoky street tacos of Mexico<br/>
  to the fragrant butter chicken of India, from hand-rolled sushi in Japan<br/>
  to the perfect American smash burger.
</p>

---

## 🌍 The Idea

Food is the most universal language. It carries history, geography, family traditions, and a little bit of magic in every bite. **Global Recipe Book** was born from a simple question: *what if you could explore every country's most beloved dish without ever leaving your kitchen?*

This isn't a database of recipes. It's a journey. Scroll through **250+ countries and territories** — each represented by its flag — and discover the dish that defines a culture. Search for something you've been craving. Let an AI cooking companion walk you through unfamiliar techniques. Read what's happening in the world of food right now.

It's built for the curious cook, the armchair traveler, and anyone who believes dinner should be an adventure.

---

## ✨ What You'll Experience

### 🔍 Search Any Dish You're Dreaming Of
Type in a craving — *"pad thai"*, *"sourdough bread"*, *"lamb tagine"* — and get beautiful recipe cards with photos, nutrition at a glance, and everything you need to start cooking.

### 🗺️ Browse by Country
Scroll through a wall of flags from Afghanistan to Zimbabwe. Tap any country and instantly discover its national dish — complete with ingredients, step-by-step instructions, and the story behind the food.

<!-- 🖼️ Add a screenshot of the country grid here -->

### 🍔 The Burger Experience
Before you even search, the app greets you with something cinematic. As you scroll, a smash burger is built before your eyes — **frame by frame, layer by layer** — in a 240-frame animation inspired by Apple's product pages. You'll see the sear hit the griddle, the cheese melt over the edges, and the bun crown the masterpiece. It feels less like a website and more like a cooking show you control with your fingertips.

<!-- 🖼️ Add a GIF of the burger scroll animation here -->

### 🤖 Ask the AI Chef
Stuck on a recipe? Wondering what to substitute for tamarind paste? Not sure if you should sauté or roast? Every recipe comes with a built-in **AI cooking assistant** — like having a knowledgeable friend in the kitchen who's happy to answer anything, from *"Can I use coconut milk instead of cream?"* to *"What temperature should my oil be for deep frying?"*

<!-- 🖼️ Add a screenshot of the AI chat inside a recipe modal here -->

### 📰 Food News, Fresh Daily
A curated feed pulls the latest food journalism from the New York Times — stories about chefs, food culture, seasonal ingredients, and dining trends. Because loving food means staying curious about it.

---

## 🔭 A Closer Look

### The Scroll That Feels Like a Cooking Show
Most recipe sites start with a search bar. This one starts with an experience. The 240-frame burger animation is designed to make you *feel* the cooking process — the heat of the griddle (560°F), the weight of the hand pressing the patty (90 seconds of contact), and the satisfaction of watching each layer stack up. Four cinematic text panels float in and out as you scroll, giving you the recipe's soul before you ever read an ingredient list.

### An AI Companion, Not a Chatbot
The cooking assistant doesn't feel like a customer service bot. Ask it about a recipe and it responds like a home cook who's made this dish a hundred times — practical, warm, and specific. It knows the recipe you're looking at, so the answers are always relevant.

### Every Flag, Every Cuisine
From the well-known food capitals (Italy 🇮🇹, Thailand 🇹🇭, Japan 🇯🇵) to places you might not immediately associate with iconic dishes (Bhutan 🇧🇹, Eritrea 🇪🇷, Suriname 🇸🇷) — the country grid is a reminder that every corner of the world has something delicious to offer. Filter by name to find exactly where you want to travel next — culinarily speaking.

---

## 🌎 Cuisines of the World — A Taste

Here are just a few of the **250+ countries** you can explore:

| | Country | What You Might Discover |
|---|---------|------------------------|
| 🇯🇵 | **Japan** | Delicate sushi, warming ramen, crispy tempura |
| 🇲🇽 | **Mexico** | Smoky tacos al pastor, rich mole, fresh ceviche |
| 🇮🇳 | **India** | Fragrant butter chicken, spiced biryani, crispy dosa |
| 🇮🇹 | **Italy** | Handmade pasta, wood-fired pizza, creamy risotto |
| 🇪🇹 | **Ethiopia** | Spongy injera with spicy doro wat |
| 🇰🇷 | **South Korea** | Sizzling bibimbap, tangy kimchi jjigae |
| 🇱🇧 | **Lebanon** | Smoky baba ganoush, herb-packed tabbouleh |
| 🇵🇪 | **Peru** | Zesty ceviche, hearty lomo saltado |
| 🇲🇦 | **Morocco** | Slow-cooked tagine, fluffy couscous |
| 🇹🇭 | **Thailand** | Fiery pad thai, coconut-rich green curry |

*...and 240+ more, each with its own flag, its own dish, its own story.*

---

## 🛠️ Under the Hood *(for the curious)*

Global Recipe Book is powered by **React** on the front end and **Python Flask** on the back end. Recipes come from the **Spoonacular API**, with **Groq AI** (Llama 3.1) stepping in as a creative fallback when a dish isn't in the database — and also powering the cooking assistant chat. Food news streams in from the **New York Times RSS feed**. Country flags are served by **flagcdn.com**.

The burger scroll animation renders 240 hand-sequenced frames to an HTML canvas, synchronized to your scroll position — no video, no GIF, just pure frame-by-frame smoothness powered by **Framer Motion** and vanilla JavaScript.

---

## 🚀 Quick Start

```bash
# 1. Clone the project
git clone https://github.com/your-username/GlobalRecipeBook.git
cd GlobalRecipeBook

# 2. Set up the backend
cd backend
pip install -r requirements.txt
# Create a .env file with your API keys:
#   SPOONACULAR_API_KEY=your_key
#   GROQ_API_KEY=your_key
#   SERP_API_KEY=your_key
python app.py

# 3. Set up the frontend (in a new terminal)
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000** — and the world's kitchen is yours to explore.

---

## 💛 Credits & Acknowledgments

- **[Spoonacular](https://spoonacular.com/)** — for the incredible recipe database that makes this all possible
- **[Groq](https://groq.com/)** — for lightning-fast AI that powers the cooking assistant
- **[New York Times Food](https://cooking.nytimes.com/)** — for the food news that keeps us inspired
- **[flagcdn.com](https://flagcdn.com/)** — for the beautiful country flags
- **[Google Fonts](https://fonts.google.com/)** — Playfair Display, Inter, and Outfit bring the typography to life

---

<p align="center">
  <strong>Made with love for food, culture, and curiosity.</strong><br/>
  <em>Because the best recipes are the ones that take you somewhere new.</em>
</p>

<p align="center">
  🍣 🌮 🍛 🍝 🥘 🍜 🥙 🍔 🥗 🧆
</p>
