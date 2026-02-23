import requests
import json
import os

try:
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get("https://raw.githubusercontent.com/mledoze/countries/master/countries.json", headers=headers, timeout=10)
    response.raise_for_status()
    data = response.json()
    
    # Sort alphabetically by common name
    data.sort(key=lambda x: x['name']['common'])
    
    js_content = "export const WORLD_CUISINES = [\n"
    
    for country in data:
        name = country['name']['common']
        code = country.get('cca2', '').lower()
        flag_url = f"https://flagcdn.com/w80/{code}.png"
        
        # We need to escape single quotes in country names like "Côte d'Ivoire"
        escaped_name = name.replace("'", "\\'")
        query_val = f"{escaped_name} national dish"
        
        js_content += f"  {{ label: '{escaped_name}', flagUrl: '{flag_url}', query: '{query_val}', cuisine: '' }},\n"
        
    js_content += "];\n"
    
    out_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "countries.js")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Successfully generated {len(data)} countries to {out_path}")
except Exception as e:
    print(f"Error: {e}")
