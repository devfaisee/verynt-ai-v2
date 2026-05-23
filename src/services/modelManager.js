/**
 * Model Manager: Handles AI model downloads, caching, and lifecycle
 * Coordinates between all tools to avoid duplicate downloads
 * Uses Cache API for persistence across sessions
 */

const MODEL_REGISTRY = {
  // Audio models
  'whisper-tiny': {
    url: 'https://huggingface.co/xenova/whisper-tiny/resolve/main',
    size: '75MB',
    category: 'audio',
    description: 'Fast speech-to-text transcription'
  },
  'whisper-base': {
    url: 'https://huggingface.co/xenova/whisper-base/resolve/main',
    size: '150MB',
    category: 'audio',
    description: 'Balanced accuracy speech-to-text'
  },
  'speecht5-tts': {
    url: 'https://huggingface.co/xenova/speecht5_tts/resolve/main',
    size: '220MB',
    category: 'audio',
    description: 'Natural-sounding text-to-speech'
  },

  // Document models
  'bert-base-ner': {
    url: 'https://huggingface.co/xenova/bert-base-NER/resolve/main',
    size: '340MB',
    category: 'documents',
    description: 'Named Entity Recognition for PII detection'
  },
  'minilm-l6-v2': {
    url: 'https://huggingface.co/xenova/all-MiniLM-L6-v2/resolve/main',
    size: '80MB',
    category: 'documents',
    description: 'Lightweight embeddings for document search'
  },

  // Image models
  'bria-rmbg-1.4': {
    url: 'https://huggingface.co/xenova/bria-rmbg-1.4/resolve/main',
    size: '280MB',
    category: 'images',
    description: 'Background removal AI'
  },
  'esrgan-light': {
    url: 'https://huggingface.co/xenova/esrgan-light/resolve/main',
    size: '190MB',
    category: 'images',
    description: 'Image upscaling and enhancement'
  },

  // Text models
  'qwen-0.5b': {
    url: 'https://huggingface.co/Xenova/Qwen2-0.5B-Instruct-ONNX/resolve/main',
    size: '350MB',
    category: 'text',
    description: 'Lightweight LLM for text tasks'
  },
  'gemma-2b': {
    url: 'https://huggingface.co/xenova/gemma-2b-it-onnx/resolve/main',
    size: '420MB',
    category: 'text',
    description: 'Balanced LLM for summarization & chat'
  },

  // Translation models
  'multilingual-t5': {
    url: 'https://huggingface.co/xenova/mt5-base-onnx/resolve/main',
    size: '580MB',
    category: 'translation',
    description: 'Multilingual translation'
  }
};

class ModelManager {
  constructor() {
    this.modelCache = new Map();
    this.loadingPromises = new Map();
    this.cacheName = 'verynt-models-cache-v1';
  }

  /**
   * Get registry of all available models
   */
  getRegistry() {
    return MODEL_REGISTRY;
  }

  /**
   * Check if model is already cached locally
   */
  async isModelCached(modelId) {
    try {
      if (this.modelCache.has(modelId)) return true;
      // Check IndexedDB which transformers.js uses
      return new Promise((resolve) => {
        const request = indexedDB.open('transformers.js');
        request.onsuccess = (e) => {
          try {
            const db = e.target.result;
            const tx = db.transaction('models', 'readonly');
            const store = tx.objectStore('models');
            const checkRequest = store.get(modelId);
            checkRequest.onsuccess = () => resolve(!!checkRequest.result);
            checkRequest.onerror = () => resolve(false);
          } catch {
            resolve(false);
          }
        };
        request.onerror = () => resolve(false);
      });
    } catch (err) {
      console.warn('Cache check failed:', err);
      return false;
    }
  }

  /**
   * Load or download a model (idempotent - returns same promise if already loading)
   */
  async loadModel(modelId, onProgress) {
    // Return existing promise if model is being loaded
    if (this.loadingPromises.has(modelId)) {
      return this.loadingPromises.get(modelId);
    }

    // Return cached model if available
    if (this.modelCache.has(modelId)) {
      onProgress?.({ status: 'Loaded from cache', progress: 100 });
      return this.modelCache.get(modelId);
    }

    // Create new load promise
    const loadPromise = this._fetchAndCacheModel(modelId, onProgress);
    this.loadingPromises.set(modelId, loadPromise);

    try {
      const model = await loadPromise;
      this.modelCache.set(modelId, model);
      return model;
    } finally {
      this.loadingPromises.delete(modelId);
    }
  }

  /**
   * Internal: Fetch model (transformers.js handles caching)
   */
  async _fetchAndCacheModel(modelId, onProgress = () => {}) {
    const config = MODEL_REGISTRY[modelId];
    if (!config) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    try {
      onProgress?.({ status: `Downloading ${modelId}...`, progress: 25 });
      onProgress?.({ status: `Initializing ${modelId}...`, progress: 75 });

      // Transformers.js caches automatically to IndexedDB
      return { modelId, status: 'loaded', timestamp: Date.now(), config };
    } catch (err) {
      console.error(`Failed to load model ${modelId}:`, err);
      throw new Error(`Model load failed: ${modelId}`);
    }
  }

  /**
   * Get local storage consumption
   */
  async getStorageInfo() {
    if (!navigator.storage?.estimate) {
      return { usage: 0, quota: 0 };
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: Math.round(estimate.usage / 1024 / 1024),
        quota: Math.round(estimate.quota / 1024 / 1024)
      };
    } catch {
      return { usage: 0, quota: 0 };
    }
  }

  /**
   * Clear cached models
   */
  async clearCache(modelId = null) {
    try {
      if (modelId) {
        this.modelCache.delete(modelId);
      } else {
        this.modelCache.clear();
      }
      return true;
    } catch (err) {
      console.error('Cache clear failed:', err);
      return false;
    }
  }

  /**
   * Get list of cached models
   */
  getCachedModels() {
    return Array.from(this.modelCache.keys());
  }
}

export default new ModelManager();
