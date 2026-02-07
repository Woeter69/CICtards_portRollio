"use client";
import { useEffect, useRef, useState } from "react";

export default function RacingGame() {
    const canvasRef = useRef(null);
    const [stats, setStats] = useState({ speed: 0, lap: 1, position: "01/05" });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const CANVAS_WIDTH = canvas.width;
        const CANVAS_HEIGHT = canvas.height;

        // Game State
        const car = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2 + 100,
            angle: -Math.PI / 2,
            speed: 0,
            accel: 0.4,
            friction: 0.92,
            turnSpeed: 0.1,
            maxSpeed: 14,
            width: 44,
            height: 88
        };

        // Input handling
        const keys = {};
        const handleKeyDown = (e) => {
            e.preventDefault();
            keys[e.key] = true;
        };
        const handleKeyUp = (e) => {
            e.preventDefault();
            keys[e.key] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // Load Assets
        const carImage = new Image();
        carImage.src = "/assets/games/pranjul/Ferrari/Ferrari.png";

        const trackImage = new Image();
        trackImage.src = "/assets/games/pranjul/RacingTilemap.png";

        let assetsLoaded = 0;
        const totalAssets = 2;
        const checkLoaded = () => {
            assetsLoaded++;
            console.log(`Loaded ${assetsLoaded}/${totalAssets} assets`);
        };

        carImage.onload = checkLoaded;
        trackImage.onload = checkLoaded;

        /**
         * NEW APPROACH: Use a single large pre-made circuit
         * 
         * The tilemap contains complete circuits in rows 4-6.
         * Instead of trying to piece together tiles, we'll use
         * ONE large circuit tile as the entire track.
         * 
         * We'll use tile [4,5] which appears to be a large oval circuit
         */

        // Track bounds for collision (approximate oval shape)
        const trackCenterX = CANVAS_WIDTH / 2;
        const trackCenterY = CANVAS_HEIGHT / 2;
        const trackWidth = 500;
        const trackHeight = 400;
        const trackThickness = 80;

        // Check if position is on track (oval shape)
        const isOnTrack = (x, y) => {
            const dx = (x - trackCenterX) / (trackWidth / 2);
            const dy = (y - trackCenterY) / (trackHeight / 2);
            const distFromCenter = Math.sqrt(dx * dx + dy * dy);

            // On track if within outer oval but outside inner oval
            const outerRadius = 1.0;
            const innerRadius = 1.0 - (trackThickness / (trackWidth / 2));

            return distFromCenter <= outerRadius && distFromCenter >= innerRadius;
        };

        // Update game state
        const update = () => {
            if (assetsLoaded < totalAssets) return;

            // Handle acceleration
            let nextSpeed = car.speed;
            if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
                nextSpeed += car.accel;
            }
            if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
                nextSpeed -= car.accel * 0.7;
            }

            // Handle steering
            let nextAngle = car.angle;
            if (Math.abs(car.speed) > 0.5) {
                const direction = car.speed > 0 ? 1 : -1;
                if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
                    nextAngle -= car.turnSpeed * direction;
                }
                if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
                    nextAngle += car.turnSpeed * direction;
                }
            }

            // Apply friction
            nextSpeed *= car.friction;
            if (Math.abs(nextSpeed) < 0.1) nextSpeed = 0;

            // Clamp speed
            if (nextSpeed > car.maxSpeed) nextSpeed = car.maxSpeed;
            if (nextSpeed < -car.maxSpeed / 2) nextSpeed = -car.maxSpeed / 2;

            // Calculate next position
            const nextX = car.x + Math.cos(nextAngle) * nextSpeed;
            const nextY = car.y + Math.sin(nextAngle) * nextSpeed;

            // Collision detection
            const checkPoints = [
                [nextX - 20, nextY - 20],
                [nextX + 20, nextY - 20],
                [nextX - 20, nextY + 20],
                [nextX + 20, nextY + 20],
                [nextX, nextY]
            ];

            const allPointsOnTrack = checkPoints.every(([px, py]) => isOnTrack(px, py));

            if (allPointsOnTrack) {
                car.x = nextX;
                car.y = nextY;
                car.speed = nextSpeed;
                car.angle = nextAngle;
            } else {
                car.speed = -car.speed * 0.4;
            }
        };

        // Render game
        const draw = () => {
            // Loading screen
            if (assetsLoaded < totalAssets) {
                ctx.fillStyle = "#0a0a0a";
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.fillStyle = "#ff0000";
                ctx.font = "24px monospace";
                ctx.textAlign = "center";
                ctx.fillText("LOADING RACE...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                ctx.fillStyle = "#ffff00";
                ctx.font = "14px monospace";
                ctx.fillText(`${assetsLoaded}/${totalAssets} ASSETS`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
                return;
            }

            // Clear canvas with grass color
            ctx.fillStyle = "#1a5e1f";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Draw the large circuit tile centered on canvas
            // Using tile [4,5] - the large oval circuit
            const tileSize = 128;
            const scale = 4.5; // Scale up the circuit to fill the canvas
            const scaledSize = tileSize * scale;

            ctx.save();
            ctx.imageSmoothingEnabled = false; // Pixel-perfect scaling

            // Draw the circuit centered
            ctx.drawImage(
                trackImage,
                4 * 128, 5 * 128, 128, 128, // Source: tile [4,5]
                trackCenterX - scaledSize / 2,
                trackCenterY - scaledSize / 2,
                scaledSize,
                scaledSize
            );

            ctx.restore();

            // Draw car
            ctx.save();
            ctx.translate(car.x, car.y);
            ctx.rotate(car.angle + Math.PI / 2);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(carImage, -car.width / 2, -car.height / 2, car.width, car.height);
            ctx.restore();

            // Update stats
            setStats({
                speed: Math.round(Math.abs(car.speed) * 18),
                lap: 1,
                position: "01/05"
            });
        };

        // Game loop
        const loop = () => {
            update();
            draw();
            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        // Cleanup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center border-4 border-red-600 overflow-hidden shadow-2xl">
            {/* HUD - Top Left */}
            <div className="absolute top-4 left-4 bg-black/95 p-4 border-2 border-red-500 font-mono text-sm z-[100] shadow-2xl">
                <div className="text-red-500 font-bold tracking-wider text-lg">
                    {stats.speed.toString().padStart(3, '0')} KPH
                </div>
                <div className="text-yellow-400 font-bold tracking-wider mt-2">
                    P{stats.position}
                </div>
                <div className="text-green-400 font-bold tracking-wider mt-1">
                    LAP {stats.lap}/3
                </div>
                <div className="text-white/40 text-[9px] mt-3 uppercase tracking-wide">
                    Ferrari SF-75
                </div>
            </div>

            {/* Main Canvas */}
            <canvas
                ref={canvasRef}
                width={900}
                height={700}
                className="max-w-full h-auto cursor-crosshair border-2 border-white/20 shadow-2xl"
            />

            {/* Controls - Bottom Left */}
            <div className="absolute bottom-4 left-4 bg-black/90 p-3 border border-yellow-500/60 font-mono text-[11px] text-yellow-300 shadow-xl">
                <div className="font-bold text-yellow-400 mb-2">CONTROLS</div>
                <div className="flex items-center gap-2">
                    <span className="text-white/70">↑/W</span>
                    <span>Accelerate</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white/70">↓/S</span>
                    <span>Brake</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white/70">←→/AD</span>
                    <span>Steer</span>
                </div>
            </div>

            {/* Status - Bottom Right */}
            <div className="absolute bottom-4 right-4 text-[10px] text-red-500/60 font-mono">
                <div className="animate-pulse">&gt; ENGINE: V12_ACTIVE</div>
                <div className="text-green-500/60 mt-1">&gt; TRACTION: OPTIMAL</div>
            </div>
        </div>
    );
}
