import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BurgerSection from './components/scrollytelling/BurgerPage';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';

/* ─── Data ─────────────────────────────────────────────── */
import { WORLD_CUISINES } from './data/countries';

// Dynamic news fetched from backend

const APP_FEATURES = [
  { icon: '📋', text: 'Step-by-step guided cooking instructions' },
  { icon: '🥦', text: 'Detailed ingredient lists with exact amounts' },
  { icon: '🔥', text: 'Full nutritional breakdown per serving' },
  { icon: '🌍', text: 'Recipes from 30+ world cuisines' },
];

/* ─── Skeleton ─────────────────────────────────────────── */
function SkeletonGrid({ count = 6 }) {
  return (
    <div className="loading-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── App ──────────────────────────────────────────────── */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeCuisine, setActiveCuisine] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showNavBrand, setShowNavBrand] = useState(false);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [newsArticles, setNewsArticles] = useState([]);
  const [countrySearch, setCountrySearch] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Show the brand in the navbar shortly after the user starts scrolling,
      // as the large hero brand fades out.
      setShowNavBrand(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initially
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Slight delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, [hasSearched, recipes, featuredRecipes]);

  // Fetch featured recipes on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/featured`);
        setFeaturedRecipes(response.data.recipes || []);
      } catch (err) {
        console.error('Failed to fetch featured recipes:', err);
      } finally {
        setLoadingFeatured(false);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/food-news`);
        setNewsArticles(response.data.articles || []);
      } catch (err) {
        console.error('Failed to fetch food news:', err);
      }
    };

    fetchFeatured();
    fetchNews();
  }, []);

  const fetchRecipes = async (query, cuisine = '') => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    // Scroll to results immediately so user sees the loading state
    setTimeout(() => {
      const el = document.getElementById('results-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { query, cuisine },
      });
      setRecipes(response.data.recipes || []);
    } catch {
      setError('Could not connect to the server. Make sure the backend is running on port 5000.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setLastQuery(query);
    setActiveCuisine(null);
    fetchRecipes(query);
  };

  const handleCuisineClick = (c) => {
    setActiveCuisine(c.label);
    setLastQuery('');
    fetchRecipes(c.query, c.cuisine);
  };

  const filteredCuisines = WORLD_CUISINES.filter(c =>
    c.label.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="App">

      {/* ── NAVBAR ──────────────────────────────────────── */}
      <nav className="navbar">
        <div className={`nav-logo ${showNavBrand ? 'visible' : 'hidden'}`} style={{ opacity: showNavBrand ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: showNavBrand ? 'auto' : 'none' }}>
          <span className="logo-dot" />
          Global Recipe Book
        </div>
      </nav>

      {/* ── HERO: Burger Scrollytelling Canvas ───────────── */}
      <BurgerSection />


      {/* ── EXPLORE CENTER (Search & Cuisines) ───────────── */}
      <section className="explore-section reveal-on-scroll" id="search-section">
        <div className="explore-glass-container">
          <div className="explore-header text-center">
            <h2 className="explore-title">Discover your next meal</h2>
            <p className="explore-subtitle">Search over 10,000+ recipes from every corner of the globe</p>
          </div>

          <div className="search-wrapper">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="cuisine-explore">
            <div className="cuisine-header-row">
              <div className="cuisine-label-glass">Or browse by country</div>
              <input
                type="text"
                className="country-search-input"
                placeholder="Find a country..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="cuisine-grid-glass">
              {filteredCuisines.length > 0 ? (
                filteredCuisines.map((c, index) => (
                  <button
                    key={c.label}
                    id={`cuisine-btn-${c.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`cuisine-chip-glass ${activeCuisine === c.label ? 'active' : ''}`}
                    onClick={() => handleCuisineClick(c)}
                    aria-pressed={activeCuisine === c.label}
                  >
                    <img src={c.flagUrl} alt={`${c.label} flag`} className="country-flag-img" loading="lazy" />
                    <span className="label">{c.label}</span>
                  </button>
                ))
              ) : (
                <div className="empty-country-state">No country found matching "{countrySearch}"</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS ─────────────────────────────────────── */}
      <div id="results-anchor" />
      {hasSearched && (
        <section className="results-section reveal-on-scroll">
          {error && (
            <div className="error-state" role="alert">⚠️ {error}</div>
          )}
          {loading && <SkeletonGrid count={6} />}
          {!loading && recipes.length > 0 && (
            <>
              <div className="results-header section-header">
                <h2 className="section-title">
                  {activeCuisine
                    ? `${WORLD_CUISINES.find(c => c.label === activeCuisine)?.emoji} ${activeCuisine} Recipes`
                    : `Results for "${lastQuery}"`}
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#9a9a9a' }}>
                  {recipes.length} recipes found
                </span>
              </div>
              <div className="recipe-grid">
                {recipes.map((recipe, index) => (
                  <div key={recipe.id} className={`reveal-on-scroll delay-${(index % 4) + 1}`}>
                    <RecipeCard
                      recipe={recipe}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {!loading && !error && recipes.length === 0 && (
            <div className="empty-state">
              <span className="empty-state-icon">🔍</span>
              <p className="empty-state-title">No recipes found</p>
              <p className="empty-state-text">Try a different search or pick a cuisine above.</p>
            </div>
          )}
        </section>
      )}

      {/* ── FEATURED RECIPES (shown when no search yet) ─── */}
      {!hasSearched && (
        <section className="featured-section">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-title text-white">Featured Recipes</h2>
            <button className="section-link glass-link" onClick={() => handleCuisineClick(WORLD_CUISINES[0])}>
              Explore More →
            </button>
          </div>
          <div className="recipe-cards-row">
            {loadingFeatured ? (
              <SkeletonGrid count={3} />
            ) : featuredRecipes.map((item, i) => (
              <div key={item.id} className={`recipe-card-glass reveal-on-scroll delay-${(i % 3) + 1}`}
                onClick={() => setSelectedRecipe(item)}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedRecipe(item)}>

                <div className="recipe-card-img-wrap">
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="no-img-placeholder-glass">🍽️</div>
                  )}
                  {item.preparation_time !== 'N/A' && (
                    <div className="time-badge-glass">⏱ {item.preparation_time} min</div>
                  )}
                </div>

                <div className="recipe-card-body">
                  {item.cuisine && item.cuisine.length > 0 && (
                    <div className="recipe-card-cuisine">{item.cuisine[0]}</div>
                  )}
                  <h3 className="recipe-card-title text-white">{item.title}</h3>
                  <div className="recipe-card-macros-glass">
                    <div className="macro-glass"><div className="macro-value text-white">{item.calories !== 'N/A' ? item.calories : '—'}</div><div className="macro-label">kcal</div></div>
                    {item.protein !== 'N/A' && (
                      <div className="macro-glass"><div className="macro-value text-white">{item.protein}</div><div className="macro-label">Protein</div></div>
                    )}
                  </div>
                </div>

                <div className="recipe-card-footer">
                  {item.servings !== 'N/A' && (
                    <span className="servings-info">🍽 {item.servings} servings</span>
                  )}
                  <span className="view-recipe-btn text-white">Full Recipe →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── APP FEATURES SECTION ─────────────────────────── */}
      <section className="app-section" id="features-section">
        <div className="app-section-visuals">
          <div className="app-phone">
            <div className="phone-inner-placeholder">
              <span style={{ fontSize: '2.5rem' }}>🍽️</span>
              <span>Recipe View</span>
            </div>
          </div>
          <div className="app-phone tall">
            <div className="phone-inner-placeholder">
              <span style={{ fontSize: '2.5rem' }}>👨‍🍳</span>
              <span>Cook Mode</span>
            </div>
          </div>
        </div>
        <div className="app-section-text">
          <div className="app-section-badge">How It Works</div>
          <h2 className="app-section-title">
            Making the recipe<br />
            process <em>enjoyable</em> again
          </h2>
          <p className="app-section-desc">
            Every recipe comes with clear step-by-step cooking instructions,
            precise ingredient amounts, and full nutritional data — so you
            always know exactly what you're making and eating.
          </p>
          <div className="app-features">
            {APP_FEATURES.map((f, i) => (
              <div key={i} className="app-feature">
                <div className="feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <button className="app-cta" onClick={() => document.getElementById('search-bar-input')?.focus()}>
            Start Exploring Recipes
          </button>
        </div>
      </section>


      {/* ── DARK CTA ─────────────────────────────────────── */}
      <section className="cta-section" id="cta-section">
        <div className="cta-left">
          <span className="cta-tag">✦ Zero Clutter</span>
          <h2 className="cta-title">
            Less annoying ads,<br />
            <em>more cooking</em>
          </h2>
          <p className="cta-desc">
            Get weekly recipe picks from every corner of the globe delivered straight
            to your inbox. No spam. Just food worth making.
          </p>
        </div>
        <div className="cta-right">
          <div className="cta-form-title">Join the community</div>
          <div className="cta-form-sub">Weekly recipes · Nutrition tips · Zero spam</div>
          <div className="cta-form">
            <input
              className="cta-input"
              type="text"
              placeholder="Your name"
            />
            <input
              className="cta-input"
              type="email"
              placeholder="Your email address"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
            />
            <button className="cta-submit">Get Weekly Recipes →</button>
          </div>
        </div>
      </section>

      {/* ── NEWS SECTION ─────────────────────────────────── */}
      <section className="news-section" id="news-section">
        <div className="section-header">
          <h2 className="section-title">Latest news and articles</h2>
          <span className="section-link">View All →</span>
        </div>
        <div className="news-grid">
          {newsArticles.map((article, i) => (
            <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" className="news-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="news-card-img">
                <div className="news-emoji-placeholder">{article.emoji}</div>
              </div>
              <div className="news-tag">{article.tag}</div>
              <div className="news-title">{article.title}</div>
              <div className="news-meta">
                <span>{article.date}</span>
                <span className="news-meta-dot" />
                <span>{article.read}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">Global Recipe Book</div>
            <p className="footer-desc">
              Discover authentic recipes from every culture with step-by-step
              instructions and full nutritional information.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Cuisines</div>
            <div className="footer-links">
              {['Italian', 'Mexican', 'Indian', 'Japanese', 'Thai'].map(c => (
                <a key={c} href="#cuisine-section">{c}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Resources</div>
            <div className="footer-links">
              {['About', 'Articles', 'Nutrition Guide', 'Meal Planning'].map(l => (
                <a key={l} href="/" onClick={(e) => e.preventDefault()}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <div className="footer-links">
              {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(l => (
                <a key={l} href="/" onClick={(e) => e.preventDefault()}>{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Global Recipe Book. All rights reserved.</span>
          <span>Powered by <a href="https://spoonacular.com/food-api" target="_blank" rel="noreferrer">Spoonacular API</a></span>
        </div>
      </footer>

      {/* ── MODAL ────────────────────────────────────────── */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default App;
