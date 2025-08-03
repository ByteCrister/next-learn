'use client';

import { Button } from '../ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../ui/dropdown-menu';
import * as Icons from 'lucide-react';
import { useEditorContext } from './EditorProvider';

export function Toolbar() {
    const { editor } = useEditorContext();
    if (!editor) return null;

    const headingLevels = [1, 2, 3, 4] as const;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Text Styles */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={() => editor.chain().focus().toggleBold().run()}>
                        <Icons.Bold />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <Icons.Italic />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            {/* Heading Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <Icons.Type /> Heading
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {headingLevels.map((lvl) => (
                        <DropdownMenuItem
                            key={lvl}
                            onSelect={() =>
                                editor.chain().focus().toggleHeading({ level: lvl }).run()
                            }
                        >
                            H{lvl}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Lists */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        <Icons.List />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                        <Icons.ListOrdered />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            {/* Image Insert */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={() => {
                            const url = prompt('Image URL')
                            if (url) editor.chain().focus().setImage({ src: url }).run()
                        }}
                    >
                        <Icons.Image />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>
        </div>
    )
}
