// src/utils/resultLink.ts
export function buildResultPageUrl(
  base: string,
  obfuscated: {
    email: string;
    createdBy: string;
    examId: string;
    participantId: string;
    examCode: string;
  }
) {
  const segments = [
    encodeURIComponent(obfuscated.email),
    encodeURIComponent(obfuscated.createdBy),
    encodeURIComponent(obfuscated.examId),
    encodeURIComponent(obfuscated.participantId),
    encodeURIComponent(obfuscated.examCode),
  ].join("/");
  return `${base}/view-result/${segments}`;
}
