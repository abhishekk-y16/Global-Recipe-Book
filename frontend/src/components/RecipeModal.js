import React, { useEffect } from 'react';
import RecipeAssistantChat from './RecipeAssistantChat';

function RecipeModal({ recipe, onClose }) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const stopPropagation = (e) => e.stopPropagation();

    return (
        <div
            className="modal-backdrop-glass"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Recipe details for ${recipe.title}`}
        >
            <div className="modal-glass" onClick={stopPropagation}>

                {/* Full Width Hero Image */}
                <div className="modal-hero-glass">
                    {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title} className="modal-hero-img" />
                    ) : (
                        <div className="modal-no-img">🍽️</div>
                    )}
                    <div className="modal-hero-overlay" />
                    <button className="modal-close-glass" onClick={onClose} aria-label="Close modal">✕</button>

                    <h1 className="modal-title-glass">{recipe.title}</h1>
                </div>

                <div className="modal-body-glass">

                    {/* Quick Stats Bar */}
                    <div className="modal-quick-stats">
                        {recipe.preparation_time !== 'N/A' && (
                            <div className="stat-item">
                                <span className="stat-icon">⏱</span>
                                <span className="stat-text">{recipe.preparation_time} min</span>
                            </div>
                        )}
                        {recipe.servings !== 'N/A' && (
                            <div className="stat-item">
                                <span className="stat-icon">🍽</span>
                                <span className="stat-text">{recipe.servings} servings</span>
                            </div>
                        )}
                        {recipe.cuisine && recipe.cuisine.length > 0 && (
                            <div className="stat-item">
                                <span className="stat-icon">🌍</span>
                                <span className="stat-text">{recipe.cuisine.join(', ')}</span>
                            </div>
                        )}
                        <div className="stat-item">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-text">{recipe.calories !== 'N/A' ? `${recipe.calories} Calories` : 'N/A'}</span>
                        </div>
                        {recipe.protein !== 'N/A' && (
                            <div className="stat-item">
                                <span className="stat-icon">💪</span>
                                <span className="stat-text">{recipe.protein} Protein</span>
                            </div>
                        )}
                        {recipe.carbs !== 'N/A' && (
                            <div className="stat-item">
                                <span className="stat-icon">🍞</span>
                                <span className="stat-text">{recipe.carbs} Carbs</span>
                            </div>
                        )}
                        {recipe.fat !== 'N/A' && (
                            <div className="stat-item">
                                <span className="stat-icon">🫒</span>
                                <span className="stat-text">{recipe.fat} Fat</span>
                            </div>
                        )}
                    </div>

                    <div className="modal-content-grid">
                        {/* Ingredients Column */}
                        <div className="modal-ingredients-section">
                            <h2 className="modal-h2"><span className="section-icon">🛒</span> Ingredients</h2>
                            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                <ul className="ingredient-list-glass">
                                    {recipe.ingredients.map((ing, idx) => (
                                        <li key={idx} className="ingredient-item-glass">
                                            <span className="ing-name">{ing.name}</span>
                                            {ing.amount > 0 && (
                                                <span className="ing-amount">{ing.amount} {ing.unit}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-data-text">No detailed ingredient list available.</p>
                            )}
                        </div>

                        {/* Instructions Column */}
                        <div className="modal-instructions-section">
                            <h2 className="modal-h2"><span className="section-icon">👨‍🍳</span> How to Make It</h2>
                            {recipe.instructions && recipe.instructions.length > 0 ? (
                                <div className="instructions-list-glass">
                                    {recipe.instructions.map((step, idx) => (
                                        <div key={idx} className="instruction-step-glass">
                                            <div className="step-number-glass">{idx + 1}</div>
                                            <p className="step-text-glass">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data-text">
                                    Follow the standard preparation method for {recipe.title}.
                                    Detailed step-by-step instructions are not currently available from the source.
                                </p>
                            )}
                            
                            <div className="assistant-divider"></div>
                            <RecipeAssistantChat recipeName={recipe.title} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RecipeModal;
