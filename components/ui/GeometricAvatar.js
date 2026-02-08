"use client";
import React, { useMemo } from "react";

const shapes = [
    // Circle-ish
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
    // Square-ish (rounded)
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z",
    // Triangle-ish (soft)
    "M12 2L2 22h20L12 2zm0 3.8l7.2 14.4H4.8L12 5.8z",
    // Hexagon-ish
    "M21 16.5l-9 5.2-9-5.2v-9l9-5.2 9 5.2v9zM12 3.2L4.2 7.7v8.6l7.8 4.5 7.8-4.5V7.7L12 3.2z",
    // Star-ish
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
];

const colors = [
    ["#ff00ff", "#bf00ff"], // Neon Pink to Purple
    ["#00ffff", "#0000ff"], // Neon Cyan to Blue
    ["#ffff00", "#ff6600"], // Neon Yellow to Orange
    ["#39ff14", "#00ffff"], // Neon Green to Cyan
    ["#bf00ff", "#ff00ff"], // Purple to Pink
];

export default function GeometricAvatar({ name = "", className = "" }) {
    // Deterministic generation based on name
    const hash = useMemo(() => {
        let h = 0;
        for (let i = 0; i < name.length; i++) {
            h = Math.imul(31, h) + name.charCodeAt(i) | 0;
        }
        return Math.abs(h);
    }, [name]);

    const shapeIndex = hash % shapes.length;
    const colorIndex = hash % colors.length;
    const gradientId = `grad-${name.replace(/\s/g, '-')}`;
    return (
        <div className={`relative flex items-center justify-center bg-arcade-bg overflow-hidden ${className}`}>
            <svg viewBox="0 0 24 24" className="w-full h-full p-2" style={{ imageRendering: 'pixelated' }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colors[colorIndex][0]} />
                        <stop offset="100%" stopColor={colors[colorIndex][1]} />
                    </linearGradient>
                </defs>
                <path d={shapes[shapeIndex]} fill={`url(#${gradientId})`} stroke="var(--color-arcade-text)" strokeWidth="0.5" />

            </svg>
        </div>
    );
}
