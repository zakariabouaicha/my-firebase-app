import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          تطبيق الأفلام
        </Typography>

        <Button color="inherit" component={Link} to="/">
          عرض الأفلام
        </Button>

        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">
              تسجيل الدخول
            </Button>
          </>
        )}

        {user && user.role === "user" && (
          <>
            <Button color="inherit" component={Link} to="/favorites">
              المفضلة
            </Button>
            <Typography sx={{ mx: 2 }}>{user.email}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              تسجيل خروج
            </Button>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <Button color="inherit" component={Link} to="/add">
              إضافة فيلم
            </Button>
            <Typography sx={{ mx: 2 }}>{user.email}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              تسجيل خروج
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
