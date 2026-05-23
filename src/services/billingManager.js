/**
 * Ads Manager: No billing - all features unlimited, ads-based revenue
 * Simple usage tracking for showing targeted ads
 */

const UNLIMITED_LIMITS = {
  maxAudioLength: Infinity,
  maxImageResolution: 4096,
  maxFileSize: 500 * 1024 * 1024, // 500MB
  maxFilesPerDay: Infinity,
  watermarkImages: false,
  batchProcessing: true,
  exportFormats: ['txt', 'pdf', 'json', 'srt', 'vtt', 'docx', 'csv', 'xml'],
  dailyTranscriptions: Infinity
};

class AdsManager {
  constructor() {
    this.usageKey = 'verynt-usage';
    this.adsKey = 'verynt-ads';
  }

  /**
   * All users get unlimited access - ads-based revenue
   */
  getLimits() {
    return UNLIMITED_LIMITS;
  }

  /**
   * Get ad impression count for targeting
   */
  getAdImpressions() {
    const ads = JSON.parse(localStorage.getItem(this.adsKey) || '{}');
    return ads.impressions || 0;
  }

  /**
   * Log ad impression
   */
  recordAdImpression(adType) {
    const ads = JSON.parse(localStorage.getItem(this.adsKey) || '{}');
    ads.impressions = (ads.impressions || 0) + 1;
    ads.lastAdType = adType;
    ads.lastImpressionTime = Date.now();
    localStorage.setItem(this.adsKey, JSON.stringify(ads));
  }

  /**
   * ALL ACTIONS ALLOWED - No limits, ads-based revenue
   */
  canPerformAction(action, metadata = {}) {
    // Record usage for ad targeting
    this.recordUsage(action);
    return { allowed: true };
  }

  /**
   * Record usage for ad targeting
   */
  recordUsage(action) {
    const usage = JSON.parse(localStorage.getItem(this.usageKey) || '{}');
    const today = new Date().toISOString().split('T')[0];
    const key = `${action}-${today}`;
    usage[key] = (usage[key] || 0) + 1;
    localStorage.setItem(this.usageKey, JSON.stringify(usage));
  }

  /**
   * Get usage stats for ad targeting (showing relevant ads)
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
