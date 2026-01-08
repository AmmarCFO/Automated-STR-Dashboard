
import React, { useState, useEffect } from 'react';
import App_en from './App_en';
import App_ar from './App_ar';
import { STR_DATA } from './constants';
import { STRPerformanceData } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [strData] = useState<STRPerformanceData>(STR_DATA);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
      document.body.classList.add('font-cairo');
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('font-cairo');
    }
  }, [language]);

  return language === 'en' ? (
    <App_en 
        onToggleLanguage={toggleLanguage} 
        data={strData}
    />
  ) : (
    <App_ar 
        onToggleLanguage={toggleLanguage} 
        data={strData}
    />
  );
};

export default App;
