import React from "react";
import { Navigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/Firebase";

export const Login = ({ user }) => {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 shadow-lg rounded-lg w-1/2">
        <button
          onClick={handleSignIn}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
