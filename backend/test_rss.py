import feedparser
import json

feed = feedparser.parse('https://rss.nytimes.com/services/xml/rss/nyt/DiningandWine.xml')
results = []
for entry in feed.entries[:4]:
    results.append({
        'title': entry.title,
        'link': entry.link,
        'date': entry.published,
    })

print(json.dumps(results, indent=2))
