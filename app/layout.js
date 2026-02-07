import "./globals.css";

export const metadata = {
  title: "CICtards | Insert Coin",
  description: "Level up with the CICtards 8-bit Portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className={`antialiased bg-black text-white selection:bg-green-500 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
