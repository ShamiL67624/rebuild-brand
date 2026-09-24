import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://rebuild-brand.vercel.app'),
  title: { default: 'IndianOil — Energy for a limitless tomorrow', template: '%s | IndianOil' },
  description: 'An independent IndianOil design concept. Explore energy, innovation, sustainability, and the people powering progress.',
  applicationName: 'IndianOil',
  keywords: ['IndianOil', 'energy', 'fuel', 'petroleum', 'refining', 'sustainability', 'renewable energy', 'LPG', 'innovation', 'India'],
  authors: [{ name: 'ShamiL67624' }],
  creator: 'ShamiL67624',
  category: 'Energy',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'IndianOil — Energy for a limitless tomorrow',
    description: 'An independent IndianOil design concept. Explore energy, innovation, sustainability, and the people powering progress.',
    url: 'https://rebuild-brand.vercel.app',
    siteName: 'IndianOil',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/energy-plant.jpg', width: 1200, height: 630, alt: 'IndianOil' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IndianOil — Energy for a limitless tomorrow',
    description: 'An independent IndianOil design concept. Explore energy, innovation, sustainability, and the people powering progress.',
    images: ['/images/energy-plant.jpg'],
  },
  robots: { index: true, follow: true },
  verification: { google: 'g1m4oXZF3NRQ5CFTYOuncv2mpGOkaQBkI-yvYzEH4WM' },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IndianOil',
  description: 'An independent IndianOil design concept. Explore energy, innovation, sustainability, and the people powering progress.',
  url: 'https://rebuild-brand.vercel.app',
  logo: 'https://rebuild-brand.vercel.app/images/energy-plant.jpg',
  contactPoint: { '@type': 'ContactPoint', telephone: '+91-1800-233-3555', contactType: 'customer service' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
