import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/Firebase";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Login } from "./Login";
import Project from "./Projects";
import ProjectDetail from "./ProjectDetail";

function Index() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
            setIsFetching(false);
            return;
          }
    
          setUser(null);
          setIsFetching(false);
        });
        return () => unsubscribe();
      }, []);

  

  if (isFetching) {
    return <h2>Loading...</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/login" element={<Login user={user} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Project  userId={user?.uid}/>
            </ProtectedRoute >
          }
        />
         <Route
          path="/:projectId"
          element={
            <ProtectedRoute user={user}>
              <ProjectDetail userId={user?.uid}/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Index;
