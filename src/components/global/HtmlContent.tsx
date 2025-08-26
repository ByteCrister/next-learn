"use client";

import React from "react";
import clsx from "clsx";

interface HtmlContentProps {
    html: string;
    className?: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html, className }) => {
    return (
        <div
            className={clsx(
                // Base card style
                "dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 dark:prose-invert",

                // Headings
                "[&>h1]:text-5xl [&>h1]:font-extrabold [&>h1]:mb-6",
                "[&>h2]:text-4xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4",
                "[&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3",

                // Paragraphs
                "[&>p]:leading-relaxed [&>p]:my-4",

                // Lists
                "[&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 marker:text-indigo-500",
                "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2 marker:text-indigo-500",

                // Links
                "[&>a]:text-indigo-600 hover:[&>a]:text-indigo-800 dark:[&>a]:text-indigo-400 dark:hover:[&>a]:text-indigo-300 [&>a]:underline",

                // Blockquotes
                "[&>blockquote]:border-l-4 [&>blockquote]:border-indigo-500 [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:bg-indigo-50 [&>blockquote]:py-3 [&>blockquote]:rounded-md dark:[&>blockquote]:bg-gray-800",

                // Code
                "[&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto",
                "[&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded dark:[&>code]:bg-gray-700",

                // Tables
                "[&>table]:border-collapse [&>table]:w-full [&>table]:my-6",
                "[&>th]:border [&>th]:border-gray-300 [&>th]:px-4 [&>th]:py-2 [&>th]:bg-indigo-100",
                "[&>td]:border [&>td]:border-gray-300 [&>td]:px-4 [&>td]:py-2 dark:[&>th]:bg-gray-700",

                className
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default HtmlContent;
