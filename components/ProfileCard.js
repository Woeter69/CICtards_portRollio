"use client";
import { useState } from "react";
import Image from "next/image";
import GeometricAvatar from "./ui/GeometricAvatar";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileCard({ member }) {
    const [activeTab, setActiveTab] = useState("about");

    // Map member data to card sections
    const tabs = [
        { id: "about", label: "ABOUT" },
        { id: "experience", label: "SKILLS" }, // Mapping Experience -> Skills for this context
        { id: "contact", label: "CONTACT" }
    ];

    return (
        <div className={`card ${activeTab === 'about' ? 'h-[450px]' : activeTab === 'experience' ? 'h-[550px]' : 'h-[430px]'}`} data-state={`#${activeTab}`}>

            {/* Header */}
            <div className={`card-header ${activeTab !== 'about' ? 'is-active' : ''}`}>
                <div className="card-cover" style={{ backgroundImage: `url(${member.image || '/images/default-cover.jpg'})` }}></div>

                {member.image ? (
                    <img className="card-avatar" src={member.image} alt={member.name} />
                ) : (
                    <div className="card-avatar overflow-hidden bg-arcade-bg">
                        <GeometricAvatar name={member.name} className="w-full h-full" />
                    </div>
                )}

                <h1 className="card-fullname">{member.name}</h1>
                <h2 className="card-jobtitle">{member.role}</h2>
            </div>

            {/* Main Content */}
            <div className="card-main">

                {/* ABOUT SECTION */}
                <div className={`card-section ${activeTab === 'about' ? 'is-active' : ''}`} id="about">
                    <div className="card-content">
                        <div className="card-subtitle">ABOUT</div>
                        <p className="card-desc font-mono text-xs md:text-sm leading-relaxed text-arcade-text/80">
                            {member.bio}
                        </p>
                    </div>
                    <div className="card-social">
                        {/* Social Placeholders - map real links if available */}
                        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.997 3.985h2.191V.169C17.81.117 16.51 0 14.996 0c-3.159 0-5.323 1.987-5.323 5.639V9H6.187v4.266h3.486V24h4.274V13.267h3.345l.531-4.266h-3.877V6.062c.001-1.233.333-2.077 2.051-2.077z" /></svg></a>
                        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 002.882 0z" /></svg></a>
                    </div>
                </div>

                {/* SKILLS SECTION (Mapped from Experience) */}
                <div className={`card-section ${activeTab === 'experience' ? 'is-active' : ''}`} id="experience">
                    <div className="card-content">
                        <div className="card-subtitle">SKILLS & LOADOUT</div>
                        <div className="card-timeline">
                            {member.skills.map((skill, i) => (
                                <div className="card-item" data-year={`LVL.${Math.floor(Math.random() * 10) + 1}`} key={i}>
                                    <div className="card-item-title">Skill: <span>{skill}</span></div>
                                    <div className="card-item-desc">Proficiency verified. Ready for deployment.</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CONTACT SECTION */}
                <div className={`card-section ${activeTab === 'contact' ? 'is-active' : ''}`} id="contact">
                    <div className="card-content">
                        <div className="card-subtitle">CONTACT</div>
                        <div className="card-contact-wrapper">
                            <div className="card-contact">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <path d="M22 6l-10 7L2 6" />
                                </svg>
                                Contact via Portfolio
                            </div>

                            <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="contact-me">
                                VIEW FULL PORTFOLIO
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="card-buttons">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? 'is-active' : ''}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* STYLES ported and adapted for ARCADE RED Theme + GAMIFIED EFFECTS */}
            <style jsx>{`
                /* Container to handle the glowing border */
                .card {
                    max-width: 380px;
                    width: 100%;
                    margin: 4px auto; /* Space for the border */
                    overflow-y: auto;
                    position: relative;
                    z-index: 1;
                    overflow-x: hidden;
                    background-color: var(--color-arcade-surface);
                    display: flex;
                    transition: 0.3s;
                    flex-direction: column;
                    border-radius: 10px;
                    /* We remove the static border and box-shadow here to let the pseudo-element handle the glow */
                    box-shadow: 0 0 20px rgba(0,0,0,0.5); 
                    border: 2px solid var(--color-neon-pink);
                }

                /* REVOLVING NEON BORDER LOGIC */
                .card::before {
                    content: "";
                    position: absolute;
                    inset: -4px; /* Thickness of the border */
                    z-index: -1;
                    background: conic-gradient(
                        transparent 0deg,
                        transparent 90deg,
                        var(--color-neon-red) 180deg,
                        var(--color-neon-purple) 270deg,
                        transparent 360deg
                    );
                    border-radius: 14px; /* Slightly larger than card */
                    animation: rotateBorder 4s linear infinite;
                }

                .card::after {
                    /* Inner background cover to hide the center of the conic gradient */
                    content: "";
                    position: absolute;
                    inset: 0px; 
                    z-index: -1;
                    background: var(--color-arcade-surface);
                    border-radius: 10px;
                }

                @keyframes rotateBorder {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Holographic/Scanline Overlay */
                .card-main::before {
                    content: " ";
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.1),
                        rgba(0, 0, 0, 0.1) 1px,
                        transparent 1px,
                        transparent 2px
                    );
                    pointer-events: none;
                    z-index: 10;
                    opacity: 0.3;
                }

                .card-header {
                    position: relative;
                    display: flex;
                    height: 200px;
                    flex-shrink: 0;
                    width: 100%;
                    transition: 0.3s;
                }

                .card-header.is-active {
                    height: 80px;
                }
                
                .card-header.is-active .card-cover {
                    height: 100px;
                    top: -50px;
                }
                
                .card-header.is-active .card-avatar {
                    transform: none;
                    left: 20px;
                    width: 50px;
                    height: 50px;
                    bottom: 10px;
                }
                
                .card-header.is-active .card-fullname,
                .card-header.is-active .card-jobtitle {
                    left: 86px;
                    transform: none;
                }
                
                .card-header.is-active .card-fullname {
                    bottom: 18px;
                    font-size: 19px;
                }
                
                .card-header.is-active .card-jobtitle {
                    bottom: 16px;
                    letter-spacing: 1px;
                    font-size: 10px;
                }

                .card-cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    height: 160px;
                    top: -20%;
                    left: 0;
                    will-change: top;
                    background-size: cover;
                    background-position: center;
                    filter: blur(30px) brightness(0.7); /* Darker blur */
                    transform: scale(1.2);
                    transition: 0.5s;
                }

                .card-avatar {
                    width: 100px;
                    height: 100px;
                    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    object-position: center;
                    object-fit: cover;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%) translateY(-64px);
                    border: 4px solid var(--color-neon-red);
                    background: #000;
                    transition: 0.3s;
                }

                .card-fullname {
                    position: absolute;
                    bottom: 0;
                    font-size: 22px;
                    font-weight: 700;
                    text-align: center;
                    white-space: nowrap;
                    transform: translateY(-10px) translateX(-50%);
                    left: 50%;
                    color: var(--color-neon-yellow);
                    text-shadow: 0 0 5px var(--color-neon-yellow);
                    transition: 0.3s;
                }

                .card-jobtitle {
                    position: absolute;
                    bottom: 0;
                    font-size: 11px;
                    white-space: nowrap;
                    font-weight: 500;
                    opacity: 0.7;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin: 0;
                    left: 50%;
                    transform: translateX(-50%) translateY(-7px);
                    color: var(--color-neon-red);
                    transition: 0.3s;
                }

                .card-main {
                    position: relative;
                    flex: 1;
                    display: flex;
                    padding-top: 10px;
                    flex-direction: column;
                }

                .card-subtitle {
                    font-weight: 700;
                    font-size: 13px;
                    margin-bottom: 8px;
                    color: var(--color-neon-red);
                    border-bottom: 2px dashed rgba(255, 42, 42, 0.3);
                    padding-bottom: 4px;
                }

                .card-content {
                    padding: 20px;
                }

                .card-desc {
                    line-height: 1.6;
                    color: var(--color-arcade-text);
                    font-size: 14px;
                    margin: 0;
                    font-weight: 400;
                }

                .card-social {
                    display: flex;
                    align-items: center;
                    padding: 0 20px;
                    margin-bottom: 30px;
                }
                
                .card-social svg {
                    fill: var(--color-arcade-text);
                    width: 16px;
                    display: block;
                    transition: 0.3s;
                }
                
                .card-social a {
                    color: var(--color-arcade-text);
                    height: 32px;
                    width: 32px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: 0.3s;
                    background-color: rgba(255, 42, 42, 0.1);
                    margin-right: 10px;
                }
                
                .card-social a:hover svg {
                    fill: var(--color-neon-red);
                }

                .card-buttons {
                    display: flex;
                    background-color: var(--color-arcade-surface);
                    margin-top: auto;
                    position: sticky;
                    bottom: 0;
                    left: 0;
                    border-top: 1px solid rgba(255, 42, 42, 0.2);
                    z-index: 20; /* Ensure active buttons are clickable above effect layers */
                }

                .card-buttons button {
                    flex: 1 1 auto;
                    user-select: none;
                    background: 0;
                    font-size: 13px;
                    border: 0;
                    padding: 15px 5px;
                    cursor: pointer;
                    color: #5c5c6d;
                    transition: 0.3s;
                    font-family: inherit;
                    font-weight: 500;
                    outline: 0;
                    border-bottom: 3px solid transparent;
                    color: var(--color-arcade-text);
                    opacity: 0.6;
                }

                .card-buttons button.is-active,
                .card-buttons button:hover {
                    color: var(--color-neon-red);
                    border-bottom: 3px solid var(--color-neon-red);
                    background: linear-gradient(
                        to bottom,
                        rgba(255, 42, 42, 0) 0%,
                        rgba(255, 42, 42, 0.1) 100%
                    );
                    opacity: 1;
                }

                .card-section {
                    display: none;
                }
                
                .card-section.is-active {
                    display: block;
                    animation: fadeIn 0.6s both;
                }

                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .card-timeline {
                    margin-top: 30px;
                    position: relative;
                }
                
                .card-timeline:after {
                    background: linear-gradient(
                        to top,
                        rgba(255, 42, 42, 0) 0%,
                        rgba(255, 42, 42, 1) 100%
                    );
                    content: "";
                    left: 42px;
                    width: 2px;
                    top: 0;
                    height: 100%;
                    position: absolute;
                }

                .card-item {
                    position: relative;
                    padding-left: 60px;
                    padding-right: 20px;
                    padding-bottom: 30px;
                    z-index: 1;
                }
                
                .card-item:after {
                    content: attr(data-year);
                    position: absolute;
                    top: 0;
                    left: 37px;
                    width: 7px;
                    height: 7px;
                    line-height: 0.6;
                    border: 2px solid var(--color-arcade-bg);
                    font-size: 10px;
                    text-indent: -35px;
                    border-radius: 50%;
                    color: rgba(255,255,255, 0.7);
                    background: var(--color-neon-red);
                    font-weight: bold;
                }

                .card-item-title {
                    font-weight: 500;
                    font-size: 14px;
                    margin-bottom: 5px;
                    color: var(--color-neon-yellow);
                }
                
                .card-item-title span {
                    color: var(--color-arcade-text);
                }

                .card-item-desc {
                    font-size: 13px;
                    color: var(--color-arcade-text);
                    opacity: 0.7;
                    line-height: 1.5;
                }

                .card-contact-wrapper {
                    margin-top: 20px;
                }

                .card-contact {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    color: var(--color-arcade-text);
                    line-height: 1.6;
                    cursor: pointer;
                    margin-bottom: 16px;
                }

                .card-contact svg {
                    flex-shrink: 0;
                    width: 30px;
                    min-height: 34px;
                    margin-right: 12px;
                    transition: 0.3s;
                    padding-right: 12px;
                    border-right: 1px solid rgba(255, 42, 42, 0.3);
                    color: var(--color-neon-red);
                }

                .contact-me {
                    border: 0;
                    outline: none;
                    background: linear-gradient(
                        to right,
                        rgba(255, 42, 42, 0.8) 0%,
                        rgba(142, 21, 21, 0.8) 96%
                    );
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
                    color: #fff;
                    padding: 12px 16px;
                    width: 100%;
                    border-radius: 5px;
                    margin-top: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: 0.3s;
                    text-align: center;
                    display: block;
                    text-decoration: none;
                }
                
                .contact-me:hover {
                    box-shadow: 0 0 15px var(--color-neon-red);
                }
            `}</style>
        </div>
    );
}
