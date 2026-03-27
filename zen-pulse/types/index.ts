export type MoodKey = 'calm' | 'sad' | 'stressed';

export interface Session {
  id: string;
  title: string;
  coverImage: string;
  durationMinutes: number;
  isPremium: boolean;
}

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly';
  label: string;
  price: string;
  isRecommended: boolean;
  trialDays: number;
}

export interface Mood {
  key: MoodKey;
  emoji: string;
  label: string;
}

export interface AffirmationResult {
  text: string;
  source: 'llm' | 'mock';
  mood: MoodKey;
}
