/**
 * Analytics Manager: Local telemetry without sending data to external servers
 * Tracks usage patterns, time saved, and cost savings
 */

class AnalyticsManager {
  constructor() {
    this.analyticsKey = 'verynt-analytics';
    this.sessionKey = 'verynt-session';
  }

  /**
   * Initialize session
   */
  initSession() {
    const session = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startedAt: new Date().toISOString(),
      events: [],
      endedAt: null
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    return session;
  }

  /**
   * Get current session
   */
  getSession() {
    const stored = sessionStorage.getItem(this.sessionKey);
    if (!stored) return this.initSession();
    return JSON.parse(stored);
  }

  /**
   * Log an event
   */
  logEvent(eventName, data = {}) {
    const session = this.getSession();
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data
    };

    session.events.push(event);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));

    // Also persist to localStorage for long-term analytics
    this._persistEvent(event);
  }

  /**
   * Internal: Persist event to localStorage
   */
  _persistEvent(event) {
    const analytics = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    const today = new Date().toISOString().split('T')[0];

    if (!analytics[today]) {
      analytics[today] = [];
    }

    analytics[today].push(event);

    // Keep only last 90 days
    const keys = Object.keys(analytics).sort().reverse();
    if (keys.length > 90) {
      const oldKeys = keys.slice(90);
      oldKeys.forEach((key) => delete analytics[key]);
    }

    localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
  }

  /**
   * Log tool usage
   */
  logToolUsage(toolName, metadata = {}) {
    this.logEvent('tool_used', {
      tool: toolName,
      ...metadata,
      timestamp: Date.now()
    });
  }

  /**
   * Log document processed
   */
  logDocumentProcessed(type, size, processingTime) {
    this.logEvent('document_processed', {
      type, // 'pdf', 'image', 'audio', 'text'
      size,
      processingTime,
      timestamp: Date.now()
    });
  }

  /**
   * Log transcription
   */
  logTranscription(duration, wordCount, processingTime) {
    this.logEvent('transcription_completed', {
      duration,
      wordCount,
      processingTime,
      timestamp: Date.now()
    });

    return this._calculateCostSavings('transcription', duration);
  }

  /**
   * Log model download
   */
  logModelDownload(modelName, size) {
    this.logEvent('model_downloaded', {
      model: modelName,
      size,
      timestamp: Date.now()
    });
  }

  /**
   * Calculate cost savings vs cloud APIs
   */
  _calculateCostSavings(action, metadata) {
    const costMap = {
      transcription: (duration) => (duration / 60) * 0.006, // $0.006 per minute (roughly OpenAI pricing)
      image_processing: (count) => count * 0.01, // $0.01 per image
      pdf_processing: (count) => count * 0.001, // Negligible but nonzero
      translation: (chars) => (chars / 1000) * 0.015 // $15 per 1M characters
    };

    const calculator = costMap[action];
    if (!calculator) return 0;

    return calculator(metadata);
  }

  /**
   * Get daily stats
   */
  getDailyStats(date = null) {
    const targetDate = date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const analytics = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    const events = analytics[targetDate] || [];

    return {
      date: targetDate,
      totalEvents: events.length,
      toolsUsed: new Set(events.map((e) => e.data?.tool)).size,
      documentsProcessed: events.filter((e) => e.name === 'document_processed').length,
      transcriptionsCompleted: events.filter((e) => e.name === 'transcription_completed').length,
      modelsDownloaded: events.filter((e) => e.name === 'model_downloaded').length,
      totalProcessingTime: events.reduce((sum, e) => sum + (e.data?.processingTime || 0), 0)
    };
  }

  /**
   * Get weekly stats
   */
  getWeeklyStats() {
    const analytics = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    const dates = Object.keys(analytics).sort().reverse().slice(0, 7);

    let totalEvents = 0;
    let totalTools = new Set();
    let totalDocuments = 0;
    let totalTranscriptions = 0;

    dates.forEach((date) => {
      const events = analytics[date] || [];
      totalEvents += events.length;
      events.forEach((e) => {
        if (e.data?.tool) totalTools.add(e.data.tool);
        if (e.name === 'document_processed') totalDocuments++;
        if (e.name === 'transcription_completed') totalTranscriptions++;
      });
    });

    return {
      period: `${dates[dates.length - 1]} to ${dates[0]}`,
      days: dates.length,
      totalEvents,
      uniqueTools: totalTools.size,
      documentsProcessed: totalDocuments,
      transcriptionsCompleted: totalTranscriptions
    };
  }

  /**
   * Calculate time saved (estimate)
   */
  calculateTimeSaved() {
    const analytics = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    let timeSavedMinutes = 0;

    // Rough estimates of time saved vs manual work
    const timeSavings = {
      transcription_completed: (e) => (e.data?.wordCount || 0) / 120, // ~120 wpm to type
      document_processed: (e) => {
        if (e.data?.type === 'pdf') return 5; // 5 min per PDF analysis
        return 2;
      },
      tool_used: () => 1 // 1 min average
    };

    Object.values(analytics).forEach((dayEvents) => {
      dayEvents.forEach((event) => {
        const calculator = timeSavings[event.name];
        if (calculator) {
          timeSavedMinutes += calculator(event);
        }
      });
    });

    return {
      minutes: Math.round(timeSavedMinutes),
      hours: Math.round(timeSavedMinutes / 60),
      days: Math.round(timeSavedMinutes / 60 / 8)
    };
  }

  /**
   * Calculate money saved vs cloud APIs
   */
  calculateMoneySaved() {
    const analytics = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    let totalSavings = 0;

    Object.values(analytics).forEach((dayEvents) => {
      dayEvents.forEach((event) => {
        if (event.name === 'transcription_completed') {
          const duration = event.data?.duration || 0;
          totalSavings += this._calculateCostSavings('transcription', duration);
        }
        if (event.name === 'document_processed') {
          totalSavings += this._calculateCostSavings('pdf_processing', 1);
        }
      });
    });

    return {
      usd: totalSavings.toFixed(2),
      formattedUSD: `$${totalSavings.toFixed(2)}`
    };
  }

  /**
   * Get impact dashboard data
   */
  getImpactDashboard() {
    return {
      timeSaved: this.calculateTimeSaved(),
      moneySaved: this.calculateMoneySaved(),
      weeklyStats: this.getWeeklyStats(),
      dailyStats: this.getDailyStats()
    };
  }

  /**
   * Export analytics
   */
  exportAnalytics() {
    const analytics = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    return {
      exportedAt: new Date().toISOString(),
      data: analytics,
      summary: {
        totalDays: Object.keys(analytics).length,
        totalEvents: Object.values(analytics).flat().length,
        impact: this.getImpactDashboard()
      }
    };
  }

  /**
   * Clear old analytics (keep only recent data)
   */
  cleanup() {
    const analytics = JSON.parse(localStorage.getItem(this.analyticsKey) || '{}');
    const keys = Object.keys(analytics).sort().reverse();

    if (keys.length > 90) {
      const oldKeys = keys.slice(90);
      oldKeys.forEach((key) => delete analytics[key]);
      localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
    }
  }
}

export default new AnalyticsManager();
