import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { seedDatabase } from "@/lib/db/seed";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopCRM - Your Online Shopping Destination",
  description: "Discover amazing products at great prices. Shop electronics, clothing, home goods, and more.",
};

// Initialize database seeding on server-side
if (typeof window === 'undefined') {
  seedDatabase().catch(err => {
    console.error('[App] Database seeding failed:', err);
  });
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
