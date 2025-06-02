import React, { useEffect } from 'react';
import MoviesList from '../components/MoviesList';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function Home() {
  useEffect(() => {
    const createMoviesCollection = async () => {
      const colRef = collection(db, 'movies');
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        await addDoc(colRef, {
          title: 'Oppenheimer',
          year: 2023,
          rating: 8.5,
          imageUrl: '',
        });
        console.log('✅ تمت إضافة فيلم Oppenheimer إلى Firestore');
      } else {
        console.log('📁 مجموعة movies موجودة مسبقًا');
      }
    };
    createMoviesCollection();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>🎬 قائمة الأفلام</Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/add"
        sx={{ mb: 2 }}
      >
        ➕ إضافة فيلم
      </Button>
      <MoviesList />
    </Container>
  );
}
