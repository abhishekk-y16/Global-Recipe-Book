import React from 'react';
import { motion, useTransform } from 'framer-motion';

/* ─── Spinning Badge ─────────────────────────────────────────────────── */
function SpinBadge({ text, color = '#FF6B35' }) {
    return (
        <motion.div
            className="overlay-spin-badge"
            style={{ borderColor: color, color }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className="overlay-spin-char"
                    style={{ transform: `rotate(${i * (360 / text.length)}deg)` }}
                >
                    {char}
                </span>
            ))}
        </motion.div>
    );
}

/* ─── Panel driven by scroll progress ─────────────────────────────────── */
function OverlayPanel({ scrollMotionValue, showStart, showPeak, hideStart, hideEnd, position, children }) {
    const opacity = useTransform(scrollMotionValue, [showStart, showPeak, hideStart, hideEnd], [0, 1, 1, 0]);
    const y = useTransform(scrollMotionValue, [showStart, showPeak, hideStart, hideEnd], [30, 0, 0, -20]);
    const scale = useTransform(scrollMotionValue, [showStart, showPeak, hideStart, hideEnd], [0.94, 1, 1, 0.97]);

    return (
        <motion.div className={`burger-overlay-panel ${position}`} style={{ opacity, pointerEvents: 'none' }}>
            <motion.div className="burger-overlay-content" style={{ y, scale }}>
                {children}
            </motion.div>
        </motion.div>
    );
}

/* ─── Export ─────────────────────────────────────────────────────────── */
export default function BurgerTextOverlays({ scrollMotionValue }) {
    return (
        <div className="burger-text-overlays">

            {/* Panel 1 — Intro */}
            <OverlayPanel scrollMotionValue={scrollMotionValue}
                showStart={0.0} showPeak={0.04} hideStart={0.14} hideEnd={0.20}
                position="left"
            >
                <SpinBadge text="★ GLOBAL RECIPE BOOK ★ SMASH BURGER ★" color="#FF6B35" />
                <div className="burger-overlay-eyebrow"></div>
                <h2 className="burger-overlay-title">The Smash <br />Burger.</h2>
                <p className="burger-overlay-sub">Simple Ingredients. Serious Technique. Unforgettable Result.</p>
            </OverlayPanel>

            {/* Panel 2 — Method */}
            <OverlayPanel scrollMotionValue={scrollMotionValue}
                showStart={0.22} showPeak={0.28} hideStart={0.38} hideEnd={0.46}
                position="right"
            >
                <SpinBadge text="● THE METHOD ● CAST IRON ● HIGH HEAT ●" color="#FFC14D" />
                <div className="burger-overlay-eyebrow">The Technique</div>
                <h2 className="burger-overlay-title">High Heat. <br />Hard Smash.</h2>
                <p className="burger-overlay-sub">One press. Maximum crust.</p>
                <div className="burger-overlay-stat-row">
                    <div className="burger-overlay-stat">
                        <span className="burger-stat-val">560°F</span>
                        <span className="burger-stat-label">Pan Temp</span>
                    </div>
                    <div className="burger-overlay-stat">
                        <span className="burger-stat-val">90s</span>
                        <span className="burger-stat-label">Cook Time</span>
                    </div>
                </div>
            </OverlayPanel>

            {/* Panel 3 — Stack */}
            <OverlayPanel scrollMotionValue={scrollMotionValue}
                showStart={0.50} showPeak={0.56} hideStart={0.66} hideEnd={0.74}
                position="left"
            >
                <SpinBadge text="● LAYER BY LAYER ● BUILD THE STACK ●" color="#A78BFA" />
                <div className="burger-overlay-eyebrow">The Build</div>
                <h2 className="burger-overlay-title">Layer <br />By Layer.</h2>
                <p className="burger-overlay-sub">Brioche Bun, Secret Sauce, American Cheese, Crisp Lettuce, Pickles. Every Layer Has a Purpose.</p>
                <div className="burger-overlay-stat-row">
                    <div className="burger-overlay-stat">
                        <span className="burger-stat-val">7</span>
                        <span className="burger-stat-label">Layers</span>
                    </div>
                    <div className="burger-overlay-stat">
                        <span className="burger-stat-val">620</span>
                        <span className="burger-stat-label">Calories</span>
                    </div>
                    <div className="burger-overlay-stat">
                        <span className="burger-stat-val">42g</span>
                        <span className="burger-stat-label">Protein</span>
                    </div>
                </div>
            </OverlayPanel>

            {/* Panel 4 — Finale */}
            <OverlayPanel scrollMotionValue={scrollMotionValue}
                showStart={0.78} showPeak={0.84} hideStart={0.94} hideEnd={1.00}
                position="center"
            >
                <SpinBadge text="✦ READY TO COOK ✦ FULL RECIPE BELOW ✦" color="#4ade80" />
                <div className="burger-overlay-eyebrow">Ready?</div>
                <h2 className="burger-overlay-title">Your Recipe <br />Awaits.</h2>
                <p className="burger-overlay-sub">Full Ingredients, Step-by-Step Method, and Macros — Just Below.</p>
            </OverlayPanel>

        </div>
    );
}
