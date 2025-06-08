import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { TextField, Button, Container, Typography, Box, Paper } from "@mui/material";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert("✅ تم تسجيل الدخول بنجاح!");
    } catch (err) {
      setError("❌ البريد أو كلمة المرور غير صحيحة");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      const db = getFirestore();
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: "user"
      });
      alert("✅ تم إنشاء حساب جديد!");
    } catch (err) {
      setError("❌ تعذر إنشاء الحساب. قد يكون البريد مستخدمًا مسبقًا.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    alert("✅ تم تسجيل الخروج");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>تسجيل الدخول</Typography>
        {!user ? (
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="البريد الإلكتروني"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <TextField
              label="كلمة المرور"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              تسجيل الدخول
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleRegister}
            >
              إنشاء حساب جديد
            </Button>
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              👋 مرحبًا، {user.email}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              fullWidth
              sx={{ mt: 2 }}
            >
              تسجيل خروج
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
