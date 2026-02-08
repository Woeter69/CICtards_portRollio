"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import CursorTrail from "./ui/CursorTrail";
import ScratchRevealImage from "./ui/ScratchRevealImage";

const TOTAL_FRAMES = 720; // Extended with third batch of frames (481-720)
const HERO_HEIGHT = 1000; // Hero section height
const SCROLL_HEIGHT = 6000; // Increased for hero + Ferrari

// Section 1: Only ENGINE (strengths) and COCKPIT (skills)
const annotations = [
    {
        scrollStart: 0.3, // Delayed to appear AFTER the "High-Speed Overtake" animation (0.25)
        scrollEnd: 0.55,
        title: "ENGINE: CORE STRENGTHS",
        description: "Full-stack development • System architecture • Backend mastery • Problem solving",
        position: { x: "15%", y: "35%" },
        color: "#CC0000"
    },
    {
        scrollStart: 0.6, // Clean separation from previous card
        scrollEnd: 0.95,
        title: "COCKPIT: SKILLS & EXPERTISE",
        description: "React • Next.js • TypeScript • Node.js • Modern frameworks • UI/UX design",
        position: { x: "70%", y: "55%" },
        color: "#00FF41"
    }
];

export default function FerrariSpotlight({ member }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [isHoveringInteractable, setIsHoveringInteractable] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // START FERRARI ANIMATION AFTER HERO SECTION (1000px / 6000px = ~0.166)
    // "High-Speed Overtake" Transition Logic

    // 1. Hero Exit Animation (0.1 -> 0.25)
    // As we scroll, zoom INTO the hero (simulate driving past), blur it, and fade out
    const heroScale = useTransform(smoothProgress, [0.1, 0.25], [1, 1.5]);
    const heroOpacity = useTransform(smoothProgress, [0.15, 0.25], [1, 0]);
    // FIXED: Return full filter string to avoid useTransform in JSX
    const heroBlur = useTransform(smoothProgress, [0.1, 0.25], ["blur(0px)", "blur(10px)"]);

    // 2. Ferrari Entrance Animation (0.15 -> 0.3)
    // The car zooms in slightly, slides up, and comes into focus
    const ferrariProgress = useTransform(smoothProgress, [0.166, 1], [0, 1]);

    const ferrariOpacity = useTransform(smoothProgress, [0.15, 0.25], [0, 1]);
    const ferrariScale = useTransform(smoothProgress, [0.15, 0.25], [0.9, 1.0]);
    const ferrariY = useTransform(smoothProgress, [0.15, 0.25], ["100px", "0px"]);
    // FIXED: Return full filter string to avoid useTransform in JSX
    const ferrariBlur = useTransform(smoothProgress, [0.15, 0.25], ["blur(10px)", "blur(0px)"]);

    // Frames only update once we're past the hero section
    const frameIndex = useTransform(ferrariProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Track progress changes to trigger re-renders
    useMotionValueEvent(smoothProgress, "change", (latest) => {
        setCurrentProgress(latest);
    });

    // Preload frames
    useEffect(() => {
        const loadImages = async () => {
            const imageArray = [];
            let loaded = 0;

            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const img = new Image();
                const frameNumber = String(i).padStart(3, '0');
                img.src = `/ferrari/ezgif-frame-${frameNumber}.jpg`;

                img.onload = () => {
                    loaded++;
                    setLoadingProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
                    if (loaded === TOTAL_FRAMES) setIsLoaded(true);
                };

                imageArray.push(img);
            }
            setImages(imageArray);
        };
        loadImages();
    }, []);

    // Render frame
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const render = () => {
            const index = Math.min(Math.floor(frameIndex.get()), images.length - 1);
            const img = images[index];
            if (!img || !img.complete) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Background color transition: dark to cream
            const progress = smoothProgress.get();
            const bgR = Math.round(37 + (218 - 37) * progress);
            const bgG = Math.round(36 + (213 - 36) * progress);
            const bgB = Math.round(35 + (208 - 35) * progress);
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // TRUE COVER MODE - Ferrari fills entire screen
            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            // Always fill the entire canvas (cover mode)
            if (imgAspect > canvasAspect) {
                // Image wider - fit to height, crop width
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgAspect;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Image taller - fit to width, crop height
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgAspect;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            // Fog overlay to hide Veo watermark - ALWAYS DARK
            const fogR = 37;
            const fogG = 36;
            const fogB = 35;

            // Bottom fog
            const bottomGradient = ctx.createLinearGradient(0, canvas.height - 200, 0, canvas.height);
            bottomGradient.addColorStop(0, `rgba(${fogR}, ${fogG}, ${fogB}, 0)`);
            bottomGradient.addColorStop(1, `rgba(${fogR}, ${fogG}, ${fogB}, 0.95)`);
            ctx.fillStyle = bottomGradient;
            ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

            // Right edge fog
            const rightGradient = ctx.createLinearGradient(canvas.width - 250, 0, canvas.width, 0);
            rightGradient.addColorStop(0, `rgba(${fogR}, ${fogG}, ${fogB}, 0)`);
            rightGradient.addColorStop(1, `rgba(${fogR}, ${fogG}, ${fogB}, 0.9)`);
            ctx.fillStyle = rightGradient;
            ctx.fillRect(canvas.width - 250, 0, 250, canvas.height);

            // Top fog
            const topGradient = ctx.createLinearGradient(0, 0, 0, 150);
            topGradient.addColorStop(0, `rgba(${fogR}, ${fogG}, ${fogB}, 0.7)`);
            topGradient.addColorStop(1, `rgba(${fogR}, ${fogG}, ${fogB}, 0)`);
            ctx.fillStyle = topGradient;
            ctx.fillRect(0, 0, canvas.width, 150);
        };

        const unsubscribe = frameIndex.on("change", render);
        render();

        const handleResize = () => render();
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, [isLoaded, images, frameIndex, smoothProgress]);

    return (
        <div ref={containerRef} className="relative" style={{ height: `${SCROLL_HEIGHT}px`, backgroundColor: 'rgb(37, 36, 35)' }}>
            {/* Hero Background Layer - Separate from content to allow Trail in between */}
            <div className="absolute top-0 left-0 w-full bg-[rgb(218,213,208)]" style={{ height: `${HERO_HEIGHT}px`, zIndex: 0 }} />

            <CursorTrail color="#FF2800" isActive={!isHoveringInteractable} /> {/* z-index 10 inside component */}

            {/* Loading Screen */}
            {!isLoaded && (
                <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ backgroundColor: 'rgb(37, 36, 35)' }}>
                    <div className="text-6xl font-black text-[#CC0000] mb-4" style={{ fontFamily: 'var(--font-family-mono)', userSelect: 'none' }}>
                        {loadingProgress}%
                    </div>
                    <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#CC0000]"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <div className="text-sm text-gray-400 mt-4" style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--font-size)', userSelect: 'none' }}>
                        LOADING FERRARI SF-26
                    </div>
                </div>
            )}

            {/* Hero Section - Content (Hamilton with Scratchable Helmet Overlay) */}
            {isLoaded && (
                <motion.div
                    className="relative w-full overflow-hidden"
                    style={{
                        height: `${HERO_HEIGHT}px`,
                        pointerEvents: 'none',
                        // Apply Exit Animations to entire Hero container
                        scale: heroScale,
                        opacity: heroOpacity,
                        filter: heroBlur // FIXED: Use pre-calculated motion value
                    }}
                >

                    {/* Layer 1: "44" Text (z-1) - Background decoration */}
                    <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center" style={{ zIndex: 1 }}>
                        <h1 className="text-[40vw] font-black select-none"
                            style={{
                                WebkitTextStroke: '3px rgb(37,36,35)',
                                color: 'transparent',
                                fontFamily: 'var(--font-family-mono)',
                                lineHeight: 1
                            }}>
                            44
                        </h1>
                    </div>

                    {/* Layer 2: Main Scratch Interaction (z-40) */}
                    <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 40, pointerEvents: 'none' }}>
                        <div className="sticky top-0 left-0 w-full h-screen">
                            {/* Hamilton Face (Base Layer) - z-index 40 */}
                            <motion.div
                                className="absolute inset-0 flex items-end justify-center pointer-events-auto" // Re-enable interaction
                                style={{ zIndex: 40 }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.3 }}
                            >
                                <img
                                    src="/hamilton.png"
                                    alt="Lewis Hamilton"
                                    className="h-[90vh] object-contain pointer-events-auto"
                                    style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
                                    onMouseEnter={() => setIsHoveringInteractable(true)}
                                    onMouseLeave={() => setIsHoveringInteractable(false)}
                                />
                            </motion.div>

                            {/* Scratchable Helmet (Top Layer) - z-index 50 */}
                            {/* SCRATCH REVEAL: This canvas sits on top. Cursor erases it to reveal Hamilton below. */}
                            <motion.div
                                className="absolute inset-0 flex items-start justify-center -mt-[10vh] pointer-events-auto" // Interactive layer!
                                style={{ zIndex: 50 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                            >
                                <ScratchRevealImage
                                    src="/LH_2025_helmet-1-removebg-preview.png"
                                    width={window.innerWidth} // Pass window dimensions for crisp canvas
                                    height={window.innerHeight}
                                    className="w-[105vh] h-[105vh] object-contain drop-shadow-2xl cursor-crosshair"
                                    onMouseEnter={() => setIsHoveringInteractable(true)}
                                    onMouseLeave={() => setIsHoveringInteractable(false)}
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
            {/* Main Content - Ferrari */}
            {isLoaded && (
                <div className="relative w-full" style={{ height: `${SCROLL_HEIGHT}px` }}>
                    {/* Sticky Canvas with High-Speed Entry Animation */}
                    <motion.div
                        className="sticky top-0 left-0 w-full h-screen"
                        style={{
                            opacity: ferrariOpacity,
                            scale: ferrariScale,
                            y: ferrariY,
                            filter: ferrariBlur // FIXED: Use pre-calculated motion value
                        }}
                    >
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </motion.div>

                    {/* SVG Arrows */}
                    <svg className="sticky top-0 left-0 w-full h-screen pointer-events-none" style={{ zIndex: 10 }}>
                        <defs>
                            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                <polygon points="0 0, 6 3, 0 6" fill="#8B4513" />
                            </marker>
                        </defs>
                        {annotations.map((ann, i) => {
                            if (currentProgress < ann.scrollStart || currentProgress > ann.scrollEnd) return null;

                            // Better opacity calculation
                            const fadeInDuration = 0.05;
                            const fadeOutDuration = 0.05;

                            let opacity = 1;
                            if (currentProgress < ann.scrollStart + fadeInDuration) {
                                opacity = (currentProgress - ann.scrollStart) / fadeInDuration;
                            } else if (currentProgress > ann.scrollEnd - fadeOutDuration) {
                                opacity = (ann.scrollEnd - currentProgress) / fadeOutDuration;
                            }
                            opacity = Math.max(0, Math.min(1, opacity));

                            return null; // No arrows in Section 1
                        })}
                    </svg>

                    {/* Info Cards - Fixed Position */}
                    {annotations.map((ann, i) => {
                        if (currentProgress < ann.scrollStart || currentProgress > ann.scrollEnd) return null;

                        // Better opacity calculation - full opacity in middle, fade at edges
                        const fadeInDuration = 0.05; // 5% fade in
                        const fadeOutDuration = 0.05; // 5% fade out

                        let opacity = 1;
                        if (currentProgress < ann.scrollStart + fadeInDuration) {
                            // Fade in from start
                            opacity = (currentProgress - ann.scrollStart) / fadeInDuration;
                        } else if (currentProgress > ann.scrollEnd - fadeOutDuration) {
                            // Fade out at end
                            opacity = (ann.scrollEnd - currentProgress) / fadeOutDuration;
                        }
                        opacity = Math.max(0, Math.min(1, opacity));

                        return (
                            <motion.div
                                key={i}
                                className="fixed p-4 rounded-lg shadow-2xl max-w-sm backdrop-blur-md"
                                style={{
                                    left: ann.position.x,
                                    top: ann.position.y,
                                    opacity,
                                    zIndex: 20,
                                    backgroundColor: `rgba(0, 0, 0, 0.8)`, // Dark semi-transparent background for contrast
                                    borderColor: ann.color,
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    fontFamily: 'var(--font-family-mono)',
                                    fontSize: 'var(--font-size)',
                                    userSelect: 'none',
                                    boxShadow: `0 0 20px ${ann.color}40` // Subtle glow matching the section color
                                }}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="font-bold mb-2"
                                    style={{
                                        fontFamily: 'var(--font-family-mono)',
                                        fontSize: '13px',
                                        color: ann.color, // Bright section color (Red/Green)
                                        letterSpacing: '0.5px',
                                        textShadow: `0 0 10px ${ann.color}80` // Glow effect
                                    }}>
                                    {ann.title}
                                </h3>
                                <p className="leading-relaxed"
                                    style={{
                                        fontFamily: 'var(--font-family-mono)',
                                        fontSize: 'var(--font-size)',
                                        color: '#ebebeb', // Bright off-white text for readability
                                        lineHeight: '1.4'
                                    }}>
                                    {ann.description}
                                </p>
                            </motion.div>
                        );
                    })}

                    {/* Footer Links */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-30">
                        <Link href="/#team">
                            <div className="px-4 py-2 bg-[#1f1f1f] text-[#ebebeb] font-bold border border-[#424242] hover:bg-[#4f4f4f] transition-all cursor-pointer shadow-lg"
                                style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--font-size)', userSelect: 'none' }}>
                                ← BACK TO TEAM
                            </div>
                        </Link>
                        <a href="https://github.com/pranjul" target="_blank" rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#424242] text-[#ebebeb] font-bold border border-[#595959] hover:bg-[#595959] transition-all shadow-lg"
                            style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--font-size)', userSelect: 'none' }}>
                            GITHUB →
                        </a>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute top-1/2 right-8 z-30"
                        style={{
                            fontFamily: 'var(--font-family-mono)',
                            fontSize: 'var(--font-size)',
                            color: '#ebebeb',
                            opacity: 0.6,
                            userSelect: 'none'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: currentProgress < 0.1 ? 0.6 : 0 }}
                    >
                        SCROLL ↓
                    </motion.div>
                </div>
            )}
        </div>
    );
}
