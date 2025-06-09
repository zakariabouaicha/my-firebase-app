import React, { useState } from 'react';
// ✅ استيراد مكونات MUI لبناء واجهة المستخدم
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Box
} from '@mui/material';

// ✅ استيراد قاعدة بيانات Firebase
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddMovie() {
  // ✅ إنشاء حالات لتخزين بيانات النموذج (الفورم)
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // ✅ دالة تنفذ عند إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    try {
      // 🔹 إضافة فيلم جديد إلى مجموعة "movies" في Firestore
      await addDoc(collection(db, 'movies'), {
        title,
        year: parseInt(year), // تحويل السنة إلى رقم
        rating: parseFloat(rating), // تحويل التقييم إلى رقم عشري
        imageUrl,
      });

      // 🔹 تنبيه بنجاح الإضافة وتفريغ النموذج
      alert('✅ تم إضافة الفيلم بنجاح!');
      setTitle('');
      setYear('');
      setRating('');
      setImageUrl('');
    } catch (err) {
      console.error(err); // عرض الخطأ في الكونسول
      alert('❌ حدث خطأ أثناء الإضافة');
    }
  };

  // ✅ واجهة النموذج
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            🎬 إضافة فيلم جديد
          </Typography>

          {/* 🔹 نموذج الإدخال */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{ mt: 2 }}
          >
            {/* 🔸 إدخال عنوان الفيلم */}
            <TextField
              label="عنوان الفيلم"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* 🔸 إدخال سنة الإصدار */}
            <TextField
              label="السنة"
              type="number"
              fullWidth
              margin="normal"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />

            {/* 🔸 إدخال التقييم */}
            <TextField
              label="التقييم"
              type="number"
              fullWidth
              margin="normal"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />

            {/* 🔸 إدخال رابط الصورة */}
            <TextField
              label="رابط الصورة"
              placeholder="https://i.ibb.co/xxxxx/image.jpg"
              fullWidth
              margin="normal"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />

            {/* 🔸 زر الإرسال */}
            <Box textAlign="center" mt={3}>
              <Button type="submit" variant="contained" color="primary" size="large">
                ➕ إضافة الفيلم
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
