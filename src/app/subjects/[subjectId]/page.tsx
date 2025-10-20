import SubjectPage from "@/components/subjects-subject/SubjectPage";
import { fetchSubjectById } from "@/utils/api/api.subjects";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ subjectId: string }> }): Promise<Metadata> {
  const { subjectId } = await params;
  const result = await fetchSubjectById(subjectId);

  if (!result || typeof result !== 'object' || "message" in result) {
    return {
      title: "Next Learn - Study Planner & Roadmap Management",
      description: "The requested subject could not be found. Explore other subjects on our platform.",
      openGraph: {
        title: "Next Learn - Study Planner & Roadmap Management",
        description: "The requested subject could not be found. Explore other subjects on our platform.",
        type: "website",
        siteName: "Next Learn - Study Planner & Roadmap Management",
        url: `http://localhost:3000/subjects/${subjectId}`,
      },
      twitter: {
        card: "summary",
        title: "Next Learn - Study Planner & Roadmap Management",
        description: "The requested subject could not be found. Explore other subjects on our platform.",
      },
    };
  }

  const { subject } = result;

  return {
    title: `Next Learn - Study Planner & Roadmap Management - ${subject.title}`,
    description: subject.description || `Explore notes, chapters, and resources for ${subject.title}.`,
    keywords: [subject.title, "study notes", "education", "learning resources"],
    openGraph: {
      title: `Next Learn - Study Planner & Roadmap Management - ${subject.title}`,
      description: subject.description || `Explore notes, chapters, and resources for ${subject.title}.`,
      type: "website",
      siteName: "Next Learn - Study Planner & Roadmap Management",
      url: `http://localhost:3000/subjects/${subjectId}`,
    },
    twitter: {
      card: "summary",
      title: `Next Learn - Study Planner & Roadmap Management - ${subject.title}`,
      description: subject.description || `Explore notes, chapters, and resources for ${subject.title}.`,
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Course",
        name: subject.title,
        description: subject.description,
        provider: {
          "@type": "Organization",
          name: "Next Learn - Study Planner & Roadmap Management",
        },
      }),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  return <SubjectPage subjectId={subjectId} />;
}
