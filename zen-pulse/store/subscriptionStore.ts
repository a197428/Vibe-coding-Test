import { create } from 'zustand';

interface SubscriptionState {
  isSubscribed: boolean;
  activateSubscription: () => void;
  resetSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isSubscribed: false,
  activateSubscription: () => set({ isSubscribed: true }),
  resetSubscription: () => set({ isSubscribed: false }),
}));
