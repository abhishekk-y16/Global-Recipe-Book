import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Custom useInView hook — works with any framer-motion version
function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
}

// Simple animated div using IntersectionObserver + framer-motion v4 compatible API
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const [ref, inView] = useInView(0.1);
    const initial = {
        opacity: 0,
        y: direction === 'up' ? 40 : 0,
        x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
    };
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={initial}
            animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
            transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
}

/* ─── Data ─────────────────────────────────────────────────── */
const INGREDIENTS = [
    { emoji: '🥩', name: 'Beef Patty', amount: '200g (80/20)' },
    { emoji: '🍞', name: 'Brioche Bun', amount: '1 toasted' },
    { emoji: '🧀', name: 'American Cheese', amount: '2 slices' },
    { emoji: '🥬', name: 'Iceberg Lettuce', amount: 'Crisp leaves' },
    { emoji: '🍅', name: 'Vine Tomato', amount: '3 thick slices' },
    { emoji: '🥒', name: 'Dill Pickles', amount: '6 slices' },
    { emoji: '🧅', name: 'White Onion', amount: 'Finely diced' },
    { emoji: '🫙', name: 'Secret Sauce', amount: '2 tbsp' },
    { emoji: '🫒', name: 'Neutral Oil', amount: '1 tsp' },
    { emoji: '🧂', name: 'Kosher Salt', amount: 'To taste' },
    { emoji: '🌶️', name: 'Black Pepper', amount: 'Freshly cracked' },
    { emoji: '🧄', name: 'Garlic Powder', amount: '¼ tsp' },
];

const STEPS = [
    { icon: '🔥', name: 'Preheat Cast Iron', desc: 'Heat a cast iron skillet over high heat for 5 min. You want it screaming hot.' },
    { icon: '⚖️', name: 'Portion & Season', desc: 'Loosely form 200g beef balls. Do not overwork. Season generously with salt and pepper.' },
    { icon: '💥', name: 'Smash & Sear', desc: 'Place ball on pan, press flat with a spatula for 10s. Cook 90s until edges crisp.' },
    { icon: '🧀', name: 'Cheese & Flip', desc: 'Flip once. Add 2 slices American cheese immediately. Cover 30s to melt.' },
    { icon: '🍞', name: 'Toast the Bun', desc: 'Butter the brioche bun and toast cut-side down on the same pan until golden.' },
    { icon: '🥗', name: 'Build & Serve', desc: 'Layer: sauce → lettuce → tomato → patty → pickles → onion. Serve immediately.' },
];

const MACROS = [
    { val: '620', label: 'Calories' },
    { val: '42g', label: 'Protein' },
    { val: '28g', label: 'Fat' },
    { val: '48g', label: 'Carbs' },
];

export default function BurgerDetailsSection({ onExploreRecipes }) {
    return (
        <>
            {/* ── Ingredients ──────────────────────────────────── */}
            <section className="burger-ingredients-section">
                <Reveal direction="up">
                    <h2 className="burger-ingredients-title">What goes inside.</h2>
                </Reveal>
                <div className="burger-ingredients-grid">
                    {INGREDIENTS.map((ing, i) => (
                        <Reveal key={i} delay={i * 0.04} direction="up">
                            <div className="burger-ingredient-card">
                                <span className="burger-ingredient-emoji">{ing.emoji}</span>
                                <div className="burger-ingredient-name">{ing.name}</div>
                                <div className="burger-ingredient-amount">{ing.amount}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── Details + Macros ──────────────────────────────── */}
            <section className="burger-details-section">
                <div className="burger-details-grid">
                    <Reveal direction="left">
                        <div className="burger-details-text">
                            <div className="burger-details-eyebrow">The Philosophy</div>
                            <h2 className="burger-details-title">Simple ingredients.<br />Flawless execution.</h2>
                            <p className="burger-details-desc">
                                The Craft Smash Burger is a lesson in restraint. We source 80/20 chuck from
                                pasture-raised cattle, bake the brioche buns fresh daily, and make our secret sauce
                                in-house with Duke's mayo, yellow mustard, and a whisper of smoked paprika.
                                There are no gimmicks — just technique and quality.
                            </p>
                            <div className="burger-feature-pills">
                                {['Grass-Fed Beef', 'Fresh-Baked Bun', 'House Sauce', 'No Fillers', '15-Min Recipe'].map((f) => (
                                    <span key={f} className="burger-pill">{f}</span>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <Reveal direction="right" delay={0.15}>
                        <div className="burger-details-visual">
                            {MACROS.map((m, i) => (
                                <div key={i} className="burger-stat-card">
                                    <div className="burger-stat-card-val">{m.val}</div>
                                    <div className="burger-stat-card-label">{m.label}</div>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Steps ────────────────────────────────────────── */}
            <section className="burger-steps-section">
                <div className="burger-steps-header">
                    <Reveal direction="up">
                        <h2 className="burger-steps-title">How to make it.</h2>
                    </Reveal>
                    <div className="burger-steps-subtitle">6 steps · 15 minutes total</div>
                </div>
                <div className="burger-steps-grid">
                    {STEPS.map((step, i) => (
                        <Reveal key={i} delay={i * 0.07} direction="up">
                            <div className="burger-step-card">
                                <div className="burger-step-num">0{i + 1}</div>
                                <div className="burger-step-icon">{step.icon}</div>
                                <div className="burger-step-name">{step.name}</div>
                                <div className="burger-step-desc">{step.desc}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────── */}
            <section className="burger-cta-section">
                <Reveal direction="up">
                    <div className="burger-cta-eyebrow">✦ Global Recipe Book</div>
                    <h2 className="burger-cta-title">
                        Explore 10,000+<br />recipes like this.
                    </h2>
                    <p className="burger-cta-sub">
                        Authentic dishes from 30+ cuisines with full step-by-step instructions,
                        ingredient lists, and nutritional data.
                    </p>
                    <div className="burger-cta-buttons">
                        <button className="burger-btn-primary" onClick={onExploreRecipes}>
                            Explore All Recipes →
                        </button>
                        <button
                            className="burger-btn-outline"
                            onClick={() => {
                                const el = document.getElementById('cuisine-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                        >
                            🌍 Browse All Cuisines
                        </button>
                    </div>
                </Reveal>
            </section>
        </>
    );
}
