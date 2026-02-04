import Hero from "@/components/Hero";
import TeamGrid from "@/components/TeamGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      <Hero />
      <TeamGrid />
      <footer className="py-10 text-center text-gray-600 text-sm border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="mb-2">© {new Date().getFullYear()} Team Portfolio. All rights reserved.</p>
          <p className="text-xs">Built with Next.js, Tailwind CSS & Framer Motion</p>
        </div>
      </footer>
    </main>
  );
}
