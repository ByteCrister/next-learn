"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import TipTapContentEditor from "./TipTapContentEditor";
import { FaSave, FaUndo, FaTimes } from "react-icons/fa";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  handleSave: (introContent: string) => void;
  handleCancel: () => void; // new prop for cancel button
}

const TipTapEditor = ({
  content,
  onChange,
  handleSave,
  handleCancel,
}: EditorProps) => {
  // Keep track of the original content
  const [originalContent, setOriginalContent] = useState(content);

  // Update original content if the prop changes
  useEffect(() => {
    setOriginalContent(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    onChange(originalContent);
  };

  return (
    <div className="max-w-4xl mx-auto my-12">
      {/* Header */}
      <header className="flex items-end justify-end mb-6 gap-3">
        {/* Reset Button */}
        <Button
          onClick={handleReset}
          className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-4 focus:ring-gray-300 text-white font-medium px-5 py-2 rounded-lg shadow-md transition"
        >
          <FaUndo className="text-white" />
          Reset
        </Button>

        {/* Cancel Button */}
        <Button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-4 focus:ring-red-300 text-white font-medium px-5 py-2 rounded-lg shadow-md transition"
        >
          <FaTimes className="text-white" />
          Cancel
        </Button>

        {/* Save Button */}
        <Button
          onClick={() => handleSave(content)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 text-white font-medium px-5 py-2 rounded-lg shadow-md transition"
        >
          <FaSave className="text-white" />
          Save Changes
        </Button>
      </header>

      {/* Editor Container */}
      <div className="prose prose-indigo dark:prose-invert max-w-none border border-gray-200 dark:border-gray-700 rounded-lg p-6 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow duration-200 shadow-sm hover:shadow-lg">
        <TipTapContentEditor
          content={content}
          onChange={onChange}
          className="min-h-[320px]"
        />
      </div>
    </div>
  );
};

export default TipTapEditor;
