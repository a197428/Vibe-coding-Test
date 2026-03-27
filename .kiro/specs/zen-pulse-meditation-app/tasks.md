# План реализации: ZenPulse Meditation App

## Обзор

Пошаговая реализация прототипа мобильного приложения ZenPulse на React Native (Expo). Каждый экран реализуется отдельным коммитом в ветке `dev`. Стек: Expo SDK 51+, NativeWind, React Navigation v6, Zustand, OpenAI API, Jest + fast-check.

## Задачи

- [x] 1. Инициализация проекта и настройка зависимостей
  - Создать новый Expo-проект: `npx create-expo-app zen-pulse-meditation-app --template blank-typescript`
  - Установить зависимости: `react-navigation/native`, `react-navigation/stack`, `nativewind`, `zustand`, `openai`, `fast-check`, `@testing-library/react-native`
  - Настроить `tailwind.config.js` и `babel.config.js` для NativeWind
  - Создать структуру папок: `app/`, `components/`, `store/`, `services/`, `data/`, `constants/`, `types/`
  - _Требования: 5.1_

- [x] 2. Типы, константы и статические данные
  - [x] 2.1 Создать `types/index.ts` с интерфейсами `Session`, `SubscriptionPlan`, `Mood`, `AffirmationResult`, типом `MoodKey`
    - _Требования: 2.3, 3.2, 1.3, 1.5_
  - [x] 2.2 Создать `constants/moods.ts` с массивом `MOODS` (3 элемента: calm, sad, stressed)
    - _Требования: 3.2_
  - [x] 2.3 Создать `constants/mockAffirmations.ts` с объектом `MOCK_AFFIRMATIONS: Record<MoodKey, string>`
    - _Требования: 3.7_
  - [x] 2.4 Создать `data/sessions.ts` с массивом `SESSIONS` (≥6 сессий, ≥3 с `isPremium=true`)
    - _Требования: 2.2, 2.3_
  - [ ]* 2.5 Написать unit-тесты для статических данных
    - Проверить: `SESSIONS.length >= 6`, `SESSIONS.filter(s => s.isPremium).length >= 3`
    - Проверить: `MOODS.length === 3`
    - _Требования: 2.2, 3.2_

- [x] 3. Глобальное состояние (Zustand)
  - [x] 3.1 Создать `store/subscriptionStore.ts` с интерфейсом `SubscriptionState`
    - Поля: `isSubscribed: boolean` (начальное значение `false`)
    - Методы: `activateSubscription()`, `resetSubscription()`
    - In-memory store (без персистентности)
    - _Требования: 4.1, 4.3_
  - [ ]* 3.2 Написать property-тест для активации подписки
    - **Свойство 3: Активация подписки устанавливает активный статус**
    - **Validates: Requirements 1.7, 1.8**
    - `fc.property(fc.boolean(), (_) => { store.activateSubscription(); return store.getState().isSubscribed === true; })`
    - _Требования: 1.7, 1.8_
  - [ ]* 3.3 Написать unit-тесты для store
    - Начальное состояние: `isSubscribed === false`
    - Идемпотентность: повторный вызов `activateSubscription()` оставляет `isSubscribed === true`
    - `resetSubscription()` устанавливает `isSubscribed === false`
    - _Требования: 4.3_

- [x] 4. Настройка навигации
  - [x] 4.1 Создать `app/_layout.tsx` — корневой layout с `NavigationContainer` и `Stack.Navigator`
    - Зарегистрировать экраны: `Meditation`, `Paywall`, `SessionDetail`
    - Обернуть в провайдер Zustand (если требуется)
    - _Требования: 5.1_
  - [x] 4.2 Создать `app/index.tsx` — точка входа с редиректом на `MeditationScreen`
    - _Требования: 5.1_

- [x] 5. Checkpoint — базовая структура готова
  - Убедиться, что проект запускается без ошибок, навигация инициализирована, store доступен. Задать вопросы пользователю при необходимости.

- [x] 6. Компонент SessionCard
  - [x] 6.1 Создать `components/SessionCard.tsx`
    - Рендерить обложку (`coverImage`), название (`title`), длительность (`durationMinutes` мин)
    - Принимать пропсы: `session: Session`, `isSubscribed: boolean`, `onPress: (session: Session) => void`
    - Если `session.isPremium && !isSubscribed` — рендерить `LockOverlay` поверх карточки
    - Добавить `testID="lock-overlay"` на компонент `LockOverlay`
    - _Требования: 2.3, 2.4, 2.5_
  - [x] 6.2 Создать `components/LockOverlay.tsx`
    - Полупрозрачное затемнение + иконка замка по центру
    - _Требования: 2.4_
  - [ ]* 6.3 Написать property-тест: наличие замка соответствует статусу подписки
    - **Свойство 5: Наличие замка ↔ isPremium && !isSubscribed**
    - **Validates: Requirements 2.4, 2.5**
    - `fc.property(fc.boolean(), fc.boolean(), (isPremium, isSubscribed) => { ... hasLock === (isPremium && !isSubscribed) })`
    - _Требования: 2.4, 2.5_
  - [ ]* 6.4 Написать property-тест: карточка содержит все обязательные поля
    - **Свойство 4: Карточка сессии содержит все обязательные поля**
    - **Validates: Requirements 2.3**
    - `fc.property(fc.record({ id: fc.uuid(), title: fc.string({minLength:1}), durationMinutes: fc.integer({min:1}), isPremium: fc.boolean(), coverImage: fc.string({minLength:1}) }), (session) => { ... title, coverImage, durationMinutes присутствуют })`
    - _Требования: 2.3_

- [x] 7. Компонент MoodSelector
  - [x] 7.1 Создать `components/MoodSelector.tsx`
    - Отображать три кнопки-эмодзи из `MOODS` с подписями на русском языке
    - Принимать пропсы: `selectedMood: MoodKey | null`, `onSelect: (mood: MoodKey) => void`
    - Выбранный эмодзи получает визуальное выделение (кольцо/фон через NativeWind)
    - _Требования: 3.2, 3.3_
  - [ ]* 7.2 Написать property-тест: единственность выбора настроения
    - **Свойство 7: Единственность выбора настроения**
    - **Validates: Requirements 3.3**
    - `fc.property(fc.array(fc.constantFrom('calm','sad','stressed'), {minLength:1, maxLength:10}), (clicks) => { /* симулировать нажатия, проверить что выбран только последний */ })`
    - _Требования: 3.3_

- [x] 8. AffirmationService
  - [x] 8.1 Создать `services/affirmationService.ts`
    - Реализовать метод `generate(mood: MoodKey): Promise<AffirmationResult>`
    - Если `OPENAI_API_KEY` задан — вызвать OpenAI API с промптом на русском языке (timeout 10s)
    - При ошибке / таймауте / пустом ответе / отсутствии кириллицы — вернуть `MOCK_AFFIRMATIONS[mood]`
    - Если ответ LLM >100 слов — обрезать до 100 слов и добавить «…»
    - Возвращать `{ text, source: 'llm' | 'mock', mood }`
    - _Требования: 3.4, 3.7, 3.9_
  - [ ]* 8.2 Написать property-тест: fallback на мок при ошибке LLM
    - **Свойство 8: Fallback на мок при ошибке LLM**
    - **Validates: Requirements 3.7**
    - `fc.property(fc.constantFrom('calm','sad','stressed'), async (mood) => { mockLLMToFail(); const r = await service.generate(mood); return r.source === 'mock' && r.text.length > 0; })`
    - _Требования: 3.7_
  - [ ]* 8.3 Написать property-тест: текст аффирмации не превышает 100 слов
    - **Свойство 9: Текст аффирмации не превышает 100 слов**
    - **Validates: Requirements 3.9**
    - `fc.property(fc.constantFrom('calm','sad','stressed'), async (mood) => { const r = await service.generate(mood); return r.text.split(/\s+/).filter(Boolean).length <= 100; })`
    - _Требования: 3.9_
  - [ ]* 8.4 Написать property-тест: round-trip генерации аффирмации
    - **Свойство 12: Round-trip генерации аффирмации**
    - **Validates: Requirements 3.4, 3.5, 3.6**
    - `fc.property(fc.constantFrom('calm','sad','stressed'), async (mood) => { const r = await service.generate(mood); return r.text.length > 0 && r.mood === mood; })`
    - _Требования: 3.4, 3.5, 3.6_
  - [ ]* 8.5 Написать unit-тесты для граничных случаев AffirmationService
    - Пустой ответ LLM → мок
    - Ответ LLM >100 слов → обрезка до 100 слов + «…»
    - Ответ без кириллицы → мок
    - _Требования: 3.7, 3.9_

- [x] 9. Компонент AffirmationWidget
  - [x] 9.1 Создать `components/AffirmationWidget.tsx`
    - Самодостаточный компонент с внутренним состоянием: `selectedMood`, `affirmationText`, `isLoading`, `error`
    - Включать `MoodSelector` и кнопку «Получить аффирмацию»
    - При нажатии без выбранного настроения — показывать inline-подсказку «Выберите настроение»
    - При нажатии с настроением — вызывать `affirmationService.generate(mood)`, показывать индикатор загрузки
    - После получения ответа — отображать текст аффирмации
    - _Требования: 3.1, 3.3, 3.4, 3.5, 3.6, 3.8_
  - [ ]* 9.2 Написать unit-тест: нажатие «Генерировать» без настроения показывает подсказку
    - _Требования: 3.8_

- [x] 10. Checkpoint — сервисный слой и компоненты готовы
  - Убедиться, что все компоненты рендерятся без ошибок, AffirmationService возвращает корректные данные. Задать вопросы пользователю при необходимости.

- [x] 11. Экран подписки (PaywallScreen)
  - [x] 11.1 Создать `app/paywall.tsx` — `PaywallScreen`
    - При монтировании: если `isSubscribed === true` → `navigation.replace('Meditation')`
    - Отображать ≥4 премиум-преимущества с текстом на русском языке
    - Создать `components/SubscriptionPlanCard.tsx` с пропсами `plan`, `isSelected`, `isRecommended`, `onSelect`
    - Отображать два тарифа: «Ежемесячная» (299 ₽/мес) и «Годовая» (1 990 ₽/год)
    - Визуально выделить «Годовую» как рекомендуемый тариф (значок/подсветка)
    - Кнопка «Попробовать бесплатно» → вызвать `activateSubscription()` → `navigation.replace('Meditation')`
    - Премиальный визуальный дизайн через NativeWind
    - _Требования: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_
  - [ ]* 11.2 Написать property-тест: PaywallScreen с активной подпиской вызывает редирект
    - **Свойство 11: PaywallScreen с активной подпиской вызывает редирект**
    - **Validates: Requirements 5.3**
    - `fc.property(fc.constant(true), (isSubscribed) => { /* монтировать PaywallScreen с isSubscribed=true, проверить вызов navigation.replace('Meditation') */ })`
    - _Требования: 5.3_
  - [ ]* 11.3 Написать property-тест: каждый тариф имеет непустую цену
    - **Свойство 2: Каждый тариф подписки имеет непустую цену**
    - **Validates: Requirements 1.5**
    - `fc.property(fc.constantFrom(...SUBSCRIPTION_PLANS), (plan) => plan.price.length > 0)`
    - _Требования: 1.5_
  - [ ]* 11.4 Написать unit-тесты для PaywallScreen
    - Рендерит ≥4 преимущества
    - Содержит тарифы «Ежемесячная» и «Годовая»
    - Годовой тариф имеет `isRecommended=true`
    - Содержит кнопку «Попробовать бесплатно»
    - _Требования: 1.2, 1.3, 1.4, 1.6_

- [x] 12. Экран медитаций (MeditationScreen)
  - [x] 12.1 Создать `app/meditation.tsx` — `MeditationScreen`
    - Отображать прокручиваемый список `SessionCard` из `SESSIONS`
    - Передавать `isSubscribed` из Zustand store в каждую `SessionCard`
    - При нажатии на заблокированную сессию (без подписки) → `navigation.navigate('Paywall')`
    - При нажатии на разблокированную сессию → `navigation.navigate('SessionDetail', { id })`
    - Если `isSubscribed === false` — показывать кнопку «Улучшить» / баннер для перехода на пейволл
    - Включать секцию «Аффирмация дня (ИИ)» с компонентом `AffirmationWidget`
    - _Требования: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 3.1, 5.2_
  - [ ]* 12.2 Написать property-тест: заблокированная сессия без подписки ведёт на пейволл
    - **Свойство 1: Заблокированная сессия без подписки ведёт на пейволл**
    - **Validates: Requirements 1.1, 2.6**
    - `fc.property(fc.record({ id: fc.uuid(), isPremium: fc.constant(true), ... }), (session) => { /* render SessionCard с isSubscribed=false, нажать, проверить navigation.navigate('Paywall') */ })`
    - _Требования: 1.1, 2.6_
  - [ ]* 12.3 Написать property-тест: разблокированная сессия ведёт на экран деталей
    - **Свойство 6: Разблокированная сессия ведёт на экран деталей**
    - **Validates: Requirements 2.7**
    - `fc.property(fc.record({ id: fc.uuid(), isPremium: fc.constant(false), ... }), (session) => { /* нажать, проверить navigation.navigate('SessionDetail', { id: session.id }) */ })`
    - _Требования: 2.7_
  - [ ]* 12.4 Написать property-тест: статус подписки сохраняется при навигации
    - **Свойство 10: Статус подписки сохраняется при навигации**
    - **Validates: Requirements 4.2**
    - `fc.property(fc.array(fc.constantFrom('Meditation','Paywall','SessionDetail'), {minLength:1, maxLength:5}), (screens) => { /* активировать подписку, симулировать навигацию, проверить isSubscribed === true */ })`
    - _Требования: 4.2_
  - [ ]* 12.5 Написать unit-тест: MeditationScreen при `isSubscribed=false` показывает кнопку «Улучшить»
    - _Требования: 5.2_

- [ ] 13. Экран деталей сессии (SessionDetailScreen)
  - [ ] 13.1 Создать `app/session/[id].tsx` — `SessionDetailScreen` (заглушка)
    - Получать `id` из параметров навигации
    - Отображать название сессии и кнопку «Назад»
    - _Требования: 2.7_

- [ ] 14. Финальный checkpoint — все экраны и тесты готовы
  - Убедиться, что все тесты проходят, навигация работает корректно, все экраны рендерятся без ошибок. Задать вопросы пользователю при необходимости.

## Примечания

- Задачи, помеченные `*`, являются опциональными и могут быть пропущены для ускорения MVP
- Каждый экран (задачи 11, 12, 13) — отдельный коммит в ветке `dev`
- Property-тесты запускаются с `numRuns: 100` и помечаются комментарием `// Feature: zen-pulse-meditation-app, Property N: <текст>`
- `AffirmationService` использует переменную окружения `OPENAI_API_KEY`; при её отсутствии автоматически используются мок-ответы
- Все тексты UI на русском языке
