"use client";
import MemberCard from "./MemberCard";
import { members } from "@/data/members";

export default function TeamGrid() {
    return (
        <section id="team" className="py-24 px-6 relative">
            {/* Decorative blob */}
            <div className="absolute top-[20%] right-0 w-[30%] h-[30%] bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Team</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        The creative minds behind our innovative solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {members.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
