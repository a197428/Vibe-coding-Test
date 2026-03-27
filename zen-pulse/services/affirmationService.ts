import { AffirmationResult, MoodKey } from '../types';
import { MOCK_AFFIRMATIONS } from '../constants/mockAffirmations';
import { MOODS } from '../constants/moods';

const TIMEOUT_MS = 10000;

function truncateTo100Words(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 100) return text;
  return words.slice(0, 100).join(' ') + '…';
}

function hasCyrillic(text: string): boolean {
  return /[а-яёА-ЯЁ]/.test(text);
}

function getMoodLabel(mood: MoodKey): string {
  return MOODS.find((m) => m.key === mood)?.label ?? mood;
}

async function fetchWithTimeout(url: string, options: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export async function generateAffirmation(mood: MoodKey): Promise<AffirmationResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `Ты — тренер по медитации. Напиши короткую аффирмацию или медитативное наставление на русском языке для человека, который чувствует: ${getMoodLabel(mood)}. Текст должен быть тёплым, поддерживающим и не превышать 100 слов. Отвечай только текстом аффирмации, без вступлений и пояснений.`;

      const response = await fetchWithTimeout(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
          }),
        },
        TIMEOUT_MS
      );

      if (response.ok) {
        const data = await response.json();
        const text: string = data?.choices?.[0]?.message?.content ?? '';

        if (text && hasCyrillic(text)) {
          return { text: truncateTo100Words(text.trim()), source: 'llm', mood };
        }
      }
    } catch {
      // fallback to mock
    }
  }

  return {
    text: truncateTo100Words(MOCK_AFFIRMATIONS[mood]),
    source: 'mock',
    mood,
  };
}
