import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Box
} from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddMovie() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'movies'), {
        title,
        year: parseInt(year),
        rating: parseFloat(rating),
        imageUrl,
      });

      alert('✅ تم إضافة الفيلم بنجاح!');
      setTitle('');
      setYear('');
      setRating('');
      setImageUrl('');
    } catch (err) {
      console.error(err);
      alert('❌ حدث خطأ أثناء الإضافة');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            🎬 إضافة فيلم جديد
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mt: 2 }}>
            <TextField
              label="عنوان الفيلم"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="السنة"
              type="number"
              fullWidth
              margin="normal"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            <TextField
              label="التقييم"
              type="number"
              fullWidth
              margin="normal"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
            <TextField
              label="رابط الصورة"
              placeholder="https://i.ibb.co/xxxxx/image.jpg"
              fullWidth
              margin="normal"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />

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
