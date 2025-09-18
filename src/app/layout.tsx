import { type Metadata } from 'next';
import {
  ClerkProvider,
} from '@clerk/nextjs';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers'
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'ChatyPDF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
            {children}
          </body>
          <Toaster />
        </html>
      </Providers>
    </ClerkProvider>
  )
}