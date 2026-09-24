import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rebuild-brand.vercel.app'),
  title: 'IndianOil — Energy for a limitless tomorrow',
  description: 'An independent IndianOil design concept. Explore energy, innovation, sustainability, and the people powering progress.',
  verification: { google: 'g1m4oXZF3NRQ5CFTYOuncv2mpGOkaQBkI-yvYzEH4WM' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
