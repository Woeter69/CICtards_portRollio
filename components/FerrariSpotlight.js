"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Link from "next/link";

const TOTAL_FRAMES = 240;
const SCROLL_HEIGHT = 5000;

// Contextual annotations based on Ferrari parts being revealed
// Frame 1 starts with ENGINE, so map accordingly
const annotations = [
    {
        scrollStart: 0.0,
        scrollEnd: 0.2,
        title: "ENGINE: CORE STRENGTH",
        description: "Full-stack development • System architecture • Backend mastery",
        position: { x: "15%", y: "35%" },
        arrowFrom: { x: "50%", y: "50%" }, // Engine center
        color: "#CC0000"
    },
    {
        scrollStart: 0.2,
        scrollEnd: 0.4,
        title: "POWERTRAIN: PERFORMANCE",
        description: "Algorithm optimization • Scalable microservices • Cloud-native",
        position: { x: "75%", y: "30%" },
        arrowFrom: { x: "55%", y: "55%" }, // Transmission area
        color: "#8B4513"
    },
    {
        scrollStart: 0.4,
        scrollEnd: 0.6,
        title: "COCKPIT: SKILLS & EXPERTISE",
        description: "React • Next.js • TypeScript • Modern frameworks • UI/UX design",
        position: { x: "10%", y: "55%" },
        arrowFrom: { x: "45%", y: "40%" }, // Cockpit/steering
        color: "#CC0000"
    },
    {
        scrollStart: 0.6,
        scrollEnd: 0.75,
        title: "CHASSIS: FOUNDATION",
        description: "Solid architecture • Component design • Reusable systems",
        position: { x: "70%", y: "65%" },
        arrowFrom: { x: "50%", y: "60%" }, // Chassis structure
        color: "#8B4513"
    },
    {
        scrollStart: 0.75,
        scrollEnd: 0.95,
        title: "AERODYNAMICS: EFFICIENCY",
        description: "Code optimization • Performance tuning • Best practices",
        position: { x: "20%", y: "25%" },
        arrowFrom: { x: "52%", y: "35%" }, // Wings/aero
        color: "#CC0000"
    }
];

export default function FerrariSpotlight({ member }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const frameIndex = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

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

            // Background color transition: dark to cream as user scrolls
            const progress = smoothProgress.get();
            const bgR = Math.round(37 + (218 - 37) * progress);
            const bgG = Math.round(36 + (213 - 36) * progress);
            const bgB = Math.round(35 + (208 - 35) * progress);
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate zoom based on scroll (start zoomed out, zoom in as you scroll)
            const zoomFactor = 0.6 + (progress * 0.4); // Start at 60%, zoom to 100%

            // Full-page Ferrari with zoom - COVER mode (no square confinement)
            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            // Cover the entire canvas (like background-size: cover)
            if (imgAspect > canvasAspect) {
                drawHeight = canvas.height * zoomFactor;
                drawWidth = (canvas.height * zoomFactor) * imgAspect;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.width * zoomFactor;
                drawHeight = (canvas.width * zoomFactor) / imgAspect;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            // Enhanced fog overlay around entire Ferrari to hide Veo watermark
            // Bottom fog
            const bottomGradient = ctx.createLinearGradient(0, canvas.height - 200, 0, canvas.height);
            bottomGradient.addColorStop(0, `rgba(${bgR}, ${bgG}, ${bgB}, 0)`);
            bottomGradient.addColorStop(1, `rgba(${bgR}, ${bgG}, ${bgB}, 0.95)`);
            ctx.fillStyle = bottomGradient;
            ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

            // Right edge fog (where Veo logo appears)
            const rightGradient = ctx.createLinearGradient(canvas.width - 250, 0, canvas.width, 0);
            rightGradient.addColorStop(0, `rgba(${bgR}, ${bgG}, ${bgB}, 0)`);
            rightGradient.addColorStop(1, `rgba(${bgR}, ${bgG}, ${bgB}, 0.9)`);
            ctx.fillStyle = rightGradient;
            ctx.fillRect(canvas.width - 250, 0, 250, canvas.height);

            // Top fog for balance
            const topGradient = ctx.createLinearGradient(0, 0, 0, 150);
            topGradient.addColorStop(0, `rgba(${bgR}, ${bgG}, ${bgB}, 0.7)`);
            topGradient.addColorStop(1, `rgba(${bgR}, ${bgG}, ${bgB}, 0)`);
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
            {/* Loading Screen */}
            {!isLoaded && (
                <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ backgroundColor: 'rgb(37, 36, 35)' }}>
                    <div className="text-6xl font-black text-[#CC0000] mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {loadingProgress}%
                    </div>
                    <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#CC0000]"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <div className="text-sm text-gray-400 mt-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        LOADING FERRARI SF-26
                    </div>
                </div>
            )}

            {/* Scrolling Canvas (not sticky) */}
            {isLoaded && (
                <div className="relative w-full" style={{ height: `${SCROLL_HEIGHT}px` }}>
                    {/* Canvas positioned sticky, follows scroll */}
                    <div className="sticky top-0 left-0 w-full h-screen">
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>

                    {/* SVG Arrows Layer */}
                    <svg className="sticky top-0 left-0 w-full h-screen pointer-events-none" style={{ zIndex: 10 }}>
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="8"
                                markerHeight="8"
                                refX="6"
                                refY="3"
                                orient="auto"
                            >
                                <polygon points="0 0, 6 3, 0 6" fill="#8B4513" />
                            </marker>
                        </defs>
                        {annotations.map((ann, i) => {
                            const progress = smoothProgress.get();
                            if (progress < ann.scrollStart || progress > ann.scrollEnd) return null;

                            const opacity = Math.min(
                                (progress - ann.scrollStart) / 0.03,
                                (ann.scrollEnd - progress) / 0.03,
                                1
                            );

                            // Angular elbow arrow
                            const fromX = parseFloat(ann.arrowFrom.x);
                            const fromY = parseFloat(ann.arrowFrom.y);
                            const toX = parseFloat(ann.position.x);
                            const toY = parseFloat(ann.position.y);

                            // Elbow path: horizontal then vertical
                            const midX = fromX + (toX - fromX) * 0.6;

                            return (
                                <g key={i} opacity={opacity}>
                                    <path
                                        d={`M ${fromX}% ${fromY}% L ${midX}% ${fromY}% L ${midX}% ${toY}% L ${toX}% ${toY}%`}
                                        stroke={ann.color}
                                        strokeWidth="2"
                                        fill="none"
                                        markerEnd="url(#arrowhead)"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Contextual Info Cards */}
                    {annotations.map((ann, i) => {
                        const progress = smoothProgress.get();
                        if (progress < ann.scrollStart || progress > ann.scrollEnd) return null;

                        const opacity = Math.min(
                            (progress - ann.scrollStart) / 0.03,
                            (ann.scrollEnd - progress) / 0.03,
                            1
                        );

                        return (
                            <motion.div
                                key={i}
                                className="absolute bg-white/95 border-3 p-5 rounded-lg shadow-2xl max-w-sm"
                                style={{
                                    left: ann.position.x,
                                    top: ann.position.y,
                                    opacity,
                                    zIndex: 20,
                                    borderColor: ann.color,
                                    borderWidth: '3px'
                                }}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-xl font-black mb-2"
                                    style={{
                                        fontFamily: 'JetBrains Mono, monospace',
                                        color: ann.color
                                    }}>
                                    {ann.title}
                                </h3>
                                <p className="text-sm leading-relaxed"
                                    style={{
                                        fontFamily: 'JetBrains Mono, monospace',
                                        color: '#8B4513'
                                    }}>
                                    {ann.description}
                                </p>
                            </motion.div>
                        );
                    })}

                    {/* Header */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-30">
                        <motion.h1
                            className="text-6xl font-black text-[#CC0000] mb-2 drop-shadow-lg"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            PRANJUL GUPTA
                        </motion.h1>
                        <motion.p
                            className="text-xl text-[#8B4513] font-bold"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            Lead Architect & Full-Stack Engineer
                        </motion.p>
                    </div>

                    {/* Footer Links */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-30">
                        <Link href="/#team">
                            <div className="px-6 py-3 bg-[#8B4513] text-white font-bold border-2 border-[#8B4513] hover:bg-white hover:text-[#8B4513] transition-all cursor-pointer shadow-lg"
                                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                ← BACK TO TEAM
                            </div>
                        </Link>
                        <a href="https://github.com/pranjul" target="_blank" rel="noopener noreferrer"
                            className="px-6 py-3 bg-white text-[#8B4513] font-bold border-2 border-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-all shadow-lg"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            GITHUB →
                        </a>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute top-1/2 right-8 text-[#8B4513]/60 text-sm z-30"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: smoothProgress.get() < 0.1 ? 1 : 0 }}
                    >
                        SCROLL ↓
                    </motion.div>
                </div>
            )}
        </div>
    );
}
