import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubmitModal } from "@/components/SubmitModal";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaporSek — Community Issue Reporter",
  description: "A civic-tech web app to report, map, and upvote local infrastructure problems in your neighborhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <AppProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-outline-variant" />}>
            <Header />
            <SubmitModal />
          </Suspense>
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}



