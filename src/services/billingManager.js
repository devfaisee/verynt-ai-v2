/**
 * Billing Manager: Handles usage tracking, limits, and Pro status
 * Follows the "Hook-and-Limit" model from the master blueprint
 */

const FREE_LIMITS = {
  maxAudioLength: 300, // 5 minutes in seconds
  maxImageResolution: 1024,
  maxFilesPerDay: 3,
  watermarkImages: true,
  batchProcessing: false,
  exportFormats: ['txt'],
  models: ['tiny']
};

const PRO_LIMITS = {
  maxAudioLength: Infinity,
  maxImageResolution: 4096,
  maxFilesPerDay: Infinity,
  watermarkImages: false,
  batchProcessing: true,
  exportFormats: ['txt', 'pdf', 'json', 'srt', 'vtt', 'docx', 'csv'],
  models: ['tiny', 'base', 'large']
};

class BillingManager {
  constructor() {
    this.usageKey = 'verynt-usage-v1';
    this.proKey = 'verynt-pro-status';
  }

  /**
   * Check if the user is currently on the Pro tier
   */
  isPro() {
    return localStorage.getItem(this.proKey) === 'true';
  }

  /**
   * Get limits based on current subscription tier
   */
  getLimits() {
    return this.isPro() ? PRO_LIMITS : FREE_LIMITS;
  }

  /**
   * Check if a specific action can be performed
   */
  canPerformAction(action, metadata = {}) {
    if (this.isPro()) return { allowed: true };

    const limits = this.getLimits();
    const usage = this._getTodayUsage();

    // 1. Global file limit
    if (usage.total >= limits.maxFilesPerDay) {
      return { allowed: false, reason: 'daily_limit' };
    }

    // 2. Tool specific limits
    if (action === 'transcribe' && metadata.duration > limits.maxAudioLength) {
      return { allowed: false, reason: 'audio_length' };
    }

    if (action === 'upscale' && metadata.resolution > limits.maxImageResolution) {
      return { allowed: false, reason: 'image_res' };
    }

    return { allowed: true };
  }

  /**
   * Record a tool execution
   */
  recordUsage(toolId) {
    const usage = this._getTodayUsage();
    usage.total = (usage.total || 0) + 1;
    usage[toolId] = (usage[toolId] || 0) + 1;
    
    const allUsage = JSON.parse(localStorage.getItem(this.usageKey) || '{}');
    const today = this._getTodayStr();
    allUsage[today] = usage;
    
    localStorage.setItem(this.usageKey, JSON.stringify(allUsage));
    return usage;
  }

  /**
   * Get upgrade message for a specific reason
   */
  getUpgradeMessage(reason) {
    const messages = {
      daily_limit: "You've reached your free daily limit of 3 files. Upgrade to Verynt Pro for unlimited usage.",
      audio_length: "Free tier supports up to 5 minutes of audio. Verynt Pro supports files up to 2 hours.",
      image_res: "High-resolution upscaling is a Pro feature. Free tier is limited to 1024px.",
      batch: "Batch processing is only available in Verynt Pro.",
      model: "Premium models (Base/Large) require a Pro subscription for better accuracy."
    };
    return messages[reason] || "This feature requires a Verynt Pro subscription.";
  }

  /**
   * Internal: Get usage for today
   */
  _getTodayUsage() {
    const allUsage = JSON.parse(localStorage.getItem(this.usageKey) || '{}');
    const today = this._getTodayStr();
    return allUsage[today] || { total: 0 };
  }

  /**
   * Internal: Get date string for today
   */
  _getTodayStr() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * For Demo: Toggle Pro status
   */
  togglePro() {
    const newStatus = !this.isPro();
    localStorage.setItem(this.proKey, newStatus.toString());
    return newStatus;
  }
}

export default new BillingManager();
