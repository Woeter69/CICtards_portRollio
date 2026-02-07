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
            <PlayerProfileCard
                className="h-full hover:scale-105 hover:-translate-y-2 transition-all duration-200"
                playerName={member.name}
                avatarSrc={member.image}
                avatarFallback={member.name.charAt(0)}
                level={member.id}
                playerClass={member.role}
                showLevel={true}
                showHealth={false}
                showMana={false}
                showExperience={false}
                customStats={[
                    { label: "Bio", value: member.bio, max: null },
                    ...member.skills.slice(0, 6).map(skill => ({
                        label: skill,
                        value: 100,
                        max: 100,
                        color: "bg-yellow-500"
                    }))
                ]}
            />
        </motion.div>
    );
}
