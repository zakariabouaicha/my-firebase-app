
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
const [user, setUser] = useState(null); // بيانات المستخدم + role + favorites
const [loading, setLoading] = useState(true);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
if (firebaseUser) {
const userRef = doc(db, "users", firebaseUser.uid);
const userDoc = await getDoc(userRef);


    if (userDoc.exists()) {
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...userDoc.data(),
      });
    } else {
      // إنشاء مستند جديد للمستخدم تلقائيًا
      const newUserData = {
        role: "user",
        favorites: [],
      };
      await setDoc(userRef, newUserData);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...newUserData,
      });
    }
  } else {
    setUser(null);
  }
  setLoading(false);
});

return () => unsubscribe();
}, []);

return (
<UserContext.Provider value={{ user, loading }}>
{children}
</UserContext.Provider>
);
}

