import { ValidationRule } from '../../types/types.exam';

export function validateParticipantId(participantId: string, validationRule: ValidationRule): boolean {
  // Basic example for validationRule; expand as needed
  if (validationRule.startsWith && !validationRule.startsWith.some((prefix: string) => participantId.startsWith(prefix))) {
    return false;
  }
  if (validationRule.maxLength && participantId.length > validationRule.maxLength) {
    return false;
  }
  if (validationRule.minLength && participantId.length < validationRule.minLength) {
    return false;
  }
  if (validationRule.regex && !(new RegExp(validationRule.regex).test(participantId))) {
    return false;
  }
  return true;
}