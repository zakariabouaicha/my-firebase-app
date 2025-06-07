import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Grid, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { UserContext } from '../contexts/UserContext';

export default function FavoritePage() {
  const { user, loading } = useContext(UserContext);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const favDoc = await getDoc(doc(db, 'userFavorites', user.uid));
      const favoritesData = favDoc.exists() ? favDoc.data() : {};

      const snapshot = await getDocs(collection(db, 'movies'));
      const allMovies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const favMovies = allMovies.filter(movie => favoritesData[movie.id]);
      setFavoriteMovies(favMovies);
    };

    fetchFavorites();
  }, [user]);

  if (loading) return <Typography>جاري التحميل...</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        قائمة المفضلة
      </Typography>
      <Grid container spacing={2}>
        {favoriteMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card>
              {movie.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={movie.imageUrl}
                  alt={movie.title}
                />
              )}
              <CardContent>
                <Typography variant="h6">{movie.title}</Typography>
                <Typography variant="body2">السنة: {movie.year}</Typography>
                <Typography variant="body2">التقييم: {movie.rating}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
