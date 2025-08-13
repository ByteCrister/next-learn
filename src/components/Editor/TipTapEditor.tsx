"use client";

import React from "react";
import { Button } from "../ui/button";
import TipTapContentEditor from "./TipTapContentEditor";

interface EditorProps {
  content: string; // initial intro content
  onChange: (html: string) => void;
  handleSave: (introContent: string) => void;
}

const TipTapEditor = ({
  content = "<p></p>",
  onChange,
  handleSave,
}: EditorProps) => {
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-colors duration-300">

      {/* Intro Section */}
      <section>
        <label
          htmlFor="intro-content"
          className="block mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300"
        >
          Editor
        </label>
        <TipTapContentEditor
          content={content}
          onChange={onChange}
          className="prose prose-lg prose-blue max-w-full border border-gray-300 dark:border-gray-700 rounded-lg p-5 min-h-[250px] shadow-sm dark:prose-invert transition-colors duration-300"
        />
      </section>

      {/* Save Button */}
      <Button
        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-200"
        onClick={() => handleSave(content)}
      >
        Save
      </Button>
    </main>
  );
}

export default TipTapEditor;