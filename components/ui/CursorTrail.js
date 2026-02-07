"use client";
import { useEffect, useRef } from "react";

export default function CursorTrail({ color = "#FF2800", isActive = true }) {
    const canvasRef = useRef(null);
    const pointsRef = useRef([]);
    const isActiveRef = useRef(isActive);

    // Keep ref in sync
    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e) => {
            // Only add points if active
            if (isActiveRef.current) {
                pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
            }
        };

        window.addEventListener("resize", updateSize);
        window.addEventListener("mousemove", handleMouseMove);
        updateSize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Increment age for ALL points first
            pointsRef.current.forEach(p => p.age += 1);

            // Filter out old points - faster fade if inactive
            const maxAge = isActiveRef.current ? 15 : 5;
            pointsRef.current = pointsRef.current.filter((point) => point.age < maxAge);

            // Draw the "thread"
            if (pointsRef.current.length > 1) {
                ctx.beginPath();
                ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);

                // Draw slight curve through points for smoother thread
                for (let i = 1; i < pointsRef.current.length; i++) {
                    const point = pointsRef.current[i];
                    ctx.lineTo(point.x, point.y);
                }

                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = color;
                ctx.lineWidth = 60; // Huge smooth trail as requested
                ctx.shadowColor = color;
                ctx.shadowBlur = 30;
                ctx.globalAlpha = isActiveRef.current ? 0.5 : 0.1; // Fade out slightly if inactive
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Pixels element removed completely for smooth look

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", updateSize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[50]"
        />
    );
}
