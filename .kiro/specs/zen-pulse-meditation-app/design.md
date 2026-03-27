# Технический дизайн: ZenPulse Meditation App

## Обзор

ZenPulse — мобильное приложение на React Native (Expo) для медитаций с голосовым сопровождением. Прототип включает три ключевых экрана: пейволл (экран подписки), библиотеку медитаций и функцию ежедневных аффирмаций на основе ИИ. Весь UI отображается на русском языке.

Цель дизайна — создать минимальную, но полноценную архитектуру, которая:
- Симулирует реальный флоу покупки подписки
- Управляет глобальным состоянием подписки через сессию
- Интегрируется с LLM (или мок-ответами) для генерации аффирмаций
- Обеспечивает предсказуемую навигацию между экранами

---

## Архитектура

### Общая схема

```
┌─────────────────────────────────────────────────────┐
│                    Expo App                         │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │         SubscriptionContext (Zustand)        │   │
│  │   isSubscribed: boolean                      │   │
│  │   activateSub() / resetSub()                 │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │           React Navigation Stack             │   │
│  │                                              │   │
│  │   PaywallScreen ◄──── MeditationScreen       │   │
│  │        │                    │                │   │
│  │        └──── (активация) ───┘                │   │
│  │                             │                │   │
│  │                    SessionDetailScreen       │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │         AffirmationService                   │   │
│  │   generateAffirmation(mood) → string         │   │
│  │   → LLM API (или MockResponses)              │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Технологический стек

| Слой | Технология |
|------|-----------|
| Фреймворк | React Native + Expo SDK 51+ |
| UI-компоненты | NativeWind (Tailwind CSS для RN) |
| Навигация | React Navigation v6 (Stack Navigator) |
| Глобальное состояние | Zustand |
| LLM интеграция | OpenAI API (или мок при недоступности) |
| Тестирование | Jest + fast-check (property-based) |

---

## Структура файлов и компонентов

```
zen-pulse-meditation-app/
├── app/
│   ├── _layout.tsx              # Root layout, оборачивает в NavigationContainer + SubscriptionProvider
│   ├── index.tsx                # Точка входа → редирект на MeditationScreen
│   ├── paywall.tsx              # PaywallScreen
│   ├── meditation.tsx           # MeditationScreen (главный)
│   └── session/[id].tsx         # SessionDetailScreen (заглушка)
│
├── components/
│   ├── SessionCard.tsx          # Карточка сессии медитации
│   ├── MoodSelector.tsx         # Выбор настроения (3 эмодзи)
│   ├── AffirmationWidget.tsx    # Виджет аффирмации дня
│   ├── SubscriptionPlanCard.tsx # Карточка тарифа (Месяц / Год)
│   └── LockOverlay.tsx          # Затемнение + иконка замка
│
├── store/
│   └── subscriptionStore.ts     # Zustand store для статуса подписки
│
├── services/
│   └── affirmationService.ts    # Логика генерации аффирмаций (LLM + мок)
│
├── data/
│   └── sessions.ts              # Статические данные сессий медитации
│
├── constants/
│   ├── moods.ts                 # Определения настроений (эмодзи + подписи)
│   └── mockAffirmations.ts      # Мок-ответы аффирмаций по настроению
│
└── types/
    └── index.ts                 # TypeScript типы (Session, Mood, SubscriptionPlan)
```

---

## Компоненты и интерфейсы

### SubscriptionStore (Zustand)

```typescript
interface SubscriptionState {
  isSubscribed: boolean;
  activateSubscription: () => void;
  resetSubscription: () => void;
}
```

Хранилище живёт только в памяти (in-memory). При перезапуске приложения `isSubscribed` сбрасывается в `false`.

---

### SessionCard

```typescript
interface SessionCardProps {
  session: Session;
  isSubscribed: boolean;
  onPress: (session: Session) => void;
}
```

Рендерит карточку с обложкой, названием и длительностью. Если `session.isPremium && !isSubscribed` — накладывает `LockOverlay`.

---

### MoodSelector

```typescript
interface MoodSelectorProps {
  selectedMood: MoodKey | null;
  onSelect: (mood: MoodKey) => void;
}
```

Отображает три кнопки-эмодзи. Выбранный эмодзи получает визуальное выделение (кольцо/фон). Только один эмодзи может быть выбран одновременно.

---

### AffirmationWidget

```typescript
interface AffirmationWidgetProps {
  // Самодостаточный компонент, управляет своим состоянием
}
// Внутреннее состояние:
// selectedMood: MoodKey | null
// affirmationText: string | null
// isLoading: boolean
// error: string | null
```

---

### AffirmationService

```typescript
interface AffirmationService {
  generate(mood: MoodKey): Promise<AffirmationResult>;
}

interface AffirmationResult {
  text: string;
  source: 'llm' | 'mock';
}
```

Сервис пробует вызвать LLM API. При ошибке или таймауте (>10 сек) возвращает мок-ответ.

---

### SubscriptionPlanCard

```typescript
interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}
```

---

## Схема навигации

```
App Start
    │
    ▼
MeditationScreen (главный экран)
    │
    ├── [нажатие на заблокированную сессию, нет подписки]
    │       │
    │       ▼
    │   PaywallScreen
    │       │
    │       ├── [нажатие «Попробовать бесплатно»]
    │       │       │
    │       │       ▼
    │       │   activateSubscription() → navigate('Meditation')
    │       │
    │       └── [уже есть подписка при входе] → redirect('Meditation')
    │
    ├── [нажатие «Улучшить» / баннер, нет подписки]
    │       └── → PaywallScreen
    │
    └── [нажатие на разблокированную сессию]
            └── → SessionDetailScreen (id)
```

Используется `Stack.Navigator` из React Navigation. Экран `PaywallScreen` добавляется в стек поверх `MeditationScreen`, что позволяет вернуться назад (если пользователь уже подписан — автоматический редирект).

### Защита маршрутов

В `PaywallScreen` при монтировании проверяется `isSubscribed`. Если `true` — немедленный `navigation.replace('Meditation')`.

---

## Модели данных

### Session

```typescript
interface Session {
  id: string;
  title: string;           // Название на русском языке
  coverImage: string;      // URI или require() для локального изображения
  durationMinutes: number; // Длительность в минутах
  isPremium: boolean;      // true → заблокирована без подписки
  audioUrl?: string;       // Опционально для прототипа
}
```

Пример данных (`data/sessions.ts`):

```typescript
export const SESSIONS: Session[] = [
  { id: '1', title: 'Утреннее спокойствие',    coverImage: '...', durationMinutes: 10, isPremium: false },
  { id: '2', title: 'Снятие стресса',           coverImage: '...', durationMinutes: 15, isPremium: false },
  { id: '3', title: 'Глубокий сон',             coverImage: '...', durationMinutes: 20, isPremium: false },
  { id: '4', title: 'Фокус и концентрация',     coverImage: '...', durationMinutes: 12, isPremium: true  },
  { id: '5', title: 'Осознанное дыхание',       coverImage: '...', durationMinutes: 8,  isPremium: true  },
  { id: '6', title: 'Медитация благодарности',  coverImage: '...', durationMinutes: 18, isPremium: true  },
];
```

---

### SubscriptionPlan

```typescript
interface SubscriptionPlan {
  id: 'monthly' | 'yearly';
  label: string;           // «Ежемесячная» / «Годовая»
  price: string;           // «299 ₽/мес» / «1 990 ₽/год»
  isRecommended: boolean;  // true для годового тарифа
  trialDays: number;       // 7 для обоих тарифов в прототипе
}
```

---

### Mood

```typescript
type MoodKey = 'calm' | 'sad' | 'stressed';

interface Mood {
  key: MoodKey;
  emoji: string;   // '😌' | '😔' | '😤'
  label: string;   // «Спокойствие» | «Грусть» | «Стресс»
}

export const MOODS: Mood[] = [
  { key: 'calm',     emoji: '😌', label: 'Спокойствие' },
  { key: 'sad',      emoji: '😔', label: 'Грусть'      },
  { key: 'stressed', emoji: '😤', label: 'Стресс'      },
];
```

---

### AffirmationResult

```typescript
interface AffirmationResult {
  text: string;           // Текст аффирмации, не более 100 слов
  source: 'llm' | 'mock';
  mood: MoodKey;
}
```

---

## Интеграция с LLM и мок-ответы

### Стратегия интеграции

`AffirmationService` реализует паттерн «попробуй LLM → при ошибке вернись к моку»:

```
generateAffirmation(mood)
    │
    ├── [REACT_APP_OPENAI_KEY задан]
    │       │
    │       ├── POST /v1/chat/completions (timeout: 10s)
    │       │       │
    │       │       ├── [успех] → вернуть { text, source: 'llm' }
    │       │       └── [ошибка / таймаут] → вернуть мок
    │       │
    │       └── [ключ не задан] → вернуть мок
    │
    └── вернуть { text: MOCK_AFFIRMATIONS[mood], source: 'mock' }
```

### Промпт для LLM

```
Ты — тренер по медитации. Напиши короткую аффирмацию или медитативное наставление
на русском языке для человека, который чувствует: {mood_label}.
Текст должен быть тёплым, поддерживающим и не превышать 100 слов.
Отвечай только текстом аффирмации, без вступлений и пояснений.
```

### Мок-ответы (`constants/mockAffirmations.ts`)

```typescript
export const MOCK_AFFIRMATIONS: Record<MoodKey, string> = {
  calm: `Ты уже в нужном месте. Позволь этому моменту быть таким, какой он есть.
Твоё спокойствие — это сила, а не пустота. Дыши глубоко, отпусти всё лишнее
и просто будь здесь, сейчас. Ты заслуживаешь этого покоя.`,

  sad: `Грусть — это не слабость, это честность с собой. Позволь себе почувствовать
то, что чувствуешь, не осуждая. Каждая волна проходит. Ты справлялся раньше,
справишься и сейчас. Ты не один в этом — жизнь продолжается, и ты вместе с ней.`,

  stressed: `Сделай один глубокий вдох прямо сейчас. Стресс говорит тебе, что ты важен
и что тебе не всё равно. Но ты больше, чем список задач. Отпусти напряжение
в плечах, разожми кулаки. Ты справляешься — шаг за шагом, вдох за вдохом.`,
};
```

### Валидация ответа LLM

Перед возвратом текста сервис проверяет:
1. Ответ не пустой
2. Количество слов ≤ 100 (если больше — обрезается до 100 слов с добавлением «…»)
3. Текст на русском языке (эвристика: наличие кириллических символов)

Если любая проверка не проходит — возвращается мок.

---

## Свойства корректности

*Свойство — это характеристика или поведение, которое должно выполняться при всех допустимых выполнениях системы. По сути, это формальное утверждение о том, что система должна делать. Свойства служат мостом между читаемыми человеком спецификациями и машинно-верифицируемыми гарантиями корректности.*

---

### Свойство 1: Заблокированная сессия без подписки ведёт на пейволл

*Для любой* сессии с `isPremium=true` и любого состояния с `isSubscribed=false`, нажатие на карточку этой сессии должно вызывать навигацию на `PaywallScreen`.

**Validates: Requirements 1.1, 2.6**

---

### Свойство 2: Каждый тариф подписки имеет непустую цену

*Для любого* объекта `SubscriptionPlan` в массиве планов, поле `price` должно быть непустой строкой.

**Validates: Requirements 1.5**

---

### Свойство 3: Активация подписки устанавливает активный статус

*Для любого* начального состояния store (включая `isSubscribed=false`), вызов `activateSubscription()` должен привести к тому, что `isSubscribed` станет `true`.

**Validates: Requirements 1.7, 1.8**

---

### Свойство 4: Карточка сессии содержит все обязательные поля

*Для любой* сессии из массива `SESSIONS`, рендер компонента `SessionCard` должен включать непустые значения `title`, `coverImage` и `durationMinutes > 0`.

**Validates: Requirements 2.3**

---

### Свойство 5: Наличие замка соответствует статусу подписки

*Для любой* сессии и любого значения `isSubscribed`, компонент `SessionCard` должен отображать `LockOverlay` тогда и только тогда, когда `session.isPremium === true && isSubscribed === false`.

**Validates: Requirements 2.4, 2.5**

---

### Свойство 6: Разблокированная сессия ведёт на экран деталей

*Для любой* сессии с `isPremium=false` (или при `isSubscribed=true`), нажатие на карточку должно вызывать навигацию на `SessionDetailScreen` с корректным `id` сессии.

**Validates: Requirements 2.7**

---

### Свойство 7: Единственность выбора настроения

*Для любой* последовательности нажатий на эмодзи в `MoodSelector`, в любой момент времени не более одного настроения может быть в состоянии `selected=true`.

**Validates: Requirements 3.3**

---

### Свойство 8: Fallback на мок при ошибке LLM

*Для любого* значения `MoodKey`, если вызов LLM API завершается ошибкой или таймаутом, `AffirmationService.generate(mood)` должен вернуть объект с непустым `text` и `source === 'mock'`.

**Validates: Requirements 3.7**

---

### Свойство 9: Текст аффирмации не превышает 100 слов

*Для любого* значения `MoodKey`, результат `AffirmationService.generate(mood)` должен содержать текст, количество слов в котором не превышает 100.

**Validates: Requirements 3.9**

---

### Свойство 10: Статус подписки сохраняется при навигации

*Для любой* последовательности навигационных операций (переход между экранами), если `isSubscribed` был установлен в `true`, он должен оставаться `true` до перезапуска приложения.

**Validates: Requirements 4.2**

---

### Свойство 11: PaywallScreen с активной подпиской вызывает редирект

*Для любого* состояния с `isSubscribed=true`, монтирование компонента `PaywallScreen` должно немедленно вызывать `navigation.replace('Meditation')` без отображения содержимого пейволла.

**Validates: Requirements 5.3**

---

### Свойство 12: Round-trip генерации аффирмации

*Для любого* значения `MoodKey`, вызов `AffirmationService.generate(mood)` должен завершиться (resolved, не rejected) и вернуть объект с непустым полем `text` и полем `mood`, равным переданному аргументу.

**Validates: Requirements 3.4, 3.5, 3.6**

---

## Обработка ошибок

### AffirmationService

| Ситуация | Поведение |
|----------|-----------|
| LLM API недоступен (сетевая ошибка) | Возврат мок-ответа для выбранного настроения |
| LLM API таймаут (>10 сек) | Возврат мок-ответа |
| LLM вернул пустой текст | Возврат мок-ответа |
| LLM вернул текст >100 слов | Обрезка до 100 слов + «…» |
| LLM вернул текст без кириллицы | Возврат мок-ответа |
| Нажатие «Генерировать» без настроения | Inline-подсказка «Выберите настроение» |

### Навигация

| Ситуация | Поведение |
|----------|-----------|
| Переход на PaywallScreen с активной подпиской | `navigation.replace('Meditation')` |
| Нажатие на заблокированную сессию без подписки | `navigation.navigate('Paywall')` |
| Нажатие на разблокированную сессию | `navigation.navigate('SessionDetail', { id })` |

### Состояние подписки

| Ситуация | Поведение |
|----------|-----------|
| Перезапуск приложения | `isSubscribed` сбрасывается в `false` (in-memory store) |
| Повторный вызов `activateSubscription()` | Идемпотентно — `isSubscribed` остаётся `true` |

---

## Стратегия тестирования

### Двойной подход

Используются два взаимодополняющих типа тестов:
- **Unit-тесты** — конкретные примеры, граничные случаи, интеграционные точки
- **Property-based тесты** — универсальные свойства для всех возможных входных данных

### Библиотеки

| Тип | Библиотека |
|-----|-----------|
| Unit-тесты | Jest + React Native Testing Library |
| Property-based тесты | **fast-check** (TypeScript/JavaScript) |

### Unit-тесты (конкретные примеры)

- PaywallScreen рендерит ≥4 преимущества (Требование 1.2)
- PaywallScreen содержит два тарифа: «Ежемесячная» и «Годовая» (Требование 1.3)
- Годовой тариф имеет `isRecommended=true` (Требование 1.4)
- PaywallScreen содержит кнопку «Попробовать бесплатно» (Требование 1.6)
- SESSIONS содержит ≥6 сессий, из которых ≥3 с `isPremium=true` (Требование 2.2)
- MOODS содержит ровно 3 элемента (Требование 3.2)
- Нажатие «Генерировать» без настроения показывает подсказку (Требование 3.8)
- Начальное состояние store: `isSubscribed=false` (Требование 4.3)
- MeditationScreen при `isSubscribed=false` показывает кнопку «Улучшить» (Требование 5.2)

### Property-based тесты (fast-check, минимум 100 итераций)

Каждый тест помечается комментарием:
`// Feature: zen-pulse-meditation-app, Property N: <текст свойства>`

```typescript
// Property 1: Заблокированная сессия без подписки ведёт на пейволл
fc.assert(fc.property(
  fc.record({ id: fc.string(), isPremium: fc.constant(true), ... }),
  (session) => {
    // render SessionCard с isSubscribed=false, нажать, проверить навигацию
  }
), { numRuns: 100 });

// Property 3: Активация подписки устанавливает isSubscribed=true
fc.assert(fc.property(
  fc.boolean(), // начальное состояние
  (_initial) => {
    const store = createSubscriptionStore();
    store.activateSubscription();
    return store.getState().isSubscribed === true;
  }
), { numRuns: 100 });

// Property 5: Наличие замка ↔ isPremium && !isSubscribed
fc.assert(fc.property(
  fc.boolean(), // isPremium
  fc.boolean(), // isSubscribed
  (isPremium, isSubscribed) => {
    const { queryByTestId } = render(
      <SessionCard session={{ ...mockSession, isPremium }} isSubscribed={isSubscribed} onPress={() => {}} />
    );
    const hasLock = queryByTestId('lock-overlay') !== null;
    return hasLock === (isPremium && !isSubscribed);
  }
), { numRuns: 100 });

// Property 7: Единственность выбора настроения
fc.assert(fc.property(
  fc.array(fc.constantFrom('calm', 'sad', 'stressed'), { minLength: 1, maxLength: 10 }),
  (clicks) => {
    // симулировать последовательность нажатий, проверить что выбран только последний
  }
), { numRuns: 100 });

// Property 8: Fallback на мок при ошибке LLM
fc.assert(fc.property(
  fc.constantFrom('calm', 'sad', 'stressed'),
  async (mood) => {
    mockLLMToFail();
    const result = await affirmationService.generate(mood);
    return result.source === 'mock' && result.text.length > 0;
  }
), { numRuns: 100 });

// Property 9: Текст аффирмации не превышает 100 слов
fc.assert(fc.property(
  fc.constantFrom('calm', 'sad', 'stressed'),
  async (mood) => {
    const result = await affirmationService.generate(mood);
    return result.text.split(/\s+/).filter(Boolean).length <= 100;
  }
), { numRuns: 100 });

// Property 12: Round-trip генерации аффирмации
fc.assert(fc.property(
  fc.constantFrom('calm', 'sad', 'stressed'),
  async (mood) => {
    const result = await affirmationService.generate(mood);
    return result.text.length > 0 && result.mood === mood;
  }
), { numRuns: 100 });
```

### Граничные случаи для unit-тестов

- `generate(mood)` при пустом ответе LLM → мок
- `generate(mood)` при ответе LLM >100 слов → обрезка
- `generate(mood)` при ответе без кириллицы → мок
- Повторный вызов `activateSubscription()` → идемпотентность
