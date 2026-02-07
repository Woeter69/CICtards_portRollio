"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import PlayerProfileCard from "@/components/ui/8bit/blocks/player-profile-card";

export default function MemberCard({ member, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <div className="h-full flex flex-col bg-black border-2 border-white hover:scale-105 hover:-translate-y-2 transition-all duration-200">
                {/* 8bitcn Card */}
                <PlayerProfileCard
                    className="border-0"
                    playerName={member.name}
                    avatarSrc={member.image}
                    avatarFallback={member.name.charAt(0)}
                    level={member.id}
                    playerClass={member.role}
                    showLevel={true}
                    showHealth={false}
                    showMana={false}
                    showExperience={false}
                    customStats={[]}
                />

                {/* Bio Section */}
                <div className="px-4 pb-3 border-t-2 border-gray-700">
                    <div className="bg-black border-2 border-green-500 p-2 mt-3 text-[9px] leading-relaxed text-green-400"
                        style={{
                            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.8)',
                            fontFamily: '"VT323", monospace'
                        }}>
                        <div className="text-yellow-400 mb-1">{'>'} BIO:</div>
                        <div className="text-green-300">{member.bio}</div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 mb-2 border-b border-yellow-600 pb-1">
                        <div className="w-2 h-2 bg-yellow-400 animate-pulse" />
                        <h4 className="text-[9px] text-yellow-400 font-bold tracking-widest" style={{ fontFamily: '"VT323", monospace' }}>
                            ABILITIES
                        </h4>
                        <div className="w-2 h-2 bg-yellow-400 animate-pulse" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 6).map(skill => (
                            <span
                                key={skill}
                                className="text-[7px] bg-red-900 text-yellow-300 px-1.5 py-0.5 border border-yellow-600 hover:bg-yellow-400 hover:text-black transition-all font-bold"
                                style={{
                                    fontFamily: '"VT323", monospace',
                                    boxShadow: '1px 1px 0 #000'
                                }}
                            >
                                {skill.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 8-bit Redirect Button */}
                <div className="px-4 pb-4 mt-auto">
                    <Link href={`/team/${member.slug}`}>
                        <div className="w-full py-2 bg-gradient-to-b from-yellow-400 to-yellow-600 text-black text-[10px] text-center border-2 border-yellow-300 hover:from-red-500 hover:to-red-700 hover:text-yellow-400 transition-all font-black tracking-widest relative cursor-pointer"
                            style={{
                                fontFamily: '"VT323", monospace',
                                boxShadow: '0 4px 0 #000, inset 0 -2px 0 rgba(0,0,0,0.3)'
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                            ▶ VIEW PROFILE ◀
                        </div>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
