import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./Config.js"; // Ensure this file exists
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Home from "./Home.jsx";
import Profile from "./Profile";
import Output from "./Output.jsx";
import FrontPage from "./Frontpage.jsx"; // Import Output page

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("User state changed:", currentUser);
      setUser(currentUser);
      setLoading(false); // Stop loading once user state is fetched
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <FrontPage /> : <Navigate to="/home" />}
      />

      {/* Login and Signup Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />

      {/* Home, Profile, and Output pages (Protected Routes) */}
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
      <Route
        path="/output"
        element={user ? <Output /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
