
import React from 'react';
<<<<<<< HEAD
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMovie from './pages/AddMovie';
import { getFirestore,collection, } from 'firebase/firestore';
>>>>>>> zakaria


<<<<<<< HEAD
     
    </>
  );
}

export default App;
=======
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
>>>>>>> zakaria
