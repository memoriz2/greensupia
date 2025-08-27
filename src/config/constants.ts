export const CALENDAR_CONFIG = {
  MAX_TODOS_PER_DAY: 10,
  MAX_TITLE_LENGTH: 100,
  ANIMATION_DURATION: 300,
  WEEKS_TO_SHOW: 5,
  TODOS_TO_SHOW_IN_CELL: 3,
} as const;

export const PRIORITY_COLORS = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#10b981",
} as const;

export const ERROR_MESSAGES = {
  TITLE_REQUIRED: "제목을 입력해주세요",
  TITLE_TOO_LONG: `제목은 ${CALENDAR_CONFIG.MAX_TITLE_LENGTH}자 이내로 입력해주세요`,
  TODO_LIMIT_EXCEEDED: `하루에 ${CALENDAR_CONFIG.MAX_TODOS_PER_DAY}개까지만 추가할 수 있습니다`,
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 다시 시도해주세요",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다",
} as const;
