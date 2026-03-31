import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lub Island',
  description: 'A lighthearted dating sim on a tropical island',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
