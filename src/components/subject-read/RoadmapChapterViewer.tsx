"use client";
import React from "react";
import DOMPurify from "dompurify";
import type { VChapter } from "@/types/types.roadmap";
import styles from "./../../styles/roadmap-viewer.module.css";

/* Minimal ProseMirror / TipTap types reused here */
type Mark = {
    type: string;
    attrs?: Record<string, unknown>;
};

type ProseTextNode = {
    type: "text";
    text?: string;
    marks?: Mark[];
};

type ProseNode = {
    type: string;
    attrs?: Record<string, unknown>;
    text?: string;
    marks?: Mark[];
    content?: Array<ProseNode | ProseTextNode>;
};

type ProseDoc = {
    type: "doc";
    content?: Array<ProseNode | ProseTextNode>;
};

export default function RoadmapChapterViewer({
    chapter,
}: {
    chapter: VChapter;
}) {
    try {
        const parsed: unknown = JSON.parse(chapter.content);

        if (isObjectWithHtml(parsed)) {
            const html = String(parsed.html);
            const clean = DOMPurify.sanitize(html, {
                USE_PROFILES: { html: true },
                ADD_ATTR: [
                    "loading",
                    "decoding",
                    "width",
                    "height",
                    "class",
                    "style",
                    "colspan",
                    "rowspan",
                ],
            });
            return (
                <div
                    className={styles.htmlContainer}
                    dangerouslySetInnerHTML={{ __html: clean }}
                />
            );
        }

        if (isProseDoc(parsed)) {
            const html = convertDocToHtml(parsed);
            const clean = DOMPurify.sanitize(html, {
                USE_PROFILES: { html: true },
                ADD_ATTR: [
                    "loading",
                    "decoding",
                    "width",
                    "height",
                    "class",
                    "style",
                    "colspan",
                    "rowspan",
                ],
            });
            return (
                <div
                    className={styles.htmlContainer}
                    dangerouslySetInnerHTML={{ __html: clean }}
                />
            );
        }

        const clean = DOMPurify.sanitize(String(chapter.content), {
            USE_PROFILES: { html: true },
            ADD_ATTR: [
                "loading",
                "decoding",
                "width",
                "height",
                "class",
                "style",
                "colspan",
                "rowspan",
            ],
        });
        return (
            <div
                className={styles.htmlContainer}
                dangerouslySetInnerHTML={{ __html: clean }}
            />
        );
    } catch {
        const clean = DOMPurify.sanitize(chapter.content || "", {
            USE_PROFILES: { html: true },
            ADD_ATTR: [
                "loading",
                "decoding",
                "width",
                "height",
                "class",
                "style",
                "colspan",
                "rowspan",
            ],
        });
        return (
            <div
                className={styles.htmlContainer}
                dangerouslySetInnerHTML={{ __html: clean }}
            />
        );
    }
}

/* Type guards */

function isObjectWithHtml(v: unknown): v is { html: unknown } {
    return Boolean(
        v && typeof v === "object" && "html" in (v as Record<string, unknown>)
    );
}

function isProseDoc(v: unknown): v is ProseDoc {
    if (!v || typeof v !== "object") return false;
    const maybe = v as Record<string, unknown>;
    if (maybe.type !== "doc") return false;
    if (!("content" in maybe)) return true;
    return (
        Array.isArray(maybe.content) &&
        (maybe.content as unknown[]).every(isProseNodeOrText)
    );
}

function isProseNode(v: unknown): v is ProseNode {
    if (!v || typeof v !== "object") return false;
    const n = v as Record<string, unknown>;
    if (typeof n.type !== "string") return false;
    if ("content" in n && n.content !== undefined) {
        if (!Array.isArray(n.content)) return false;
        return (n.content as unknown[]).every(isProseNodeOrText);
    }
    return true;
}

function isProseTextNode(v: unknown): v is ProseTextNode {
    if (!v || typeof v !== "object") return false;
    const n = v as Record<string, unknown>;
    if (n.type !== "text") return false;
    if ("text" in n && n.text !== undefined && typeof n.text !== "string")
        return false;
    if ("marks" in n && n.marks !== undefined && !Array.isArray(n.marks))
        return false;
    return true;
}

function isProseNodeOrText(v: unknown): v is ProseNode | ProseTextNode {
    return isProseNode(v) || isProseTextNode(v);
}

/* Converter: ProseDoc -> HTML (typed, defensive) */

function convertDocToHtml(doc: ProseDoc): string {
    const nodes = Array.isArray(doc.content)
        ? (doc.content as Array<ProseNode | ProseTextNode>)
        : [];
    return nodes.map((n) => renderNode(n)).join("");
}

function hasContent(
    node: ProseNode | ProseTextNode
): node is ProseNode & { content: Array<ProseNode | ProseTextNode> } {
    return Boolean(
        node &&
        typeof node === "object" &&
        "content" in node &&
        Array.isArray((node as Record<string, unknown>).content)
    );
}

function renderChildren(node: ProseNode | ProseTextNode): string {
    if (!hasContent(node)) return "";
    return node.content.map((child) => renderNode(child)).join("");
}

function renderNode(node: ProseNode | ProseTextNode): string {
    if (node.type === "text") return renderTextNode(node as ProseTextNode);
    const type = node.type;

    switch (type) {
        case "paragraph": {
            const inner = renderChildren(node);
            return `<p>${inner}</p>`;
        }
        case "heading": {
            const level = safeGetLevel(node.attrs);
            const inner = renderChildren(node);
            const safeLevel = Math.min(3, Math.max(1, level));
            return `<h${safeLevel}>${inner}</h${safeLevel}>`;
        }
        case "bullet_list": {
            const items = renderChildren(node);
            return `<ul>${items}</ul>`;
        }
        case "ordered_list": {
            const items = renderChildren(node);
            return `<ol>${items}</ol>`;
        }
        case "list_item": {
            const inner = renderChildren(node);
            return `<li>${inner}</li>`;
        }
        case "blockquote": {
            const inner = renderChildren(node);
            return `<blockquote>${inner}</blockquote>`;
        }
        case "code_block": {
            const text = renderChildren(node);
            return `<pre class="code"><code>${escapeHtml(text)}</code></pre>`;
        }
        case "hard_break":
            return "<br/>";

        case "horizontal_rule":
        case "rule":
            return '<hr class="hr" />';

        case "image": {
            const src =
                typeof node.attrs?.src === "string" ? escapeAttr(node.attrs.src) : "";
            const alt =
                typeof node.attrs?.alt === "string" ? escapeHtml(node.attrs.alt) : "";
            const title =
                typeof node.attrs?.title === "string"
                    ? escapeAttr(node.attrs.title)
                    : "";
            const width = node.attrs?.width
                ? ` width="${escapeAttr(node.attrs.width)}"`
                : "";
            const height = node.attrs?.height
                ? ` height="${escapeAttr(node.attrs.height)}"`
                : "";
            return `<figure class="tiptap-figure"><img src="${src}" alt="${alt}" title="${title}" loading="lazy"${width}${height} /></figure>`;
        }

        case "table": {
            // node.content -> rows
            const rowsHtml = (node.content || []).map(renderNode).join("");
            return `<div class="tiptap-table-wrapper"><table>${rowsHtml}</table></div>`;
        }

        case "table_row":
            return `<tr>${renderChildren(node)}</tr>`;

        case "table_cell":
        case "table_header":
            const cellTag = node.type === "table_header" ? "th" : "td";
            return `<${cellTag}>${renderChildren(node)}</${cellTag}>`;

        case "list_item": {
            // If first child is a paragraph and it's the only child, unwrap it
            if (
                hasContent(node) &&
                node.content.length === 1 &&
                node.content[0].type === "paragraph"
            ) {
                return `<li>${renderChildren(node.content[0] as ProseNode)}</li>`;
            }
            const inner = renderChildren(node);
            return `<li>${inner}</li>`;
        }

        default: {
            return renderChildren(node);
        }
    }
}

function renderTextNode(node: ProseTextNode): string {
    const raw = node.text ?? "";
    const escaped = escapeHtml(raw);
    const marks = Array.isArray(node.marks) ? node.marks : [];
    return marks.reduce((acc, mark) => applyMark(acc, mark), escaped);
}

function applyMark(inner: string, mark: Mark): string {
    switch (mark.type) {
        case "strong":
            return `<strong>${inner}</strong>`;
        case "em":
            return `<em>${inner}</em>`;
        case "strike":
            return `<s>${inner}</s>`;
        case "link": {
            const href =
                typeof mark.attrs?.href === "string"
                    ? escapeAttr(mark.attrs.href)
                    : "#";
            return `<a href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
        }
        default:
            return inner;
    }
}

function safeGetLevel(attrs?: Record<string, unknown>): number {
    if (!attrs) return 1;
    const lvl = attrs.level;
    if (typeof lvl === "number" && Number.isFinite(lvl)) return Math.floor(lvl);
    if (typeof lvl === "string" && /^[0-9]+$/.test(lvl)) return parseInt(lvl, 10);
    return 1;
}

/* Escaping helpers */

function escapeHtml(s: string) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function escapeAttr(v: unknown) {
    return String(v)
        .replace(/"/g, "&quot;")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
