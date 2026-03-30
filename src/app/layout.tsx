import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Floyo Model Compare — Find the right AI video model",
  description:
    "Compare 24+ AI video generation models side by side. Specs, scores, pricing, open vs closed source. Find the right model and run it on Floyo.",
  metadataBase: new URL("https://compare.floyo.ai"),
  openGraph: {
    title: "Floyo Model Compare — Find the right AI video model",
    description:
      "Compare 24+ AI video generation models side by side. Specs, scores, pricing, open vs closed source. Find the right model and run it on Floyo.",
    url: "https://compare.floyo.ai",
    siteName: "Floyo Model Compare",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Floyo Model Compare — Find the right AI video model",
    description:
      "Compare 24+ AI video generation models side by side. Specs, scores, pricing, open vs closed source.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${spaceMono.variable} font-sans antialiased bg-bg text-text-main`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
