import Hero from "@/components/Hero";
import TeamGrid from "@/components/TeamGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-arcade-bg font-sans selection:bg-neon-pink selection:text-arcade-bg overflow-x-hidden crt relative">
      <Hero />
      <TeamGrid />
      <footer className="py-10 text-center text-arcade-text/60 text-sm border-t border-neon-purple/20 bg-arcade-bg/80 backdrop-blur-sm relative z-10 transition-colors duration-300 hover:border-neon-pink/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="mb-2 hover:text-neon-cyan transition-colors duration-300">© {new Date().getFullYear()} Team Portfolio. All rights reserved.</p>
          <p className="text-xs text-arcade-text/40 animate-pulse">big things coming soon..</p>
        </div>
      </footer>
    </main>
  );
}
