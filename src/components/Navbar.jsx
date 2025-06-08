import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import MovieIcon from '@mui/icons-material/Movie';

export default function Navbar() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <AppBar position="static" sx={{ bgcolor: "#1e1e1e" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* القسم الأيسر: اسم التطبيق */}
        <Box display="flex" alignItems="center">
          <MovieIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            تطبيق الأفلام
          </Typography>
        </Box>

        {/* القسم الأوسط: الروابط العامة */}
        <Box display="flex" gap={2}>
          <Button color="inherit" component={Link} to="/">
            عرض الأفلام
          </Button>

          {user && user.role === "user" && (
            <Button color="inherit" component={Link} to="/favorites">
              المفضلة
            </Button>
          )}

          {user && user.role === "admin" && (
            <Button color="inherit" component={Link} to="/add">
              إضافة فيلم
            </Button>
          )}
        </Box>

        {/* القسم الأيمن: معلومات المستخدم وتسجيل الخروج */}
        <Box display="flex" alignItems="center" gap={2}>
          {user ? (
            <>
              <Tooltip title="البريد الإلكتروني">
                <Typography variant="body2" color="inherit">
                  {user.email}
                </Typography>
              </Tooltip>
              <Button color="inherit" onClick={handleLogout}>
                تسجيل خروج
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              تسجيل الدخول
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
