"use client";
import { useEffect, useRef } from "react";

export default function CursorTrail({ color = "#FF2800" }) {
    const canvasRef = useRef(null);
    const pointsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e) => {
            // Add new point with age 0
            pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
        };

        window.addEventListener("resize", updateSize);
        window.addEventListener("mousemove", handleMouseMove);
        updateSize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Increment age for ALL points first
            pointsRef.current.forEach(p => p.age += 1);

            // Filter out old points
            pointsRef.current = pointsRef.current.filter((point) => point.age < 15);  // Reduced age for faster fade

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
                ctx.globalAlpha = 0.5;
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
            className="fixed inset-0 pointer-events-none z-[9999]"
        />
    );
}
