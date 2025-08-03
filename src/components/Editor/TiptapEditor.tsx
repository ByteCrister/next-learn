'use client';

import { EditorContent } from '@tiptap/react';
import { useEditorContext } from './EditorProvider';

interface Props {
  readOnly?: boolean;
}

export function TiptapEditor({ readOnly = false }: Props) {
  const { editor } = useEditorContext();
  if (!editor) return null;

  // Toggle editability
  editor.setOptions({ editable: !readOnly });

  return <EditorContent editor={editor} className="min-h-[300px]" />
}
