import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura Estates | Exclusive Luxury Properties & Signature Residences',
  description:
    'Discover extraordinary architectural estates, penthouses, and luxury villas curated by Aura Estates. Real-time listings powered by Neon PostgreSQL.',
  openGraph: {
    title: 'Aura Estates | Exclusive Luxury Properties & Signature Residences',
    description:
      'Discover extraordinary architectural estates, penthouses, and luxury villas curated by Aura Estates.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Estates | Exclusive Luxury Properties',
    description:
      'Discover extraordinary architectural estates, penthouses, and luxury villas curated by Aura Estates.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased selection:bg-amber-100 selection:text-amber-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

