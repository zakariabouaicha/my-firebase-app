import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMovie from './pages/AddMovie';
import Login from "./pages/Login";
import FavoritePage from './pages/FavoritePage';
import { UserProvider } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import MoviesList from "./components/MoviesList";

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

function App() {
  const [darkMode, setDarkMode] = useState(true); // الوضع الليلي افتراضياً

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Navbar toggleDarkMode={() => setDarkMode(!darkMode)} darkMode={darkMode} />
          <Routes>
            <Route path="/" element={<MoviesList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add" element={<AddMovie />} />
            <Route path="/favorites" element={<FavoritePage />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
