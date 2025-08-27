import { CALENDAR_CONFIG, ERROR_MESSAGES } from "@/config/constants";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateTodoTitle = (title: string): ValidationResult => {
  const errors: string[] = [];

  if (!title.trim()) {
    errors.push(ERROR_MESSAGES.TITLE_REQUIRED);
  }

  if (title.length > CALENDAR_CONFIG.MAX_TITLE_LENGTH) {
    errors.push(ERROR_MESSAGES.TITLE_TOO_LONG);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTodoLimit = (todosCount: number): ValidationResult => {
  const errors: string[] = [];

  if (todosCount >= CALENDAR_CONFIG.MAX_TODOS_PER_DAY) {
    errors.push(ERROR_MESSAGES.TODO_LIMIT_EXCEEDED);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
