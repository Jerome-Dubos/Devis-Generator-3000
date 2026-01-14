import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Quote from './pages/Quote/Quote';
import './index.css';

const App = () => {
  return (
    <ThemeProvider>
      <Quote />
    </ThemeProvider>
  );
};

export default App;
