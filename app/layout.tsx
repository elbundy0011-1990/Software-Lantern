import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Software Lantern | Tell us what software you need",
  description:
    "Tell us what software you need. We'll connect you with 3 providers that believe they have the right solution. Free for buyers, no obligation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#0d1117] font-sans antialiased selection:bg-[#4f46e5]/[0.18]">
        {children}
      </body>
    </html>
  );
}
