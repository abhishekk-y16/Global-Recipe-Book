import React from 'react';

function RecipeCard({ recipe, onClick }) {
    const cuisineLabel =
        recipe.cuisine && recipe.cuisine.length > 0 ? recipe.cuisine[0] : null;

    return (
        <article
            className="recipe-card"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
            aria-label={`View recipe for ${recipe.title}`}
        >
            {/* Image */}
            <div className="recipe-card-img-wrap">
                {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} loading="lazy" />
                ) : (
                    <div className="no-img-placeholder">🍽️</div>
                )}

                {/* Dietary badges */}
                <div className="badge-row">
                    {recipe.vegan && <span className="badge badge-vegan">Vegan</span>}
                    {!recipe.vegan && recipe.vegetarian && <span className="badge badge-veggie">Veggie</span>}
                    {recipe.glutenFree && <span className="badge badge-gf">GF</span>}
                </div>

                {/* Time */}
                {recipe.preparation_time !== 'N/A' && (
                    <div className="time-badge">⏱ {recipe.preparation_time} min</div>
                )}
            </div>

            {/* Body */}
            <div className="recipe-card-body">
                {cuisineLabel && (
                    <div className="recipe-card-cuisine">{cuisineLabel}</div>
                )}
                <h2 className="recipe-card-title">{recipe.title}</h2>
                <div className="recipe-card-macros">
                    <div className="macro">
                        <div className="macro-value">{recipe.calories !== 'N/A' ? recipe.calories : '—'}</div>
                        <div className="macro-label">kcal</div>
                    </div>
                    <div className="macro">
                        <div className="macro-value">{recipe.protein !== 'N/A' ? `${recipe.protein}g` : '—'}</div>
                        <div className="macro-label">Protein</div>
                    </div>
                    <div className="macro">
                        <div className="macro-value">{recipe.carbs !== 'N/A' ? `${recipe.carbs}g` : '—'}</div>
                        <div className="macro-label">Carbs</div>
                    </div>
                    <div className="macro">
                        <div className="macro-value">{recipe.fat !== 'N/A' ? `${recipe.fat}g` : '—'}</div>
                        <div className="macro-label">Fat</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="recipe-card-footer">
                <span className="servings-info">
                    {recipe.servings !== 'N/A' ? `🍽 ${recipe.servings} servings` : ''}
                </span>
                <span className="view-recipe-btn">View Recipe →</span>
            </div>
        </article>
    );
}

export default RecipeCard;
