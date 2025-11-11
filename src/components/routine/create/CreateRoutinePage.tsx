'use client'

import { useRouter } from 'next/navigation'
import RoutineFormPage from '../routine-form/RoutineFormPage'
import { useEffect } from 'react';
import { useBreadcrumbStore } from '@/store/useBreadcrumbStore';

export default function CreateRoutinePage() {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Routines", href: "/routines" },
      { label: "Create New Routine", href: "/routines/create" },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // onSuccess we navigate to list (or change to created routine route if you return id)
  const handleSuccess = async () => {
    router.push('/routines')
  }

  const handleCancel = () => {
    router.push('/routines')
  }

  return (
    <RoutineFormPage
      editing={null}
      onCancel={handleCancel}
      onSuccess={handleSuccess}
    />
  )
}
