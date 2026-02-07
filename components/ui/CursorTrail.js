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
            pointsRef.current = pointsRef.current.filter((point) => point.age < 25);

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
                ctx.lineWidth = 2;
                ctx.shadowColor = color;
                ctx.shadowBlur = 5; // Glow effect
                ctx.globalAlpha = 0.6;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Draw "pixels" at each point
            pointsRef.current.forEach((point) => {
                point.age += 1;
                const life = 1 - point.age / 25;
                const size = 6 * life; // Pixels shrink

                ctx.fillStyle = color;
                ctx.globalAlpha = life;
                // Draw square for pixel look
                ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
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
