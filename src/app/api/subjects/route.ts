// app/api/subjects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Subject } from "@/models/Subject";
import ConnectDB from "@/config/ConnectDB";
import mongoose from "mongoose";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { SubjectNote } from "@/models/SubjectNote";
import { ExternalLink } from "@/models/ExternalLink";
import { StudyMaterial } from "@/models/StudyMaterial";
import { decodeId } from "@/utils/helpers/IdConversion";
import { CourseRoadmap } from "@/models/CourseRoadmap";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await ConnectDB();

    const url = new URL(req.url);
    const searchedToken = url.searchParams.get("searched") ?? null;

    // get counts in parallel
    const [notesCount, externalLinksCount, studyMaterialsCount] =
      await Promise.all([
        SubjectNote.countDocuments({ userId }),
        ExternalLink.countDocuments({ userId }),
        StudyMaterial.countDocuments({ userId }),
      ]);

    // fetch entire list in canonical order (createdAt desc)
    const subjects = await Subject.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    let matched: { id: string; originalIndex: number } | null = null;

    if (searchedToken) {
      try {
        const rawId = decodeId(decodeURIComponent(searchedToken));

        // try to find the item in the already-loaded list
        const idx = subjects.findIndex((s) => String(s._id) === rawId);

        if (idx >= 0) {
          // move the found item to front regardless of original index
          const [item] = subjects.splice(idx, 1);
          subjects.unshift(item);
          matched = { id: String(item._id), originalIndex: idx };
        } else {
          // fallback: direct DB lookup and place it first if exists
          const direct = await Subject.findOne({
            _id: new mongoose.Types.ObjectId(rawId),
            userId,
          }).lean();
          if (direct) {
            // remove any duplicate with same id (defensive)
            const filtered = subjects.filter(
              (s) => String(s._id) !== String(direct._id)
            );
            // place direct at front
            subjects.length = 0;
            subjects.push(direct, ...filtered);
            matched = { id: String(direct._id), originalIndex: -1 };
          }
        }
      } catch (err) {
        // invalid token — ignore quietly
        console.warn("Invalid searched token:", err);
      }
    }

    return NextResponse.json(
      {
        subjects,
        counts: {
          notes: notesCount,
          externalLinks: externalLinksCount,
          studyMaterials: studyMaterialsCount,
        },
        matched,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/subjects error:", error);
    return NextResponse.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, code, description } = await request.json();

    if (!title || !code) {
      return NextResponse.json(
        { message: "Title and code are required" },
        { status: 400 }
      );
    }

    await ConnectDB();
    const newSubject = await Subject.create({
      userId,
      title,
      code,
      description,
    });

    // Create an empty TipTap roadmap for this subject
    const roadmapTitle = `${title} Roadmap`;
    const newCourseRoadmap = await CourseRoadmap.create({
      title: roadmapTitle,
      description: "",
      roadmap: "<p></p>",
      subjectId: newSubject._id,
      chapters: [],
    });

    return NextResponse.json(
      { subject: newSubject, roadmap: newCourseRoadmap },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/subjects error:", error);
    return NextResponse.json(
      { message: "Failed to create subject" },
      { status: 500 }
    );
  }
}
