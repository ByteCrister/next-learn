// store/useBreadcrumbStore.ts
import { create } from 'zustand';

export interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbState {
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (crumbs: BreadcrumbItem[]) => void;
    addBreadcrumb: (crumb: BreadcrumbItem) => void;
    popBreadcrumb: () => void;
    removeBreadcrumbByHref: (href: string) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
    breadcrumbs: [{ label: 'Home', href: '/' }],

    setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

    addBreadcrumb: (crumb) =>
        set((state) => ({
            breadcrumbs: [...state.breadcrumbs, crumb],
        })),

    popBreadcrumb: () =>
        set((state) => ({
            breadcrumbs: state.breadcrumbs.length > 1
                ? state.breadcrumbs.slice(0, -1)
                : state.breadcrumbs, // keep at least "Home"
        })),

    removeBreadcrumbByHref: (href) =>
        set((state) => ({
            breadcrumbs:
                href === '/'
                    ? state.breadcrumbs // do not remove Home
                    : state.breadcrumbs.filter((crumb) => crumb.href !== href),
        })),
}));
