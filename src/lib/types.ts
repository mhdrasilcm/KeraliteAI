export type ClassLevel = "5" | "6" | "7" | "8" | "9";

export type FirstLanguage = "malayalam" | "urdu" | "arabic" | "sanskrit";

export type Medium = "english" | "malayalam";

export interface Profile {
  id: string;
  account_id: string; // groups sibling profiles under one email/auth.users row
  name: string;
  class_level: ClassLevel;
  first_language: FirstLanguage;
  medium: Medium;
  avatar_emoji: string | null;
  created_at: string;
}
