import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata = {
  title: "CICtards | Insert Coin",
  description: "Level up with the CICtards 8-bit Portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${pressStart2P.variable} font-mono antialiased bg-black text-white selection:bg-green-500 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
