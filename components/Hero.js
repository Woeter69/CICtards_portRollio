"use client";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-arcade-bg crt border-b-4 border-neon-red box-glow-red">

            {/* Retro Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `
                linear-gradient(to right, rgba(255, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 1px, transparent 1px)
            `,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, steps: 5 }}
                className="relative z-10 px-4"
            >
                <span className="block text-neon-red text-xs md:text-sm mb-6 animate-pulse text-glow-red tracking-widest">
                    INSERT COIN TO START
                </span>

                <h1 className="text-4xl md:text-6xl lb:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neon-yellow to-yellow-600 drop-shadow-[4px_4px_0_rgba(165,42,42,1)] mb-8 leading-tight">
                    CICtards<br />
                    <span className="text-2xl md:text-4xl text-neon-pink drop-shadow-none text-glow-pink">ARCADE</span>
                </h1>

                <p className="text-xs md:text-sm text-arcade-text/70 mb-12 max-w-xl mx-auto leading-loose font-mono">
                    PLAYER 1 READY. <br />
                    SELECT YOUR CHARACTER TO VIEW STATS & SKILLS.
                </p>

                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255, 0, 255, 0.8)' }}
                    whileTap={{ scale: 0.9 }}
                    className="px-8 py-4 bg-neon-pink text-white text-sm md:text-base font-bold tracking-wider border-b-4 border-r-4 border-purple-900 active:border-0 active:translate-y-1 transition-all uppercase"
                    onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}
                >
                    KABOOM!!!
                </motion.button>
            </motion.div>
        </section>
    );
}
