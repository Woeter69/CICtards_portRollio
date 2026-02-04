"use client";
import { motion } from "framer-motion";
import { SpotlightCard } from "./ui/SpotlightCard";

export default function MemberCard({ member, index }) {
    // Get initials for avatar
    const initials = member.name.split(' ').slice(0, 2).map(n => n[0]).join('');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <SpotlightCard className="h-full flex flex-col p-8">
                {/* Header: Avatar & Name */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-white shrink-0">
                        {initials}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-100">{member.name}</h3>
                        <p className="text-sm font-medium text-purple-400">{member.role}</p>
                    </div>
                </div>

                {/* Bio */}
                <div className="flex-grow">
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {member.skills.map(skill => (
                            <span
                                key={skill}
                                className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer: Portfolio Link */}
                <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto group flex items-center justify-between w-full py-3 px-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all duration-300 border border-slate-700/50 hover:border-purple-500/30"
                >
                    <span className="text-sm font-medium">View Portfolio</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </SpotlightCard>
        </motion.div>
    );
}
