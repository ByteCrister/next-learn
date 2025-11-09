// app/api/chapters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CourseRoadmap } from "@/models/CourseRoadmap"; // your mongoose model
import { Chapter } from "@/models/Chapter";
import ConnectDB from "@/config/ConnectDB";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get('roadmapId');

    if (!roadmapId) {
      return NextResponse.json(
        { message: "Missing roadmapId" },
        { status: 400 }
      );
    }

    // Fetch chapters from Chapter collection
    const chapters = await Chapter.find({ roadmapId }).sort({ createdAt: 1 }).lean();

    return NextResponse.json(chapters, { status: 200 });
  } catch (err) {
    console.error("Error fetching chapters:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

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

    // Create new chapter document
    const newChapter = new Chapter({
      title,
      content: {}, // empty TipTap JSON
      materials: [],
      roadmapId,
    });

    const savedChapter = await newChapter.save();

    // Add chapter ID to roadmap's chapters array
    await CourseRoadmap.findByIdAndUpdate(roadmapId, {
      $push: { chapters: savedChapter._id }
    });

    return NextResponse.json(savedChapter, { status: 201 });
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

  // Additional type-check for 'content' field to ensure it's an array or string
  if (field === "content" && !(typeof data === "string" || Array.isArray(data))) {
    return NextResponse.json(
      { message: "Invalid data type for content field" },
      { status: 422 }
    );
  }

  // Additional type-check for 'materials' field to ensure it's an array
  if (field === "materials" && !Array.isArray(data)) {
    return NextResponse.json(
      { message: "Invalid data type for materials field" },
      { status: 422 }
    );
  }

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

  // 4) Update chapter document directly
  try {
    // Check size of data to avoid BSON size limit error
    const dataSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
    const MAX_BSON_SIZE = 16 * 1024 * 1024; // 16MB

    // For content field, be more conservative with size limit
    if (field === "content") {
      const CONTENT_SIZE_LIMIT = 14 * 1024 * 1024; // 14MB for content to leave room for other fields
      if (dataSize > CONTENT_SIZE_LIMIT) {
        return NextResponse.json(
          { message: "Content size exceeds safe limit (14MB). Please reduce content size." },
          { status: 413 }
        );
      }
    } else if (dataSize > MAX_BSON_SIZE) {
      return NextResponse.json(
        { message: "Data size exceeds MongoDB BSON document size limit (16MB)" },
        { status: 413 }
      );
    }

    // Update the chapter document
    const updateResult = await Chapter.updateOne(
      { _id: chapterId, roadmapId },
      { $set: { [field as string]: data } }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    // Fetch the updated chapter
    const updatedChapter = await Chapter.findById(chapterId).lean();

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (err) {
    console.error("Error updating chapter:", err);
    return NextResponse.json(
      { message: "Server error while updating chapter" },
      { status: 500 }
    );
  }
}

/*
 * _________________________________ DELETE ___________________________________
 */
export async function DELETE(request: NextRequest) {
  // 1) Parse JSON body
  let body: { roadmapId: string; chapterId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { roadmapId, chapterId } = body;

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

  // 4) Delete the chapter document and remove from roadmap
  try {
    // Delete the chapter document
    const deleteResult = await Chapter.deleteOne({ _id: chapterId, roadmapId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    // Remove chapter ID from roadmap's chapters array
    await CourseRoadmap.findByIdAndUpdate(roadmapId, {
      $pull: { chapters: chapterId }
    });

    return NextResponse.json({ message: "Chapter deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting chapter:", err);
    return NextResponse.json(
      { message: "Server error while deleting chapter" },
      { status: 500 }
    );
  }
}
