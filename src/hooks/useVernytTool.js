/**
 * useVernytTool: Standard hook for all tools
 * Provides consistent interface for all tool components to access shared services
 */

import { useState, useCallback } from 'react';
import modelManager from '../services/modelManager';
import storageManager from '../services/storageManager';
import billingManager from '../services/billingManager';
import analyticsManager from '../services/analyticsManager';

export const useVernytTool = (toolName) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  /**
   * Check if user can perform action (billing gate)
   */
  const checkPermission = useCallback(
    (action, metadata = {}) => {
      const check = billingManager.canPerformAction(action, metadata);

      if (!check.allowed) {
        setError({
          type: 'permission_denied',
          reason: check.reason,
          message: billingManager.getUpgradeMessage(check.reason)
        });
        return false;
      }

      return true;
    },
    []
  );

  /**
   * Load AI model with progress tracking
   */
  const loadModel = useCallback(
    async (modelId) => {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      try {
        const model = await modelManager.loadModel(modelId, (p) => {
          setProgress(p.progress || 0);
        });

        analyticsManager.logModelDownload(modelId, '~500MB');
        return model;
      } catch (err) {
        const errorMsg = `Failed to load model: ${err.message}`;
        setError(errorMsg);
        console.error(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Save result to local storage
   */
  const saveResult = useCallback(
    async (projectName, data) => {
      try {
        const result = await storageManager.saveProject({
          name: projectName,
          description: `${toolName} output`,
          files: [data]
        });

        analyticsManager.logToolUsage(toolName, {
          action: 'save_result',
          projectId: result.id
        });

        return result;
      } catch (err) {
        console.error('Save failed:', err);
        throw err;
      }
    },
    [toolName]
  );

  /**
   * Log tool usage
   */
  const logUsage = useCallback(
    (metadata = {}) => {
      const usage = billingManager.recordUsage(toolName);
      analyticsManager.logToolUsage(toolName, metadata);
      return usage;
    },
    [toolName]
  );

  /**
   * Get current subscription tier
   */
  const getPro = useCallback(() => {
    return billingManager.isPro();
  }, []);

  /**
   * Get usage limits for current tier
   */
  const getLimits = useCallback(() => {
    return billingManager.getLimits();
  }, []);

  /**
   * Trigger upgrade modal (in parent)
   */
  const requestUpgrade = useCallback((reason) => {
    return {
      type: 'UPGRADE_REQUIRED',
      reason,
      message: billingManager.getUpgradeMessage(reason)
    };
  }, []);

  return {
    isLoading,
    error,
    progress,
    checkPermission,
    loadModel,
    saveResult,
    logUsage,
    getPro,
    getLimits,
    requestUpgrade,
    // Raw service access if needed
    modelManager,
    storageManager,
    billingManager,
    analyticsManager
  };
};

export default useVernytTool;
