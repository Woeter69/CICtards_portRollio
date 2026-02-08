"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MemberCard from "./MemberCard";
import { members } from "@/data/members";

import { AnimatePresence } from "framer-motion";
import CharacterWheel from "./CharacterWheel";
import CharacterPreview from "./CharacterPreview";

export default function TeamGrid() {
    const [selectedMember, setSelectedMember] = useState(null);

    // No need to shuffle for the wheel, order can be fixed or random. 
    // Let's keep it fixed for the wheel so positions are consistent, 
    // OR shuffle if we want randomness. Let's use the original 'members' for stability 
    // but maybe we can just use the shuffled version if we want.
    // Actually, the user asked for "randomizing players" text in the previous version, 
    // but a wheel usually implies a set order. Let's use the static list for the wheel 
    // to ensure 5 items are spaced correctly.

    // We'll keep the "Randomizing" effect just for show or remove it since we are changing the UI paradigm.
    // The previous code had a shuffle effect. Let's simplify efficiently.

    const handleSelect = (member) => {
        setSelectedMember(member);
    };

    const handleBack = () => {
        setSelectedMember(null);
    };

    const handleConfirm = () => {
        console.log("Confirmed selection:", selectedMember.name);
        // Future: Navigate or show something else
    };

    return (
        <section id="team" className="py-24 px-6 relative bg-arcade-bg border-t-8 border-dashed border-neon-purple/30 min-h-screen overflow-hidden flex flex-col items-center justify-center">

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,rgba(60,60,100,0.2),transparent_70%)]" />

            <div className="max-w-7xl w-full mx-auto relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-arcade-text mb-2 uppercase tracking-widest drop-shadow-[4px_4px_0_rgba(255,0,255,1)] text-glow-pink">
                        {selectedMember ? "PLAYER SELECTED" : "CHOOSE YOUR CHARACTER"}
                    </h2>
                    {!selectedMember && (
                        <p className="text-neon-red font-mono text-xs md:text-sm animate-pulse text-glow-red">
                            &gt; INSERT COIN TO JOIN...
                        </p>
                    )}
                </div>

                <div
                    className="flex justify-center items-center min-h-[600px]"
                    style={{
                        "--wheel-radius": "220px", // Desktop default
                    }}
                >
                    <style jsx>{`
                        @media (max-width: 768px) {
                            div[style*="--wheel-radius"] {
                                --wheel-radius: 130px !important;
                            }
                        }
                    `}</style>

                    <AnimatePresence mode="wait">
                        {!selectedMember ? (
                            <motion.div
                                key="wheel"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                                transition={{ duration: 0.5 }}
                                className="w-full flex justify-center"
                            >
                                <CharacterWheel members={members} onSelect={handleSelect} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                className="w-full flex justify-center"
                            >
                                <CharacterPreview
                                    member={selectedMember}
                                    onBack={handleBack}
                                    onConfirm={handleConfirm}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
