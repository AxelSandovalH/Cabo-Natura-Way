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

const SITE_URL = "https://cabonaturalway.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  "Cabo Natural Way — Fresh Organic Produce from Baja",
    template: "%s — Cabo Natural Way",
  },
  description:
    "Organic produce, artisan goods, and fresh spring water sourced directly from Los Cabos farmers. Same-day delivery across Cabo San Lucas and San José del Cabo.",
  keywords: [
    "organic produce Los Cabos", "farm to table Cabo San Lucas",
    "fresh vegetables Baja California", "organic delivery Cabo",
    "San José del Cabo organic", "Baja farm fresh",
  ],
  authors: [{ name: "Cabo Natural Way", url: SITE_URL }],
  creator: "Cabo Natural Way",
  openGraph: {
    title:       "Cabo Natural Way — Fresh Organic Produce from Baja",
    description: "Same-day delivery of organic produce from Los Cabos farms to your door.",
    url:         SITE_URL,
    siteName:    "Cabo Natural Way",
    locale:      "en_US",
    type:        "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Cabo Natural Way" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Cabo Natural Way — Fresh Organic Produce from Baja",
    description: "Same-day delivery of organic produce from Los Cabos farms.",
    images:      ["/opengraph-image"],
  },
  robots: {
    index:   true,
    follow:  true,
  },
  alternates: {
    canonical: SITE_URL,
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
