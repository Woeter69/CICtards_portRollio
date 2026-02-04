import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Team Portfolio | Robotics, Web, Design",
  description: "A collaborative portfolio showcasing our team's projects in Robotics, Web Development, and Design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased bg-slate-950 text-white selection:bg-purple-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
