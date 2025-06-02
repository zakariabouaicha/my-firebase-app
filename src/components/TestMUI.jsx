// TestMUI.jsx
import React from 'react';
import { Button, Typography, Card, CardContent } from '@mui/material';

export default function TestMUI() {
  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>🎬 فيلم تجريبي</Typography>
        <Typography>السنة: 2024</Typography>
        <Typography>التقييم: 8.7</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          زر من MUI
        </Button>
      </CardContent>
    </Card>
  );
}
