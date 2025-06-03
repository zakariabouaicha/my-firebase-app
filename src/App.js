
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMovie from './pages/AddMovie';
import { getFirestore,collection, } from 'firebase/firestore';
import Login from "./pages/Login";
import { UserProvider } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import MoviesList from "./components/MoviesList";





    



function App() {
return (
 <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<AddMovie />} />
        </Routes>
      </Router>
    </UserProvider>
);
}
export default App;
