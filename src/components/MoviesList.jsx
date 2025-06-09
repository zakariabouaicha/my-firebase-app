import React, { useEffect, useState, useContext } from 'react';
// ✅ استيراد دوال من Firebase Firestore للتعامل مع قاعدة البيانات
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

// ✅ استيراد مرجع قاعدة البيانات
import { db } from '../firebase';

// ✅ استيراد مكونات من مكتبة MUI لبناء واجهة المستخدم
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

// ✅ استيراد السياق الخاص بالمستخدم
import { UserContext } from '../contexts/UserContext';

export default function MoviesList() {
  // ✅ حالة لتخزين قائمة الأفلام
  const [movies, setMovies] = useState([]);

  // ✅ حالة لتخزين الأفلام المفضلة للمستخدم الحالي
  const [favorites, setFavorites] = useState({});

  // ✅ جلب معلومات المستخدم من السياق
  const { user, loading } = useContext(UserContext);

  // ✅ جلب الأفلام وبيانات المفضلة عند تحميل الصفحة أو تغيّر المستخدم
  useEffect(() => {
    const fetchData = async () => {
      // 🔹 جلب جميع الأفلام من مجموعة 'movies'
      const snapshot = await getDocs(collection(db, 'movies'));
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(moviesData);

      // 🔹 إذا كان المستخدم مسجلاً، جلب بيانات المفضلة الخاصة به
      if (user) {
        const favDoc = await getDoc(doc(db, 'userFavorites', user.uid));
        if (favDoc.exists()) {
          setFavorites(favDoc.data());
        }
      }
    };

    fetchData();
  }, [user]);

  // ✅ دالة للتبديل بين الإعجاب وعدم الإعجاب (المفضلة)
  const handleFavorite = async (movieId) => {
    const favRef = doc(db, 'userFavorites', user.uid); // مرجع وثيقة المفضلة للمستخدم
    const updatedFavorites = { ...favorites };

    if (favorites[movieId]) {
      // 🔸 إذا كان الفيلم مفضل مسبقًا → حذفه من المفضلة
      delete updatedFavorites[movieId];
      await updateDoc(favRef, { [movieId]: deleteField() });
    } else {
      // 🔸 إذا لم يكن مفضلًا → إضافته
      updatedFavorites[movieId] = true;
      await setDoc(favRef, { [movieId]: true }, { merge: true });
    }

    setFavorites(updatedFavorites); // تحديث الحالة
  };

  // ✅ دالة لحذف فيلم (للمدير فقط)
  const handleDelete = async (movie) => {
    try {
      await deleteDoc(doc(db, 'movies', movie.id)); // حذف الفيلم من قاعدة البيانات
      setMovies(movies.filter(m => m.id !== movie.id)); // تحديث حالة العرض
    } catch (error) {
      console.error('❌ خطأ أثناء الحذف:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  // ✅ أثناء تحميل بيانات المستخدم
  if (loading) return <Typography align="center" mt={5}>جاري التحميل...</Typography>;

  // ✅ واجهة عرض الأفلام
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
            {/* ✅ عرض صورة الفيلم */}
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
              {/* ✅ عنوان الفيلم */}
              <Typography variant="h6" gutterBottom>{movie.title}</Typography>

              {/* ✅ سنة الإنتاج */}
              <Typography variant="body2" color="text.secondary">
                السنة: {movie.year}
              </Typography>

              {/* ✅ التقييم */}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                التقييم: {movie.rating}
              </Typography>

              {/* ✅ أزرار المفضلة والحذف */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                {/* 🔸 زر المفضلة (للمستخدم المسجل فقط) */}
                {user && (
                  <Tooltip title={favorites[movie.id] ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}>
                    <IconButton onClick={() => handleFavorite(movie.id)} color="error">
                      {favorites[movie.id] ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                )}

                {/* 🔸 زر الحذف (للمدير فقط) */}
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
