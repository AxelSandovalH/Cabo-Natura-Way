import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cabo Natural Way — Baja Farm to Table",
  description:
    "Organic produce, artisan goods, and fresh spring water sourced directly from the farmers of Los Cabos and the Baja peninsula.",
  keywords: ["organic", "cabo", "baja", "natural", "farm to table", "fresh produce"],
  openGraph: {
    title: "Cabo Natural Way",
    description: "The purest taste of Baja, delivered.",
    siteName: "Cabo Natural Way",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF7]">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
