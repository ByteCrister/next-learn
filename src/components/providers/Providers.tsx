'use client'

import { ReactNode, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TooltipProvider } from '../ui/tooltip'
import Breadcrumbs from '../global/Breadcrumbs'
import DashboardLayout from '../dashboard/DashboardLayout'
import { useDashboardStore } from '@/store/useDashboardStore'
import { usePathname } from 'next/navigation'
import Header from '../layout/Header'
import Footer from '../layout/Footer'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const { user, fetchUser } = useDashboardStore()
  const pathname = usePathname()

  const PUBLIC_PAGES = new Set(["/", "/features", "/how-to-use", "/about"])
  const isPublic = PUBLIC_PAGES.has(pathname)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) await fetchUser()
    }
    fetchUserData()
  }, [user, fetchUser])

  const PageLayout = ({ children }: { children: ReactNode }) => (
    <>
      {isPublic && <Header />}
      {children}
      {isPublic && <Footer />}
    </>
  )

  return (
    <TooltipProvider>
      <DashboardLayout>
        <Breadcrumbs />
        <PageLayout>{children}</PageLayout>
      </DashboardLayout>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </TooltipProvider>
  )
}
