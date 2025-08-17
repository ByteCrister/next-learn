'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useBreadcrumbStore, BreadcrumbItem } from '@/store/useBreadcrumbStore';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbStore((state) => state.breadcrumbs);
  const pathname = usePathname();

  const isPublicPage = pathname === "/" || pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/reset");

  if (isPublicPage) return null;
  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-none px-4 py-2">
      <ol className="flex flex-wrap items-center text-sm">
        {breadcrumbs.map((crumb: BreadcrumbItem, idx: number) => {
          const isLast = idx === breadcrumbs.length - 1;

          return (
            <li key={crumb.href} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={crumb.href}
                    className={cn(
                      'text-primary hover:underline transition-colors',
                      'px-1 py-0.5 rounded',
                    )}
                  >
                    {crumb.label}
                  </Link>

                  {/* ChevronRight icon */}
                  <ChevronRight
                    size={16}
                    className="mx-2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <span
                  aria-current="page"
                  className="text-foreground font-semibold px-1 py-0.5"
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
