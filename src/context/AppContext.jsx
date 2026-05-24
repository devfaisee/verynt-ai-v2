import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isPrivacySandbox, setIsPrivacySandbox] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [globalFile, setGlobalFile] = useState(null);
  const [usageCount, setUsageCount] = useState(() => {
    const saved = localStorage.getItem('verynt_usage_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  // Model management state
  const [modelsLoaded, setModelsLoaded] = useState({});
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderStatus, setLoaderStatus] = useState('');

  useEffect(() => {
    localStorage.setItem('verynt_usage_count', usageCount.toString());
    if (usageCount >= 10) { // Limit gate
      // In a real app, we'd check subscription status here
    }
  }, [usageCount]);

  const incrementUsage = () => {
    setUsageCount(prev => {
      const next = prev + 1;
      if (next >= 5) { // Show pricing after 5 actions in free tier
        setIsPricingOpen(true);
      }
      return next;
    });
  };

  const triggerLoader = (statusText, completionCallback) => {
    setLoaderVisible(true);
    setLoaderProgress(0);
    setLoaderStatus(statusText || 'Initializing...');
    
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        setLoaderProgress(100);
        clearInterval(interval);
        
        setTimeout(() => {
          setLoaderVisible(false);
          if (completionCallback) completionCallback();
        }, 500);
      } else {
        setLoaderProgress(current);
      }
    }, 100);
  };

  const value = {
    isOffline,
    setIsOffline,
    isPrivacySandbox,
    setIsPrivacySandbox,
    isPricingOpen,
    setIsPricingOpen,
    globalFile,
    setGlobalFile,
    usageCount,
    incrementUsage,
    loaderVisible,
    loaderProgress,
    loaderStatus,
    triggerLoader,
    modelsLoaded,
    setModelsLoaded
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
