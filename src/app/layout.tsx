import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Build Your First AI Project in 60 Minutes | NxtWave Workshop",
  description: "Free 60-minute masterclass for final-year engineering students to build and deploy a working AI Copilot on GitHub. Refer friends to unlock exclusive mentorship & rewards.",
  keywords: "NxtWave, AI Workshop, Final Year Engineering, LLM, GenAI, Placements 2025, Student Referral",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#090D16] text-slate-100 antialiased flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
