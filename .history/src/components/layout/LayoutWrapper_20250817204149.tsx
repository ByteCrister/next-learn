'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  
  // Check if current route is an auth page
  const isAuthPage = pathname?.includes('/next-learn-user') || pathname === '/'
  
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        {!isAuthPage && <Header />}
        <main className={`flex-1 ${!isAuthPage ? 'pt-0' : ''}`}>
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </SessionProvider>
  )
}
