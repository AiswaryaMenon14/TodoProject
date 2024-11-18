import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/Firebase";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Home } from "./Home";
import Private from "./Projects";
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
        <Route index path="/" element={<Home user={user} />} />
        <Route
          path="/private"
          element={
            <ProtectedRoute user={user}>
              <Private  userId={user?.uid}/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute user={user}>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Index;
