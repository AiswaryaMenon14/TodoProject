import React, { useState } from 'react';
import { auth, provider, signInWithPopup, signOut } from '../firebase/Firebase';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result,'result')
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 shadow-lg rounded-lg w-1/2">
        {/* {user ? ( */}
          <div>
            {/* <img src={user.photoURL} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto" /> */}
            {/* <h2 className="text-2xl mt-4 mb-2 text-center"> */}
                {/* {user.displayName} */}
                {/* Name
                </h2>
            <p className="text-center mb-4">
                {/* {user.email} */}
                {/* Email */}
                {/* </p>  */}
            {/* <button
              onClick={handleSignOut}
              className="w-full py-2 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Sign Out 
            </button> */}
          </div>
      
          <button
            onClick={handleSignIn}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Sign in with Google
          </button>
          <button
              onClick={handleSignOut}
              className="w-full py-2 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Sign Out 
            </button>
         {/* )}  */}
      </div>
    </div>
  );
};

export default Auth;
