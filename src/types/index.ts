export interface Flashcard {
  id: string;
  userId: string;
  word: string;
  translation: string;
  language: string;
  type: "noun" | "verb" | "adjective" | "phrase" | "other";
  example: string;
  notes: string;
  learned: boolean;
  lastReviewed: string | null;
  nextReview: string;
  intervalIndex: number;
  createdAt: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  stats: {
    totalCards: number;
    learnedCards: number;
    reviewDue: number;
    streak: number;
    lastActive: string;
  };
}

export interface UploadResult {
  success: boolean;
  message: string;
  created?: number;
  failed?: number;
  errors?: string[];
  stats?: {
    total: number;
    nouns: number;
    verbs: number;
    adjectives: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
