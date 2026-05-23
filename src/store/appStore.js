/**
 * App Store: Global state management with Zustand
 * Manages app-wide state like subscription, projects, pricing modal, etc.
 */

import { create } from 'zustand';
import billingManager from '../services/billingManager';

export const useAppStore = create((set, get) => ({
  // Subscription state
  subscription: billingManager.getSubscription(),
  isPro: false,

  // UI state
  isPricingModalOpen: false,
  isSettingsOpen: false,
  currentProject: null,
  projects: [],

  // Usage state
  dailyUsageCount: 0,
  totalUsageCount: 0,

  // Analytics state
  impactStats: null,

  // Sidebar/nav state
  isSidebarOpen: true,
  activeTab: 'dashboard',

  // Actions
  setSubscription: (subscription) => {
    const validated = billingManager.setSubscription(subscription);
    set({
      subscription: validated,
      isPro: validated.tier === 'pro'
    });
  },

  startTrial: () => {
    const trialSub = billingManager.startTrial();
    set({
      subscription: trialSub,
      isPro: true
    });
  },

  updateSubscriptionFromStripe: (stripeData) => {
    const subscription = {
      tier: stripeData.status === 'active' ? 'pro' : 'free',
      status: stripeData.status,
      expiresAt: stripeData.current_period_end
        ? new Date(stripeData.current_period_end * 1000).toISOString()
        : null,
      stripeCustomerId: stripeData.customer,
      priceId: stripeData.items?.data[0]?.price?.id
    };

    get().setSubscription(subscription);
  },

  setPricingModalOpen: (isOpen) => set({ isPricingModalOpen: isOpen }),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setProjects: (projects) => set({ projects }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Usage tracking
  incrementUsageCount: (action = 'general') => {
    set((state) => ({
      dailyUsageCount: state.dailyUsageCount + 1,
      totalUsageCount: state.totalUsageCount + 1
    }));

    // Check if free tier limit reached
    const limits = billingManager.getLimits();
    if (!get().isPro && get().dailyUsageCount >= 4) {
      get().setPricingModalOpen(true);
    }
  },

  resetDailyUsage: () => {
    set({ dailyUsageCount: 0 });
  },

  // Analytics
  setImpactStats: (stats) => set({ impactStats: stats }),

  // Initialize store from localStorage
  hydrate: () => {
    const subscription = billingManager.getSubscription();
    set({
      subscription,
      isPro: subscription.tier === 'pro'
    });
  }
}));

// Initialize on module load
useAppStore.getState().hydrate();
