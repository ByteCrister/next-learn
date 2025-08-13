"use client";

import React, { useState } from "react";
import TipTapEditor from "./TipTapContentEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ChapterEditorPage() {
    const [title, setTitle] = useState("");
    const [introContent, setIntroContent] = useState(
        "<p>Start editing the chapter ...</p>"
    );

    const handleSave = () => {
        console.log("Title:", title);
        console.log("Intro HTML content:", introContent);
        // API call or whatever next step
    };

    return (
        <main className="max-w-4xl mx-auto p-8 space-y-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-colors duration-300">
            {/* Title Input */}
            <Input
                placeholder="Chapter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-extrabold border-0 border-b-4 border-blue-600 focus:ring-0 focus:border-blue-700 transition-colors duration-300 dark:bg-gray-900 dark:text-white"
                autoFocus
                spellCheck={false}
            />

            {/* Intro Section */}
            <section>
                <label
                    htmlFor="intro-content"
                    className="block mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300"
                >
                    Edit Chapter
                </label>
                <TipTapEditor
                    content={introContent}
                    onChange={setIntroContent}
                    className="prose prose-lg prose-blue max-w-full border border-gray-300 dark:border-gray-700 rounded-lg p-5 min-h-[250px] shadow-sm dark:prose-invert transition-colors duration-300"
                />
            </section>

            {/* Save Button */}
            <Button
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-200"
                onClick={handleSave}
            >
                Save Chapter
            </Button>
        </main>
    );
}
