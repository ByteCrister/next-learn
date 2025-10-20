"use client";

import React from "react";
import "../../styles/roadmap-viewer.module.css";
import { normalizeHtml } from "@/utils/helpers/normalizeHtml";

interface RoadmapViewerProps {
    htmlContent: string;
}

const RoadmapViewer = ({ htmlContent }: RoadmapViewerProps) => {
    const safeHtml = normalizeHtml(htmlContent);
    return (
        <div
            className={'htmlContainer'}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    )
}

export default RoadmapViewer
