import React, { useRef, useEffect, useState } from 'react';
import { useMotionValue } from 'framer-motion';
import BurgerScrollScene from './BurgerScrollScene';
import BurgerTextOverlays from './BurgerTextOverlays';
import './burger-scroll.css';

const SCROLL_HEIGHT_VH = 600;

export default function BurgerSection() {
    const wrapperRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollMotionValue = useMotionValue(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = wrapperRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const totalScrollDistance = el.offsetHeight - window.innerHeight;
            const scrolled = -rect.top;
            const progress = Math.min(1, Math.max(0, scrolled / totalScrollDistance));
            setScrollProgress(progress);
            scrollMotionValue.set(progress);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollMotionValue]);

    return (
        <div className="burger-section-root">
            <div
                ref={wrapperRef}
                className="burger-scroll-wrapper"
                style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
            >
                <div className="burger-scroll-sticky">
                    <BurgerScrollScene scrollProgress={scrollProgress}>
                        <BurgerTextOverlays scrollMotionValue={scrollMotionValue} />
                    </BurgerScrollScene>
                </div>
            </div>
        </div>
    );
}
