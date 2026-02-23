from app import fallback_to_groq_and_serpapi
import json

try:
    results = fallback_to_groq_and_serpapi("Litti Chokha")
    print(json.dumps(results, indent=2))
except Exception as e:
    print(f"Error: {e}")
