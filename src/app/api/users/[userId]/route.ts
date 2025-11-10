// /api/users/[userId]
import ConnectDB from "@/config/ConnectDB";
import { Event } from "@/models/Event";
import ExamResultModel from "@/models/ExamResultModel";
import Routine from "@/models/Routine";
import { StudyMaterial } from "@/models/StudyMaterial";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

type ContextType = {
  params: {
    userId: string;
  };
};

export async function GET(request: Request, context: unknown) {
  try {
    const { userId } = (context as ContextType).params;
    await ConnectDB();

    // Ensure user exists
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Run queries in parallel
    const [studyMaterialCount, routines, examResults, upcomingEvents] =
      await Promise.all([
        StudyMaterial.countDocuments({ user: userId }),
        Routine.find({ user: userId }).lean(),
        ExamResultModel.find({ user: userId }).lean(),
        Event.countDocuments({ user: userId, date: { $gte: new Date() } }),
      ]);

    // Derived stats
    const totalRoutines = routines.length;

    const totalExams = examResults.length;
    const avgScore =
      totalExams > 0
        ? examResults.reduce((sum, e) => sum + (e.score || 0), 0) / totalExams
        : 0;
    const highestScore = Math.max(...examResults.map((e) => e.score || 0), 0);

    // Response
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
      },
      stats: {
        studyMaterials: studyMaterialCount,
        routines: totalRoutines,
        examsTaken: totalExams,
        averageScore: avgScore,
        highestScore,
        upcomingEvents: upcomingEvents,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
