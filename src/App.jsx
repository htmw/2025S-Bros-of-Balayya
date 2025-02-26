import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./Config"; // Ensure this file exists
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";

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
      <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
