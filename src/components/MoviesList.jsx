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
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import { Favorite, FavoriteBorder, Delete } from '@mui/icons-material';
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

  if (loading) return <Typography align="center" mt={5}>جاري التحميل...</Typography>;

  return (
    <Grid container spacing={3} justifyContent="center" padding={2}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.02)' },
              boxShadow: 4,
              borderRadius: 3,
            }}
          >
            {movie.imageUrl && (
              <CardMedia
                component="img"
                height="250"
                image={movie.imageUrl}
                alt={movie.title}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>{movie.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                السنة: {movie.year}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                التقييم: {movie.rating}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                {user && (
                  <Tooltip title={favorites[movie.id] ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}>
                    <IconButton onClick={() => handleFavorite(movie.id)} color="error">
                      {favorites[movie.id] ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                )}

                {user?.role === 'admin' && (
                  <Tooltip title="حذف الفيلم">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(movie)}
                    >
                      حذف
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
