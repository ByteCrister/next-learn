'use client';

import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

import { EditorProvider } from './EditorProvider';
import { TiptapEditor } from './TiptapEditor';
import { Toolbar } from './Toolbar';
import { Actions } from './Actions';
import { Download, Eye } from 'lucide-react';

// Static content for local testing
const STATIC_CONTENT = {
    type: 'doc',
    content: [
        {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📚 Course Roadmap (Modern UI)' }],
        },
        {
            type: 'paragraph',
            content: [
                {
                    type: 'text',
                    text: 'This is a preview of your roadmap. Toggle tabs to edit or preview content in real time.',
                },
            ],
        },
    ],
};

export function RoadmapEditor() {
    const [title, setTitle] = useState('Static Roadmap Title');

    return (
        <EditorProvider initialContent={STATIC_CONTENT}>
            <Card className="max-w-4xl mx-auto my-10 shadow-lg">
                {/* HEADER */}
                <CardHeader className="flex items-center justify-between gap-4 pb-0">
                    <div className="flex-1">
                        <CardTitle className="mb-1">
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter roadmap title..."
                                className="text-3xl font-bold p-0 bg-transparent focus:ring-0"
                            />
                        </CardTitle>
                        <CardDescription>
                            Build a step-by-step learning path for your course.
                        </CardDescription>
                    </div>

                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                            <Eye />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Download />
                        </Button>
                    </div>
                </CardHeader>

                <Separator className="my-4" />

                {/* CONTENT (TABS) */}
                <CardContent className="space-y-6">
                    <Tabs defaultValue="edit">
                        <TabsList>
                            <TabsTrigger value="edit">Edit</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>

                        {/* EDIT TAB */}
                        <TabsContent value="edit" className="space-y-4">
                            <Toolbar />

                            <div className="border rounded-lg bg-background p-6">
                                <TiptapEditor />
                            </div>
                        </TabsContent>

                        {/* PREVIEW TAB */}
                        <TabsContent value="preview">
                            <div className="prose dark:prose-invert">
                                <TiptapEditor  />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <Separator className="my-4" />

                {/* FOOTER ACTIONS */}
                <CardFooter className="flex justify-end">
                    <Actions
                        roadmapId={undefined}
                        title={title}
                        setRoadmap={({ content }) => {
                            console.log('🚀 Saved content:', content)
                            alert('Check console for JSON payload')
                        }}
                    />
                </CardFooter>
            </Card>
        </EditorProvider>
    );
}
