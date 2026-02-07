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

            // Filter out old points
            pointsRef.current = pointsRef.current.filter((point) => point.age < 50);

            // Draw the "thread"
            if (pointsRef.current.length > 1) {
                ctx.beginPath();
                ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);

                // Draw slight curve through points for smoother thread
                for (let i = 1; i < pointsRef.current.length; i++) {
                    const point = pointsRef.current[i];
                    ctx.lineTo(point.x, point.y);
                }

                ctx.lineCap = "round"; // Smoother train
                ctx.lineJoin = "round";
                ctx.strokeStyle = color;
                ctx.lineWidth = 12; // Thicker smooth trail
                ctx.shadowColor = color;
                ctx.shadowBlur = 20;
                ctx.globalAlpha = 0.6;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Draw "pixels" floating around the trail
            pointsRef.current.forEach((point) => {
                point.age += 1;
                const life = 1 - point.age / 50;
                const size = 60 * life; // Huge 60px pixels as requested

                // Deterministic random position based on point coordinates to keep it stable but scattered
                const offsetX = (Math.sin(point.x * 0.1 + point.age * 0.2) * 30 * life);
                const offsetY = (Math.cos(point.y * 0.1 + point.age * 0.2) * 30 * life);

                ctx.fillStyle = color;
                ctx.globalAlpha = life * 0.4; // Slightly transparent to see through
                // Draw scattered square
                ctx.fillRect(point.x + offsetX - size / 2, point.y + offsetY - size / 2, size, size);
            });

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
