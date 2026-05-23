/**
 * Storage Manager: IndexedDB abstraction for local persistence
 * Stores projects, transcripts, chat history, and user preferences
 */

const DB_NAME = 'verynt-workspace';
const DB_VERSION = 1;

const OBJECT_STORES = {
  projects: { keyPath: 'id' },
  transcripts: { keyPath: 'id' },
  chats: { keyPath: 'id' },
  usage: { keyPath: 'id' },
  preferences: { keyPath: 'key' },
  backups: { keyPath: 'id' }
};

class StorageManager {
  constructor() {
    this.db = null;
    this.ready = this.initDB();
  }

  /**
   * Initialize IndexedDB
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        for (const [storeName, config] of Object.entries(OBJECT_STORES)) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, config);
          }
        }
      };
    });
  }

  /**
   * Generic SET operation
   */
  async set(storeName, data) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic GET operation
   */
  async get(storeName, key) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all records from a store
   */
  async getAll(storeName) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a record
   */
  async delete(storeName, key) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear entire store
   */
  async clear(storeName) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a project
   */
  async saveProject(project) {
    return this.set('projects', {
      id: project.id || Date.now().toString(),
      name: project.name,
      description: project.description,
      files: project.files || [],
      createdAt: project.createdAt || Date.now(),
      updatedAt: Date.now(),
      metadata: project.metadata || {}
    });
  }

  /**
   * Get all projects
   */
  async getProjects() {
    return this.getAll('projects');
  }

  /**
   * Save transcript
   */
  async saveTranscript(transcript) {
    return this.set('transcripts', {
      id: transcript.id || Date.now().toString(),
      title: transcript.title,
      content: transcript.content,
      format: transcript.format || 'text',
      createdAt: transcript.createdAt || Date.now(),
      source: transcript.source
    });
  }

  /**
   * Get transcripts
   */
  async getTranscripts() {
    return this.getAll('transcripts');
  }

  /**
   * Save chat message
   */
  async saveChatMessage(projectId, message) {
    const id = `${projectId}-${Date.now()}`;
    return this.set('chats', {
      id,
      projectId,
      role: message.role, // 'user' or 'assistant'
      content: message.content,
      timestamp: Date.now()
    });
  }

  /**
   * Get chat history for project
   */
  async getChatHistory(projectId) {
    const allChats = await this.getAll('chats');
    return allChats
      .filter((chat) => chat.projectId === projectId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Log usage (transcriptions, uploads, etc.)
   */
  async logUsage(action, details) {
    return this.set('usage', {
      id: Date.now().toString(),
      action,
      details,
      timestamp: Date.now()
    });
  }

  /**
   * Get usage analytics
   */
  async getUsageStats(days = 30) {
    const allUsage = await this.getAll('usage');
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return allUsage.filter((u) => u.timestamp >= cutoff);
  }

  /**
   * Save preference
   */
  async setPreference(key, value) {
    return this.set('preferences', { key, value, timestamp: Date.now() });
  }

  /**
   * Get preference
   */
  async getPreference(key) {
    const pref = await this.get('preferences', key);
    return pref?.value;
  }

  /**
   * Export workspace as encrypted backup
   */
  async exportBackup() {
    const projects = await this.getAll('projects');
    const transcripts = await this.getAll('transcripts');
    const chats = await this.getAll('chats');
    const usage = await this.getAll('usage');

    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        projects,
        transcripts,
        chats,
        usage
      }
    };

    return JSON.stringify(backup);
  }

  /**
   * Import backup
   */
  async importBackup(backupJson) {
    try {
      const backup = JSON.parse(backupJson);

      if (backup.data.projects) {
        for (const project of backup.data.projects) {
          await this.saveProject(project);
        }
      }

      if (backup.data.transcripts) {
        for (const transcript of backup.data.transcripts) {
          await this.set('transcripts', transcript);
        }
      }

      if (backup.data.chats) {
        for (const chat of backup.data.chats) {
          await this.set('chats', chat);
        }
      }

      return { success: true, itemsImported: backup.data.projects?.length || 0 };
    } catch (err) {
      throw new Error(`Backup import failed: ${err.message}`);
    }
  }

  /**
   * Get total storage used
   */
  async getStorageUsed() {
    const projects = await this.getAll('projects');
    const transcripts = await this.getAll('transcripts');
    const chats = await this.getAll('chats');

    const estimateSize = (obj) => new Blob([JSON.stringify(obj)]).size;
    const total =
      projects.reduce((sum, p) => sum + estimateSize(p), 0) +
      transcripts.reduce((sum, t) => sum + estimateSize(t), 0) +
      chats.reduce((sum, c) => sum + estimateSize(c), 0);

    return Math.round(total / 1024 / 1024); // MB
  }
}

export default new StorageManager();
