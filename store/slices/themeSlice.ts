// store/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
}

// SAFE: No localStorage during SSR/build
const initialState: ThemeState = {
  isDarkMode: false, // Will be corrected on client
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mreport_theme', state.isDarkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', state.isDarkMode);
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mreport_theme', action.payload ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', action.payload);
      }
    },
    // This runs once when app mounts on browser
    initializeTheme: (state) => {
      if (typeof window === 'undefined') return;
      
      const saved = localStorage.getItem('mreport_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = saved === 'dark' || (saved === null && prefersDark);

      state.isDarkMode = shouldBeDark;
      document.documentElement.classList.toggle('dark', shouldBeDark);
    },
  },
});

export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;