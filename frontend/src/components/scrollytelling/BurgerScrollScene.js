import React, { useRef, useEffect, useState, useCallback } from 'react';

const TOTAL_FRAMES = 240;

export default function BurgerScrollScene({ children, scrollProgress }) {
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const loadedCountRef = useRef(0);
    const [loadProgress, setLoadProgress] = useState(0);
    const [allLoaded, setAllLoaded] = useState(false);
    const rafRef = useRef(null);
    const lastFrameRef = useRef(-1);

    // ── Preload all frames
    useEffect(() => {
        const images = [];
        
        const handleLoad = () => {
            loadedCountRef.current++;
            const currentLoaded = loadedCountRef.current;
            if (currentLoaded % 5 === 0 || currentLoaded === TOTAL_FRAMES) {
                setLoadProgress(Math.round((currentLoaded / TOTAL_FRAMES) * 100));
            }
            if (currentLoaded === TOTAL_FRAMES) {
                setAllLoaded(true);
            }
        };
        
        const handleError = () => {
            loadedCountRef.current++;
            if (loadedCountRef.current === TOTAL_FRAMES) setAllLoaded(true);
        };

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            // Decode hints for faster decoding
            img.decoding = 'async';
            img.src = `/images/burger/${i}.jpg`;
            img.onload = handleLoad;
            img.onerror = handleError;
            images.push(img);
        }
        imagesRef.current = images;

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // ── Draw frame — COVER fit (fills every pixel, no letterboxing)
    const drawFrame = useCallback((frameIndex) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const img = imagesRef.current[frameIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const ctx = canvas.getContext('2d');
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // object-fit: cover — scale UP to fill, crop the excess
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        // Center the crop
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    // ── Canvas resize — use device pixel ratio for crisp rendering on retinas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            // Re-enable image smoothing for high quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            if (allLoaded && lastFrameRef.current >= 0) drawFrame(lastFrameRef.current);
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [allLoaded, drawFrame]);

    // ── Scroll → frame update
    useEffect(() => {
        if (!allLoaded) return;
        const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(scrollProgress * (TOTAL_FRAMES - 1)))
        );
        if (frameIndex === lastFrameRef.current) return;
        lastFrameRef.current = frameIndex;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }, [scrollProgress, allLoaded, drawFrame]);

    // ── Apple-style quality reveal: blur + scale clears over first 8% of scroll
    const REVEAL_END = 0.08;
    const revealT = Math.min(1, scrollProgress / REVEAL_END); // 0 → 1 during reveal
    const blur = allLoaded ? (1 - revealT) * 8 : 0;          // 8px → 0px
    const scale = allLoaded ? 1 + (1 - revealT) * 0.06 : 1;  // 1.06 → 1.0

    return (
        <>
            {/* Loading overlay */}
            {!allLoaded && (
                <div className="burger-loading-overlay">
                    <div className="burger-loading-text">Loading Experience</div>
                    <div className="burger-loading-bar-track">
                        <div
                            className="burger-loading-bar-fill"
                            style={{ width: `${loadProgress}%` }}
                        />
                    </div>
                    <div className="burger-loading-text" style={{ fontSize: '0.75rem', opacity: 0.4 }}>
                        {loadProgress}%
                    </div>
                </div>
            )}

            {/* Canvas — full-screen cover + quality reveal transform */}
            <canvas
                ref={canvasRef}
                className="burger-canvas"
                style={{
                    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none',
                    transform: `scale(${scale.toFixed(4)})`,
                    // scale must go beyond 1 to avoid white edges during blur
                    transformOrigin: 'center center',
                    willChange: 'transform, filter',
                    transition: 'filter 0.05s linear, transform 0.05s linear',
                }}
            />

            {/* Text overlays */}
            {allLoaded && children}

            {/* Hero brand wordmark — top-left, fades on scroll */}
            {allLoaded && (
                <div
                    className="burger-hero-brand"
                    style={{ opacity: Math.max(0, 1 - scrollProgress / 0.12) }}
                >
                    Global Recipe Book
                </div>
            )}

            {/* Scroll hint — only show at very start */}
            {allLoaded && scrollProgress < 0.04 && (
                <div className="burger-scroll-hint">
                    <div className="burger-scroll-hint-line" />
                    <div className="burger-scroll-hint-text">Scroll</div>
                </div>
            )}

            {/* Progress dots */}
            {allLoaded && (
                <div className="burger-progress-dots">
                    {[0, 0.25, 0.5, 0.75, 1].map((threshold, i) => (
                        <div
                            key={i}
                            className={`burger-dot ${scrollProgress >= threshold - 0.05 && scrollProgress < threshold + 0.2
                                ? 'active'
                                : ''
                                }`}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
