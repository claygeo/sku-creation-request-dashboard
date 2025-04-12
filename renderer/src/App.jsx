import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/Dashboard';
import SubmitRequest from './components/SubmitRequest';
import CheckStatus from './components/CheckStatus';
import './styles.css';

// Create a Theme Context
export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Apply the theme to the body class
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submit-request" element={<SubmitRequest />} />
          <Route path="/check-status" element={<CheckStatus />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;