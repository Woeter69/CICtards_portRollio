"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import GeometricAvatar from "./ui/GeometricAvatar";

export default function CharacterWheel({ members, onSelect }) {
    // Increased radius for both desktop and mobile
    const radius = 220; // Desktop radius (was 160)
    const mobileRadius = 130; // Mobile radius (was 100)

    return (
        <div className="relative w-full h-[350px] md:h-[600px] flex items-center justify-center">
            {/* Center Hub */}
            <div className="absolute z-10 text-center pointer-events-none">
                <h3 className="text-neon-cyan font-bold text-xl md:text-3xl text-glow-cyan animate-pulse">
                    SELECT<br />PLAYER
                </h3>
            </div>

            {/* Wheel Container */}
            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                {/* Visual Ring/Border */}
                <div
                    className="absolute rounded-full border-4 border-dashed border-neon-purple/30 box-glow-pink"
                    style={{
                        width: `calc(var(--wheel-radius) * 2)`,
                        height: `calc(var(--wheel-radius) * 2)`,
                    }}
                />

                {members.map((member, index) => {
                    const angle = (360 / members.length) * index;
                    const radian = (angle * Math.PI) / 180;

                    return (
                        <WheelItem
                            key={member.id}
                            member={member}
                            angle={angle}
                            radian={radian}
                            radius={radius}
                            mobileRadius={mobileRadius}
                            onSelect={() => onSelect(member)}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
}

function WheelItem({ member, angle, radian, radius, mobileRadius, onSelect }) {
    // Pre-calculate position factors (unit circle)
    // 0 radian = 3 o'clock. 
    const x = Math.cos(radian);
    const y = Math.sin(radian);

    return (
        <div
            className="absolute top-1/2 left-1/2 w-20 h-20 md:w-28 md:h-28 -ml-10 -mt-10 md:-ml-14 md:-mt-14 z-20"
            style={{
                // Just translate to the rim position. No rotation on the wrapper so "up" is "up" relative to container.
                // The container rotates, so this item rotates with it.
                transform: `translate(calc(${x} * var(--wheel-radius)), calc(${y} * var(--wheel-radius)))`
            }}
        >
            <motion.div
                className="w-full h-full relative"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: -360 // Counter-rotate relative to container
                }}
                transition={{
                    scale: { type: "spring", delay: 0.1 * member.id },
                    opacity: { duration: 0.5 },
                    rotate: { duration: 60, repeat: Infinity, ease: "linear" }
                }}
            >
                {/* Character Circle */}
                <div
                    className="w-full h-full rounded-full border-4 border-neon-purple/50 cursor-pointer overflow-hidden bg-arcade-bg hover:scale-110 hover:border-neon-pink transition-all duration-300 group shadow-[0_0_15px_rgba(191,0,255,0.5)] relative z-10"
                    onClick={onSelect}
                >
                    {member.image ? (
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 80px, 128px"
                        />
                    ) : (
                        <div className="w-full h-full">
                            <GeometricAvatar name={member.name} className="w-full h-full" />
                        </div>
                    )}
                </div>

                {/* Name Below (Attached to the item, so it stays with it) */}
                <div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 pointer-events-none"
                    style={{ transform: `rotate(0deg)` }} // Reset any transform if inherited? No, need to keep it relative.
                >
                    <span
                        className="text-neon-cyan text-[10px] md:text-sm font-bold uppercase tracking-widest text-glow-cyan bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-neon-cyan/30"
                    >
                        {member.name.split(' ')[0]}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
