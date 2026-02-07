"use client";
import { useEffect, useRef, useState } from "react";

export default function ScratchRevealImage({
    src,
    alt,
    width,
    height,
    className,
    style,
    onScratch,
    onMouseEnter,
    onMouseLeave
}) {
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef(null);
    const scratchPointsRef = useRef([]); // Store scratch points:{x, y, age}
    const animationFrameRef = useRef(null);

    // Initial load
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.crossOrigin = "Anonymous"; // Crucial for canvas operations
        imageRef.current = img;

        img.onload = () => {
            setIsLoaded(true);
            // Start the loop once loaded
            startLoop();
        };

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [src]);

    const startLoop = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const loop = () => {
            drawFrame();
            animationFrameRef.current = requestAnimationFrame(loop);
        };
        loop();
    };

    const drawFrame = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageRef.current) return;

        const ctx = canvas.getContext("2d");

        // Ensure canvas size matches display
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        // 1. Clear everything
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Draw the base image (The Helmet)
        ctx.globalCompositeOperation = "source-over";

        const img = imageRef.current;
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // 3. Update scratch points (age them)
        // Filter out dead points (Extend lifespan to 300 frames = ~5 seconds)
        scratchPointsRef.current = scratchPointsRef.current.filter(p => p.age < 300);
        scratchPointsRef.current.forEach(p => p.age++);

        // 4. Draw erasers for active points
        if (scratchPointsRef.current.length > 0) {
            ctx.globalCompositeOperation = "destination-out";

            scratchPointsRef.current.forEach(point => {
                ctx.beginPath();
                // Radius can shrink slightly as it dies for smoother heal? Or keep constant.
                // improved: Shrink slightly at end of life for "closing up" effect
                // Start shrinking only in the last 60 frames (after 240)
                // Base radius increased to 80px (160px diameter) for BIG reveal
                const radius = point.age > 240 ? (300 - point.age) * (80 / 60) : 80;
                ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    };

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add new scratch point
        scratchPointsRef.current.push({ x, y, age: 0 });

        if (onScratch) onScratch();
    };

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ ...style, touchAction: "none" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchMove={(e) => {
                const touch = e.touches[0];
                handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
            }}
        />
    );
}
