import "@/styles/globals.css";
import PlausibleProvider from "next-plausible";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { WebVitals } from "./components/web-vitals";

export const metadata: Metadata = {
  title:
    "InvestingFIRE Calculator | Plan Your Financial Independence & Early Retirement",
  description:
    "Achieve Financial Independence, Retire Early (FIRE) with the InvestingFIRE calculator. Get personalized projections and investing advice to plan your journey.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
      <PlausibleProvider
        domain="investingfire.com"
        customDomain="https://analytics.schulze.network"
        selfHosted={true}
        enabled={true}
        trackOutboundLinks={true}
      >
        <WebVitals />
        <body>{children}</body>
      </PlausibleProvider>
    </html>
  );
}
