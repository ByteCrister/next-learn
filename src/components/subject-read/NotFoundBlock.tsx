// /components/NotFoundBlock.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi"
type Props = {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    onBack?: () => void;
};

export default function NotFoundBlock({
    title,
    subtitle,
    actionLabel = "Retry",
    onAction,
    onBack,
}: Props) {
    return (
        <div className="mx-4 my-8">
            <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-md">
                <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex-none">
                        <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-indigo-50 text-indigo-600">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 15.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">{title}</h2>
                        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}

                        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                            {onAction ? (
                                <Button onClick={onAction} className="inline-flex items-center gap-2 px-4 py-2">
                                    <FiRefreshCw className="w-4 h-4" />
                                    {actionLabel}
                                </Button>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 text-slate-700 text-sm">
                                    <FiRefreshCw className="w-4 h-4" />
                                    {actionLabel}
                                </div>
                            )}

                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-transparent text-slate-600 hover:bg-slate-50"
                                >
                                    <FiArrowLeft className="w-4 h-4" />
                                    Go back
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:block sm:flex-none">
                        <div className="w-36 h-28 bg-gradient-to-tr from-indigo-50 to-white rounded-lg flex items-center justify-center">
                            <svg className="w-20 h-20 text-indigo-200" viewBox="0 0 64 64" fill="none" aria-hidden>
                                <rect x="6" y="18" width="52" height="34" rx="4" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M18 26h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M18 34h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
