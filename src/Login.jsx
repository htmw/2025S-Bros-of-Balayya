import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./Config"; // Ensure this matches your Firebase config file
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirect to Home Page after login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 border border-white/20">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6">QuickRecap</h1>
        <p className="text-gray-200 text-center mb-6">Sign in to continue</p>

        {/* Username Input */}
        <div className="mb-3">
          <label className="text-white font-semibold mb-2 block" htmlFor="email">
            Username:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="text-white font-semibold mb-2 block" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white p-3 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="text-gray-200 text-center mt-4">
          New user?{" "}
          <span
            className="text-white font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
