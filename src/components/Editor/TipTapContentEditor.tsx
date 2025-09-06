"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import DragHandle from "@tiptap/extension-drag-handle";
import { useEffect, useState } from "react";
import { Extension } from "@tiptap/core";
import { keymap } from "prosemirror-keymap";
import { sinkListItem, liftListItem } from "prosemirror-schema-list";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHeading,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLink,
  FaImage,
  FaUndo,
} from "react-icons/fa";

import "../../styles/editor.css";
import { compressImageToBase64 } from "@/lib/compress-image";
import ImageSizeAlert from "../alerts/ImageSizeAlert";
import { CustomImage } from "./CustomImage";
import TipTapContentEditorSkeleton from "./TipTapContentEditorSkeleton";

const ListKeymapExtension = Extension.create({
  name: "listKeymap",
  addProseMirrorPlugins() {
    return [
      keymap({
        Tab: (state, dispatch) =>
          sinkListItem(state.schema.nodes.listItem)(state, dispatch),
        "Shift-Tab": (state, dispatch) =>
          liftListItem(state.schema.nodes.listItem)(state, dispatch),
      }),
    ];
  },
});

interface TipTapEditorProps {
  content?: string;
  onChange: (html: string) => void;
  editable?: boolean;
  className?: string;
}

export default function TipTapContentEditor({
  content = "",
  onChange,
  editable = true,
  className,
}: TipTapEditorProps) {
  const [showImageAlert, setShowImageAlert] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      ListKeymapExtension,
      Underline,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      CustomImage,
      ImageResize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      DragHandle,
    ],
    content: content,
    editable,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content && content !== current) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        setShowImageAlert(true);
        return;
      }

      const base64 = await compressImageToBase64(file);
      editor?.chain().focus().setImage({ src: base64 }).run();
    };
    input.click();
  };

  if (!editor) return <TipTapContentEditorSkeleton />;

  function ToolbarButton({
    icon,
    onClick,
    active,
    label,
  }: {
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    label: string;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={`p-3 rounded-lg transition-all duration-150 flex items-center justify-center ${active
            ? "bg-indigo-600 text-white shadow-md scale-105"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
      >
        {icon}
      </button>
    );
  }

  return (
    <>
      <div className={className}>
        {/* Responsive Toolbar */}
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 mb-3 p-2 rounded-xl shadow-sm overflow-x-auto flex gap-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600">
          <ToolbarButton
            label="Bold"
            icon={<FaBold />}
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="Italic"
            icon={<FaItalic />}
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="Underline"
            icon={<FaUnderline />}
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            label="Strikethrough"
            icon={<FaStrikethrough />}
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <ToolbarButton
            label="Heading 1"
            icon={<FaHeading />}
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarButton
            label="Bullet List"
            icon={<FaListUl />}
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="Ordered List"
            icon={<FaListOl />}
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            label="Align Left"
            icon={<FaAlignLeft />}
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          />
          <ToolbarButton
            label="Align Center"
            icon={<FaAlignCenter />}
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          />
          <ToolbarButton
            label="Align Right"
            icon={<FaAlignRight />}
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          />
          <ToolbarButton
            label="Reset Alignment"
            icon={<FaUndo />}
            onClick={() => editor.chain().focus().unsetTextAlign().run()}
          />
          <ToolbarButton label="Insert Image" icon={<FaImage />} onClick={addImage} />
          <LinkButton editor={editor} />
        </div>

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="ProseMirror min-h-[250px] max-w-full rounded-md focus:outline-none"
        />
      </div>
      <ImageSizeAlert isOpen={showImageAlert} setIsOpen={setShowImageAlert} />
    </>
  );
}

function LinkButton({ editor }: { editor: Editor | null }) {
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    if (!url) return setIsOpen(false);
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setIsOpen(false);
    setUrl("");
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`p-2 rounded-md transition-colors duration-150 ${editor.isActive("link") ? "bg-blue-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        title="Link"
        aria-label="Link"
      >
        <FaLink />
      </button>

      {isOpen && (
        <div className="absolute mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-30 flex space-x-2 items-center min-w-[220px]">
          <input
            type="url"
            placeholder="Enter URL"
            className="flex-grow border border-gray-300 rounded-md px-3 py-1 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setLink()}
            autoFocus
          />
          <button
            onClick={setLink}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
          >
            Set
          </button>
          <button
            onClick={() => {
              unsetLink();
              setIsOpen(false);
              setUrl("");
            }}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
