"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import GeometricAvatar from "./ui/GeometricAvatar";

export default function MemberCard({ member, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <div className="h-full bg-arcade-surface border-4 border-neon-red shadow-[8px_8px_0_#050510] hover:shadow-[12px_12px_0_#ff2a2a] hover:-translate-y-2 transition-all duration-200 p-4 flex flex-col relative group box-glow-red">

                {/* Pixel Corner Decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-neon-red" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-neon-red" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-red" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-red" />

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6 border-b-2 border-dashed border-neon-purple/30 pb-4">
                    <div className="w-24 h-24 mb-4 border-4 border-white overflow-hidden bg-arcade-bg relative shadow-lg">
                        {member.image ? (
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        ) : (
                            <GeometricAvatar name={member.name} className="w-full h-full rounded-none" />
                        )}
                    </div>
                    <h3 className="text-sm md:text-base text-neon-yellow mb-1 font-bold tracking-wide text-glow-yellow">{member.name}</h3>
                    <p className="text-[10px] text-neon-red uppercase tracking-widest">{member.role}</p>
                </div>

                {/* Bio as "Stats" */}
                <div className="flex-grow mb-6">
                    <div className="bg-arcade-bg p-3 border border-neon-purple/20 font-mono text-[10px] leading-relaxed text-arcade-text/80">
                        <span className="text-neon-pink text-glow-pink">BIO:</span> {member.bio}
                    </div>
                </div>

                {/* Skills as Inventory */}
                <div className="mb-6">
                    <h4 className="text-[10px] text-neon-cyan mb-2 underline decoration-wavy text-glow-cyan">SKILLS_LOADOUT:</h4>
                    <div className="flex flex-wrap gap-2">
                        {member.skills.map(skill => (
                            <span
                                key={skill}
                                className="text-[8px] bg-arcade-bg text-arcade-text px-2 py-1 border border-neon-purple/40 hover:bg-neon-pink hover:text-white hover:border-pink-300 transition-colors cursor-crosshair uppercase"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block w-full py-2 bg-neon-cyan text-black font-bold text-[10px] text-center border-b-4 border-cyan-800 active:border-0 active:mt-[2px] hover:bg-cyan-400 transition-none uppercase tracking-widest"
                >
                    VIEW STATUS
                </a>

            </div>
        </motion.div>
    );
}
