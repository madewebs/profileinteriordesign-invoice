import type { Metadata, Viewport } from 'next'
import './globals.css'
import { InstallPrompt } from '@/components/install-prompt'

export const metadata: Metadata = {
  title: 'Invoice Generator',
  description: 'Generate and manage invoices effortlessly',
  generator: 'Abhin.c',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Invoice Generator',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <InstallPrompt />
        {children}
      </body>
    </html>
  )
}
