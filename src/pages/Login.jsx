import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { getFirestore, doc, setDoc } from 'firebase/firestore';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert("✅ تم تسجيل الدخول بنجاح!");
    } catch (err) {
      setError(err.message);
    }
  };

  // تسجيل مستخدم جديد (اختياري)
 const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);

    // تخزين بيانات المستخدم في Firestore
    const db = getFirestore();
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: "user"
    });

    alert("✅ تم إنشاء حساب جديد!");
  } catch (err) {
    setError(err.message);
  }
};


  // تسجيل خروج
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    alert("✅ تم تسجيل الخروج");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>تسجيل الدخول</Typography>
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
          {error && <Typography color="error">{error}</Typography>}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            تسجيل الدخول
          </Button>

          <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} onClick={handleRegister}>
            إنشاء حساب جديد
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography>مرحبًا، {user.email}</Typography>
          <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
            تسجيل خروج
          </Button>
        </Box>
      )}
    </Container>
  );
}
