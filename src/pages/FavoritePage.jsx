import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Container,
  Box
} from '@mui/material';
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
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🎥 قائمة المفضلة
      </Typography>

      {favoriteMovies.length === 0 ? (
        <Typography align="center" color="text.secondary">
          لا توجد أفلام في المفضلة حتى الآن.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favoriteMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
                {movie.imageUrl && (
                  <CardMedia
                    component="img"
                    height="250"
                    image={movie.imageUrl}
                    alt={movie.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 السنة: {movie.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ⭐ التقييم: {movie.rating}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
