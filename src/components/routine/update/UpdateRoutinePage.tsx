'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRoutineStore } from '@/store/useRoutineStore'
import { RoutineResponseDto } from '@/types/types.routine'
import RoutineFormPage from '../routine-form/RoutineFormPage'
import { useBreadcrumbStore } from '@/store/useBreadcrumbStore'
import { encodeId } from '@/utils/helpers/IdConversion'

export default function UpdateRoutinePage({ routineId }: { routineId: string }) {

    const router = useRouter();
    const { fetchById } = useRoutineStore()

    const [editing, setEditing] = useState<RoutineResponseDto | null>(null)
    const [loading, setLoading] = useState(true)

    const { setBreadcrumbs } = useBreadcrumbStore();

    useEffect(() => {
        if (!routineId) {
            router.push('/routines')
            return
        }

        let mounted = true
        setLoading(true)

        fetchById(routineId)
            .then((r) => {
                if (!mounted) return
                if (r) setEditing(r)
                else router.push('/routines') // not found -> back to list
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })

        return () => {
            mounted = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routineId])

    useEffect(() => {
        setBreadcrumbs([
            { label: "Home", href: "/" },
            { label: "Routines", href: "/routines" },
            { label: `${editing?.title}`, href: `/routines/${encodeId(encodeURIComponent(editing?.id ?? ""))}/update` },
        ]);
    }, [editing?.id, editing?.title, setBreadcrumbs]);

    const handleCancel = () => {
        router.push('/routines')
    }

    const handleSuccess = () => {
        router.push('/routines')
    }

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    return (
        <RoutineFormPage
            editing={editing}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
        />
    )
}
