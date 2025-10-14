// src/utils/participantId.ts

import { IExamValidationRule } from "@/models/ExamModel";

// 
export function validateParticipantId(id: string, rule: IExamValidationRule): boolean {
  if (rule.minLength && id.length < rule.minLength) return false;
  if (rule.maxLength && id.length > rule.maxLength) return false;
  if (rule.startsWith && rule.startsWith.length > 0) {
    if (!rule.startsWith.some(prefix => id.startsWith(prefix))) return false;
  }
  return true;
}
