import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
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
        imageUrl, // ✅ هذا ما يتم تخزينه مباشرة
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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>➕ إضافة فيلم</Typography>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="contained" color="primary">إضافة</Button>
      </form>
    </Container>
  );
}
