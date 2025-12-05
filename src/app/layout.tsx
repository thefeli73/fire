import "@/styles/globals.css";
import PlausibleProvider from "next-plausible";
import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";
import { WebVitals } from "./components/web-vitals";
import { Navbar } from "./components/Navbar";
import Footer from "./components/footer";

export const viewport: Viewport = {
  themeColor: [{ color: "oklch(0.97 0.0228 95.96)" }],
};

export const metadata: Metadata = {
  title: "InvestingFIRE | Finance and Retirement Calculator",
  description:
    "Achieve Financial Independence & Early Retirement! Plan your FIRE journey with the InvestingFIRE calculator and get personalized projections in buttersmooth graphs.",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        <meta name="apple-mobile-web-app-title" content="FIRE" />
        <PlausibleProvider
          domain="investingfire.com"
          customDomain="https://analytics.schulze.network"
          selfHosted={true}
          enabled={true}
          trackOutboundLinks={true}
        />
      </head>
      <WebVitals />
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
