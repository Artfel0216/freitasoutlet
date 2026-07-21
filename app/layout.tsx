import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/lib/wishlist-context'
import { RecentlyViewedProvider } from '@/lib/recently-viewed'
import { CompareProvider } from '@/context/CompareContext'
import { LoyaltyProvider } from '@/context/LoyaltyContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { CompareBar } from '@/components/product/CompareBar'
import { WhatsAppChat } from '@/components/ui/WhatsAppChat'
import { InstallPWA } from '@/components/ui/InstallPWA'
import { Suspense } from 'react'
import { Analytics } from '@/components/Analytics'
import { ToastProvider } from '@/components/ToastProvider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Freitas Outlet | Streetwear, Luxo & Performance',
  description: 'Sua loja multimarcas premium. Nike, Adidas, Gucci, Alexander McQueen, Hugo Boss e muito mais. Streetwear, luxo e performance esportiva.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <Script id="sw-register" strategy="afterInteractive">
          {`if('serviceWorker'in navigator){navigator.serviceWorker.register('/sw.js')}`}
        </Script>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('freitasoutlet_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`}
        </Script>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased dark:bg-black dark:text-white">
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <CompareProvider>
                  <LoyaltyProvider>
                    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:text-sm">
                      Pular para o conteúdo
                    </a>
                    <ToastProvider />
                    <Header />
                    <main id="main-content">{children}</main>
                    <Footer />
                    <CompareBar />
                    <WhatsAppChat />
                    <InstallPWA />
                    <Suspense fallback={null}>
                      <Analytics />
                    </Suspense>
                  </LoyaltyProvider>
                </CompareProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
