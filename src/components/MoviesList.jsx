import React, { useEffect, useState, useContext } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  deleteField,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { UserContext } from '../contexts/UserContext';

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState({});
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'movies'));
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(moviesData);

      if (user) {
        const favDoc = await getDoc(doc(db, 'userFavorites', user.uid));
        if (favDoc.exists()) {
          setFavorites(favDoc.data());
        }
      }
    };

    fetchData();
  }, [user]);

  const handleFavorite = async (movieId) => {
    const favRef = doc(db, 'userFavorites', user.uid);
    const updatedFavorites = { ...favorites };

    if (favorites[movieId]) {
      delete updatedFavorites[movieId];
      await updateDoc(favRef, { [movieId]: deleteField() });
    } else {
      updatedFavorites[movieId] = true;
      await setDoc(favRef, { [movieId]: true }, { merge: true });
    }

    setFavorites(updatedFavorites);
  };

  const handleDelete = async (movie) => {
    try {
      await deleteDoc(doc(db, 'movies', movie.id));
      setMovies(movies.filter(m => m.id !== movie.id));
    } catch (error) {
      console.error('❌ خطأ أثناء الحذف:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  if (loading) return <Typography>جاري التحميل...</Typography>;

  return (
    <Grid container spacing={2}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} key={movie.id}>
          <Card>
            {movie.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                image={movie.imageUrl}
                alt={movie.title}
                style={{ objectFit: 'cover' }}
              />
            )}
            <CardContent>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2">السنة: {movie.year}</Typography>
              <Typography variant="body2">التقييم: {movie.rating}</Typography>

              {user && (
                <IconButton onClick={() => handleFavorite(movie.id)} color="secondary">
                  {favorites[movie.id] ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              )}

              {user?.role === 'admin' && (
                <Button color="error" onClick={() => handleDelete(movie)}>
                  🗑️ حذف
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
