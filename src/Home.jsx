import { auth } from "./Config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || "User");
    }
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Welcome, <span className="text-blue-600">{userName}</span>!
        </h1>
        <p className="text-gray-500 mb-6">You’re logged in to QuickRecap.</p>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
