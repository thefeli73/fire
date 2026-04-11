import '@/styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { type Metadata, type Viewport } from 'next';
import { Geist } from 'next/font/google';
import { WebVitals } from './components/web-vitals';
import { Navbar } from './components/Navbar';
import Footer from './components/footer';

export const viewport: Viewport = {
  themeColor: [{ color: 'oklch(0.97 0.0228 95.96)' }],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://investingfire.com'),
  title: 'InvestingFIRE | Finance and Retirement Calculator',
  description:
    'Achieve Financial Independence & Early Retirement! Plan your FIRE journey with the InvestingFIRE calculator and get personalized projections in buttersmooth graphs.',
  appleWebApp: {
    title: 'FIRE',
  },
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-screen flex-col">
        <PlausibleProvider
          src="https://plsbl.schulze.network/js/pa-qT99amCl4t9lgrIM3Xs00.js"
          enabled={true}
        >
          <WebVitals />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PlausibleProvider>
      </body>
    </html>
  );
}
