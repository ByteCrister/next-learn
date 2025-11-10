// app/join-exam/[slug]/page.tsx

import JoinExamPage from "@/components/join-exam/JoinExamPage";

interface Props {
  params: { slug: string };
}

export default async function page({ params }: Props) {
  // await params before using
  const resolvedParams = await params;

  return (
    <JoinExamPage params={resolvedParams} />
  );
}
