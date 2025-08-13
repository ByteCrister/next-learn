// app/api/chapters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CourseRoadmap } from "@/models/CourseRoadmap"; // your mongoose model
import ConnectDB from "@/config/ConnectDB";

export async function POST(req: NextResponse) {
  try {
    await ConnectDB();
    const body = await req.json();
    const { title, roadmapId } = body;

    if (!title || !roadmapId) {
      return NextResponse.json(
        { message: "Missing title or roadmapId" },
        { status: 400 }
      );
    }

    const roadmap = await CourseRoadmap.findById(roadmapId);
    if (!roadmap) {
      return NextResponse.json(
        { message: "Roadmap not found" },
        { status: 404 }
      );
    }

    roadmap.chapters.push({
      title,
      content: {}, // empty TipTap JSON
      materials: [],
      subjectId: roadmap.subjectId, // ← satisfy IChapter interface
    });

    await roadmap.save();

    return NextResponse.json(
      roadmap.chapters[roadmap.chapters.length - 1], // return newly created chapter
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating chapter:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/*
 * _________________________________ PATCH ___________________________________
 */
const HEX24 = /^[0-9a-fA-F]{24}$/;
const VALID_FIELDS = ["title", "content", "materials"] as const;
type ValidField = (typeof VALID_FIELDS)[number];

interface PatchChapterInput {
  roadmapId: string;
  chapterId: string;
  field: ValidField;
  data: unknown;
}

export async function PATCH(request: NextRequest) {
  // 1) Parse JSON body
  let body: PatchChapterInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { roadmapId, chapterId, field, data } =
    body as Partial<PatchChapterInput>;

  // 2) Basic runtime validation
  if (typeof roadmapId !== "string" || !HEX24.test(roadmapId)) {
    return NextResponse.json(
      { message: "Invalid or missing roadmapId" },
      { status: 422 }
    );
  }

  if (typeof chapterId !== "string" || !HEX24.test(chapterId)) {
    return NextResponse.json(
      { message: "Invalid or missing chapterId" },
      { status: 422 }
    );
  }

  if (!VALID_FIELDS.includes(field as ValidField)) {
    return NextResponse.json(
      { message: `field must be one of ${VALID_FIELDS.join(", ")}` },
      { status: 422 }
    );
  }

  // Optional: type‐check `data` further based on `field`
  // e.g. if (field === "materials" && !Array.isArray(data)) { … }

  // 3) Connect to DB
  try {
    await ConnectDB();
  } catch (err) {
    console.error("DB connection error:", err);
    return NextResponse.json(
      { message: "Database connection error" },
      { status: 500 }
    );
  }

  // 4) Build the dynamic update path
  const setPath = `chapters.$.${field}`;

  // 5) Atomic update + return the updated chapter
  try {
    const updatedRoadmap = await CourseRoadmap.findOneAndUpdate(
      { _id: roadmapId, "chapters._id": chapterId },
      { $set: { [setPath]: data } },
      { new: true, projection: { chapters: 1 } }
    ).lean();

    if (!updatedRoadmap) {
      return NextResponse.json(
        { message: "Roadmap or chapter not found" },
        { status: 404 }
      );
    }

    const updatedChapter = updatedRoadmap.chapters.find(
      (c) => c._id?.toString() === chapterId
    );

    if (!updatedChapter) {
      // This should be unreachable given the query filter
      return NextResponse.json(
        { message: "Chapter not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (err) {
    console.error("Error updating chapter:", err);
    return NextResponse.json(
      { message: "Server error while updating chapter" },
      { status: 500 }
    );
  }
}
