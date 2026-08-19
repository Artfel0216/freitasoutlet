import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Montserrat } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingElements } from '@/components/layout/FloatingElements'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/lib/wishlist-context'
import { RecentlyViewedProvider } from '@/lib/recently-viewed'
import { CompareProvider } from '@/context/CompareContext'
import { LoyaltyProvider } from '@/context/LoyaltyContext'
import { Suspense } from 'react'
import { Analytics } from '@/components/Analytics'
import { ToastProvider } from '@/components/ToastProvider'
import { ThreeConsoleShim } from '@/components/ThreeConsoleShim'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Freitas Outlet | O Luxo Mais Acessível',
  description: 'Sua loja multimarcas premium. Nike, Adidas, Gucci, Alexander McQueen, Hugo Boss e muito mais. O luxo mais acessível em um só lugar.',
  keywords: ['freitas outlet', 'tênis importados', 'tênis originais', 'chuteiras', 'moda premium', 'loja de tênis'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Freitas Outlet',
    title: 'Freitas Outlet | O Luxo Mais Acessível',
    description: 'Sua loja multimarcas premium. Nike, Adidas, Gucci, Alexander McQueen, Hugo Boss e muito mais.',
    url: '/',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Freitas Outlet' }],
  },
  twitter: {
    card: 'summary',
    title: 'Freitas Outlet | O Luxo Mais Acessível',
    description: 'Sua loja multimarcas premium. Nike, Adidas, Gucci, Alexander McQueen, Hugo Boss e muito mais.',
    images: ['/icon-512.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`light ${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <Script id="sw-register" strategy="afterInteractive">
          {`if('serviceWorker'in navigator){navigator.serviceWorker.register('/sw.js')}`}
        </Script>
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <CompareProvider>
                <LoyaltyProvider>
                  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:text-sm">
                    Pular para o conteúdo
                  </a>
                  <ToastProvider />
                  <ThreeConsoleShim />
                  <Header />
                  <main id="main-content">{children}</main>
                  <Footer />
                  <FloatingElements />
                  <Suspense fallback={null}>
                    <Analytics />
                  </Suspense>
                </LoyaltyProvider>
              </CompareProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
