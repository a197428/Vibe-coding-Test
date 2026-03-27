import { Session } from '../types';

export const SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Утреннее спокойствие',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    durationMinutes: 10,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Снятие стресса',
    coverImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400',
    durationMinutes: 15,
    isPremium: false,
  },
  {
    id: '3',
    title: 'Глубокий сон',
    coverImage: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=400',
    durationMinutes: 20,
    isPremium: false,
  },
  {
    id: '4',
    title: 'Фокус и концентрация',
    coverImage: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400',
    durationMinutes: 12,
    isPremium: true,
  },
  {
    id: '5',
    title: 'Осознанное дыхание',
    coverImage: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=400',
    durationMinutes: 8,
    isPremium: true,
  },
  {
    id: '6',
    title: 'Медитация благодарности',
    coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
    durationMinutes: 18,
    isPremium: true,
  },
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly' as const,
    label: 'Ежемесячная',
    price: '299 ₽/мес',
    isRecommended: false,
    trialDays: 7,
  },
  {
    id: 'yearly' as const,
    label: 'Годовая',
    price: '1 990 ₽/год',
    isRecommended: true,
    trialDays: 7,
  },
];
