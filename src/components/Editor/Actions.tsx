'use client';

import { Button } from '../ui/button';
import { useEditorContext } from './EditorProvider';
import { JSONContent } from '@tiptap/react';

export function Actions({
    roadmapId,
    title,
    setRoadmap,
}: {
    roadmapId?: string;
    title: string;
    setRoadmap: (data: { title: string; content: JSONContent }) => void;
}) {
    const { editor, loading, setLoading } = useEditorContext();

    const save = () => {
        if (!editor) return;
        setLoading(true);
        setRoadmap({ title, content: editor.getJSON() });
        setLoading(false);
    };

    const del = () => {
        if (!roadmapId) return;
        if (!confirm('Delete this roadmap?')) return;
        editor?.commands.clearContent();
        setRoadmap({ title: '', content: { type: 'doc', content: [] } });
    };

    return (
        <div className="flex gap-2">
            <Button onClick={save} disabled={loading}>
                {roadmapId ? 'Update' : 'Save'}
            </Button>
            {roadmapId && (
                <Button variant="destructive" onClick={del} disabled={loading}>
                    Delete
                </Button>
            )}
        </div>
    );
}
