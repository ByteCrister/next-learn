'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Define auth routes that should not show header/footer
  const authRoutes = [
    '/next-learn-user-auth',
    '/next-learn-user-reset-pass',
    // Add other auth routes here as needed
  ]
  
  // Check if current route is an auth page
  const isAuthPage = authRoutes.some(route => pathname?.startsWith(route)) || pathname === '/'
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-1 ${!isAuthPage ? 'pt-0' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
