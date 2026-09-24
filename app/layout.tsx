import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IndianOil — Energy for a limitless tomorrow',
  description: 'An independent IndianOil design concept. Explore energy, innovation, sustainability, and the people powering progress.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
