// components/Providers.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TooltipProvider } from '../ui/tooltip'
import Breadcrumbs from '../global/Breadcrumbs'
import DashboardLayout from '../dashboard/DashboardLayout'
import { useDashboardStore } from '@/store/useDashboardStore'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const { user, fetchUser } = useDashboardStore();
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) await fetchUser();
    }
    fetchUserData();
  }, [fetchUser, user]);
  return (
    <>
      <TooltipProvider>
        <DashboardLayout>
          <Breadcrumbs />
          {children}
        </DashboardLayout>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
        />
      </TooltipProvider>
    </>
  )
}
