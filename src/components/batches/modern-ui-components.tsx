'use client';

import React from "react";
import { FiChevronDown } from "react-icons/fi";

/* --------- Modern UI Components ---------- */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className = "", ...props }, ref) => (
        <input
            ref={ref}
            className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400 text-sm ${className}`}
            {...props}
        />
    )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className = "", ...props }, ref) => (
        <textarea
            ref={ref}
            className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none text-sm ${className}`}
            {...props}
        />
    )
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
    ({ className = "", children, ...props }, ref) => (
        <div className="relative">
            <select
                ref={ref}
                className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-900 appearance-none cursor-pointer text-sm ${className}`}
                {...props}
            >
                {children}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
        </div>
    )
);
Select.displayName = "Select";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = "", ...props }) => (
    <label className={`block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide uppercase ${className}`} {...props} />
);

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "destructive" }>(
    ({ className = "", variant = "primary", children, ...props }, ref) => {
        const variants = {
            primary: "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-sm hover:shadow-md",
            secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200",
            ghost: "bg-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900",
            destructive: "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200",
        };

        return (
            <button
                ref={ref}
                className={`px-3.5 py-2 rounded-lg font-medium transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${variants[variant]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";