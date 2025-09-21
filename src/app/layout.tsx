import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/sonner';
import Provider from './provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stake - ETH Staking Platform',
  description:
    'Secure and efficient ETH staking platform with modern UI and seamless wallet integration',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-300`}
      >
        <Provider>
          <Layout>{children}</Layout>
          <Toaster position='top-center' />
        </Provider>
      </body>
    </html>
  );
}
