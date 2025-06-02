
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMovie from './pages/AddMovie';
import { getFirestore,collection, } from 'firebase/firestore';


export default function App() {
return (
<Router>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/add" element={<AddMovie />} />
</Routes>
</Router>
);
}