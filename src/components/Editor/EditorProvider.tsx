'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';

interface EditorContext {
    editor: ReturnType<typeof useEditor> | null;
    loading: boolean;
    setLoading: (v: boolean) => void;
}

interface EditorProviderProps {
    initialContent: JSONContent;
    children: ReactNode;
}

const EditorCtx = createContext<EditorContext | null>(null);

export function EditorProvider({ initialContent, children }: EditorProviderProps) {
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            ImageExtension.configure({ inline: true }),
        ],
        content: initialContent,
        immediatelyRender: false,
    });

    return (
        <EditorCtx.Provider value={{ editor, loading, setLoading }}>
            {children}
        </EditorCtx.Provider>
    );
}

export const useEditorContext = () => {
    const ctx = useContext(EditorCtx);
    if (!ctx) throw new Error('useEditorContext must be inside EditorProvider');
    return ctx;
};
