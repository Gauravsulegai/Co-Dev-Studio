'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserPreferences } from '@/lib/fetchUserPreferences';

const ThemeContext = createContext();
const channel = typeof window !== 'undefined' ? new BroadcastChannel('theme') : null;

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  // Load theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      const preferences = await fetchUserPreferences();
      const userTheme = preferences?.theme || 'light';

      document.documentElement.classList.toggle('dark', userTheme === 'dark');
      setTheme(userTheme);
    };

    loadTheme();
  }, []);

  // Listen for theme updates from other tabs
  useEffect(() => {
    if (!channel) return;

    channel.onmessage = (event) => {
      const newTheme = event.data;
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      setTheme(newTheme);
    };

    return () => {
      channel.close();
    };
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Update DOM
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);

    // Update DB
    await fetch('/api/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newTheme }),
    });

    // Broadcast to other tabs
    channel?.postMessage(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {theme !== null && children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
