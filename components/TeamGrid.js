"use client";
import MemberCard from "./MemberCard";
import { members } from "@/data/members";

export default function TeamGrid() {
    return (
        <section id="team" className="py-24 px-6 relative bg-gray-900 border-t-8 border-dashed border-gray-700 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-widest drop-shadow-[4px_4px_0_rgba(255,0,255,1)]">
                        CHOOSE YOUR <span className="text-yellow-400">CHARACTER</span>
                    </h2>
                    <p className="text-green-400 font-mono text-xs md:text-sm animate-pulse">
                        &gt; SYSTEM READY...
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {members.map((member, index) => (
                        <div key={member.name} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)]">
                            <MemberCard member={member} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
