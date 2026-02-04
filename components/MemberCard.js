"use client";
import { motion } from "framer-motion";
import GeometricAvatar from "./ui/GeometricAvatar";

export default function MemberCard({ member, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <div className="h-full bg-slate-900 border-4 border-green-500 shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#ff00ff] hover:-translate-y-2 transition-all duration-200 p-4 flex flex-col relative group">

                {/* Pixel Corner Decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6 border-b-2 border-dashed border-gray-700 pb-4">
                    <div className="w-24 h-24 mb-4 border-4 border-white overflow-hidden bg-black">
                        <GeometricAvatar name={member.name} className="w-full h-full rounded-none" />
                    </div>
                    <h3 className="text-sm md:text-base text-yellow-400 mb-1">{member.name}</h3>
                    <p className="text-[10px] text-green-400 uppercase">{member.role}</p>
                </div>

                {/* Bio as "Stats" */}
                <div className="flex-grow mb-6">
                    <div className="bg-black p-3 border border-gray-800 font-mono text-[10px] leading-relaxed text-gray-300">
                        <span className="text-pink-500">BIO:</span> {member.bio}
                    </div>
                </div>

                {/* Skills as Inventory */}
                <div className="mb-6">
                    <h4 className="text-[10px] text-blue-400 mb-2 underline decoration-wavy">SKILLS_LOADOUT:</h4>
                    <div className="flex flex-wrap gap-2">
                        {member.skills.map(skill => (
                            <span
                                key={skill}
                                className="text-[8px] bg-gray-800 text-white px-2 py-1 border border-gray-600 hover:bg-pink-600 hover:border-pink-300 transition-colors cursor-crosshair"
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
                    className="mt-auto block w-full py-2 bg-blue-600 text-white text-[10px] text-center border-b-4 border-blue-900 active:border-0 active:mt-[2px] hover:bg-blue-500 transition-none"
                >
                    VIEW STATUS
                </a>

            </div>
        </motion.div>
    );
}
