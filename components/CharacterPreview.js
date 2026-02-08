"use client";
import { motion } from "framer-motion";
import ProfileCard from "./ProfileCard";

export default function CharacterPreview({ member, onBack, onConfirm }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex flex-col items-center justify-center w-full max-w-lg mx-auto relative z-20"
        >
            <div className="w-full mb-8">
                <ProfileCard member={member} />
            </div>

            <div className="flex gap-4 w-full px-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 px-4 bg-transparent border-2 border-neon-orange text-neon-orange font-mono font-bold uppercase tracking-wider hover:bg-neon-orange hover:text-black transition-all shadow-[0_0_10px_rgba(255,102,0,0.3)] hover:shadow-[0_0_20px_rgba(255,102,0,0.6)]"
                >
                    Select Again
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 px-4 bg-neon-red text-white font-mono font-bold uppercase tracking-wider border-2 border-neon-red hover:bg-white hover:border-white hover:text-black transition-all shadow-[0_0_10px_rgba(255,42,42,0.5)] hover:shadow-[0_0_20px_rgba(255,42,42,0.8)] animate-pulse"
                >
                    Confirm
                </button>
            </div>
        </motion.div>
    );
}
