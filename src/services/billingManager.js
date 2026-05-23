/**
 * Billing Manager: Handles subscription status, usage limits, and freemium gates
 * Uses localStorage for subscription state (validated via Stripe)
 */

const FREE_TIER_LIMITS = {
  maxAudioLength: 300, // 5 minutes in seconds
  maxImageResolution: 1024,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilesPerDay: 3,
  watermarkImages: true,
  batchProcessing: false,
  premiumModels: false,
  exportFormats: ['txt', 'pdf'],
  dailyTranscriptions: 5
};

const PRO_TIER_BENEFITS = {
  maxAudioLength: Infinity,
  maxImageResolution: 4096,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxFilesPerDay: Infinity,
  watermarkImages: false,
  batchProcessing: true,
  premiumModels: true,
  exportFormats: ['txt', 'pdf', 'json', 'srt', 'vtt', 'docx'],
  dailyTranscriptions: Infinity
};

class BillingManager {
  constructor() {
    this.subscriptionKey = 'verynt-subscription';
    this.usageKey = 'verynt-usage';
    this.licenseKey = 'verynt-license';
  }

  /**
   * Get current subscription status
   */
  getSubscription() {
    const sub = localStorage.getItem(this.subscriptionKey);
    if (!sub) {
      return { tier: 'free', status: 'active', expiresAt: null };
    }

    const parsed = JSON.parse(sub);
    // Check if subscription expired
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      return { tier: 'free', status: 'expired' };
    }

    return parsed;
  }

  /**
   * Check if user is Pro
   */
  isPro() {
    return this.getSubscription().tier === 'pro';
  }

  /**
   * Get applicable limits for current user
   */
  getLimits() {
    return this.isPro() ? PRO_TIER_BENEFITS : FREE_TIER_LIMITS;
  }

  /**
   * Get daily usage count
   */
  getDailyUsage(action) {
    const usage = JSON.parse(localStorage.getItem(this.usageKey) || '{}');
    const today = new Date().toISOString().split('T')[0];
    const key = `${action}-${today}`;
    return usage[key] || 0;
  }

  /**
   * Increment usage counter
   */
  recordUsage(action) {
    const usage = JSON.parse(localStorage.getItem(this.usageKey) || '{}');
    const today = new Date().toISOString().split('T')[0];
    const key = `${action}-${today}`;
    usage[key] = (usage[key] || 0) + 1;

    localStorage.setItem(this.usageKey, JSON.stringify(usage));

    return {
      count: usage[key],
      limit: this.getLimits()[`max${action.charAt(0).toUpperCase() + action.slice(1)}`] || Infinity
    };
  }

  /**
   * Check if action is allowed
   */
  canPerformAction(action, metadata = {}) {
    const limits = this.getLimits();
    const dailyUsage = this.getDailyUsage(action);

    // Map action to limit
    const limitMap = {
      transcribe: { limit: limits.dailyTranscriptions, usage: dailyUsage },
      uploadImage: {
        limit: limits.maxFilesPerDay,
        usage: dailyUsage,
        sizeLimit: limits.maxFileSize,
        actualSize: metadata.size || 0
      },
      uploadPDF: {
        limit: limits.maxFilesPerDay,
        usage: dailyUsage
      }
    };

    const check = limitMap[action];
    if (!check) return { allowed: true };

    // Check daily limit
    if (dailyUsage >= check.limit) {
      return {
        allowed: false,
        reason: 'daily_limit_reached',
        limit: check.limit,
        current: dailyUsage
      };
    }

    // Check file size
    if (check.sizeLimit && metadata.size > check.sizeLimit) {
      return {
        allowed: false,
        reason: 'file_too_large',
        limit: check.sizeLimit,
        actual: metadata.size
      };
    }

    // Check audio length
    if (action === 'transcribe' && !this.isPro() && metadata.duration > limits.maxAudioLength) {
      return {
        allowed: false,
        reason: 'audio_too_long',
        limit: limits.maxAudioLength,
        actual: metadata.duration
      };
    }

    // Check image resolution
    if (action === 'uploadImage' && !this.isPro()) {
      if (metadata.width > limits.maxImageResolution || metadata.height > limits.maxImageResolution) {
        return {
          allowed: false,
          reason: 'resolution_too_high',
          limit: limits.maxImageResolution,
          actual: Math.max(metadata.width, metadata.height)
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Get upgrade reason for UI modal
   */
  getUpgradeMessage(action) {
    const messages = {
      daily_limit_reached: 'You\'ve reached your daily processing limit. Upgrade to Pro for unlimited usage.',
      file_too_large: 'File exceeds free tier limit. Pro users can upload up to 100MB files.',
      audio_too_long: 'Audio file exceeds 5-minute free limit. Pro users can process unlimited audio.',
      resolution_too_high: 'Image resolution exceeds 1024px free limit. Pro users get 4096px resolution.',
      watermark_removal: 'Remove watermarks by upgrading to Pro.',
      batch_processing: 'Batch processing is a Pro feature.',
      premium_models: 'Premium AI models are for Pro users.'
    };

    return messages[action] || 'Upgrade to Pro to unlock this feature.';
  }

  /**
   * Validate and set subscription (from Stripe)
   */
  setSubscription(subscription) {
    if (!subscription.tier || !['free', 'pro'].includes(subscription.tier)) {
      throw new Error('Invalid subscription tier');
    }

    const validSub = {
      tier: subscription.tier,
      status: subscription.status || 'active',
      expiresAt: subscription.expiresAt,
      stripeCustomerId: subscription.stripeCustomerId,
      priceId: subscription.priceId,
      customerId: subscription.customerId,
      setAt: new Date().toISOString()
    };

    localStorage.setItem(this.subscriptionKey, JSON.stringify(validSub));
    return validSub;
  }

  /**
   * Generate trial subscription (30 days)
   */
  startTrial() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return this.setSubscription({
      tier: 'pro',
      status: 'trial',
      expiresAt: expiresAt.toISOString()
    });
  }

  /**
   * Check if currently in trial
   */
  isTrialActive() {
    const sub = this.getSubscription();
    return sub.status === 'trial' && sub.expiresAt > new Date().toISOString();
  }

  /**
   * Get trial remaining days
   */
  getTrialRemainingDays() {
    if (!this.isTrialActive()) return 0;

    const sub = this.getSubscription();
    const expiresAt = new Date(sub.expiresAt);
    const now = new Date();
    const days = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

    return Math.max(0, days);
  }

  /**
   * Reset daily usage (for admin/testing)
   */
  resetUsage() {
    localStorage.removeItem(this.usageKey);
  }

  /**
   * Export usage statistics
   */
  getUsageStats(days = 30) {
    const usage = JSON.parse(localStorage.getItem(this.usageKey) || '{}');
    const stats = {};

    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayStats = {};
      for (const [key, count] of Object.entries(usage)) {
        if (key.endsWith(dateStr)) {
          const action = key.split('-')[0];
          dayStats[action] = count;
        }
      }

      if (Object.keys(dayStats).length > 0) {
        stats[dateStr] = dayStats;
      }
    }

    return stats;
  }
}

export default new BillingManager();
