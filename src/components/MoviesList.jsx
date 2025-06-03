import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button
} from '@mui/material';
import { UserContext } from '../contexts/UserContext'; // ⬅️ تمت الإضافة

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const { user, loading } = useContext(UserContext); // ⬅️ تمت الإضافة

  useEffect(() => {
    const getMovies = async () => {
      const snapshot = await getDocs(collection(db, 'movies'));
      setMovies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    getMovies();
  }, []);

  const handleDelete = async (movie) => {
    try {
      await deleteDoc(doc(db, 'movies', movie.id));
      setMovies(movies.filter(m => m.id !== movie.id));
    } catch (error) {
      console.error('❌ خطأ أثناء الحذف:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  if (loading) return <Typography>جاري التحميل...</Typography>; // ⬅️ لحين تحميل بيانات المستخدم

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

              {user?.role === "admin" && (
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
