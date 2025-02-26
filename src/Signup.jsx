import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./Config"; // Import Firestore database
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions

function Signup() {
  const [firstName, setFirstName] = useState(""); // State for first name
  const [lastName, setLastName] = useState(""); // State for last name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [error, setError] = useState(""); // State for error message
  const [passwordStrengthError, setPasswordStrengthError] = useState(""); // State for password strength validation
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  // Password strength validation function
  const validatePasswordStrength = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password); // Password must be at least 8 characters, contain letters, numbers, and a special character
  };

  const handleSignup = async () => {
    // Validate password strength
    if (!validatePasswordStrength(password)) {
      setPasswordStrengthError("Password must be at least 8 characters, contain letters, numbers, and a special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with name (First and Last Name)
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
      });

      // Set success message after successful signup
      setSuccessMessage("You can login now");

      // Redirect to login page after a short delay (so user sees the success message)
      setTimeout(() => {
        navigate("/"); // Redirect to login page
      }, 2000);
      
    } catch (error) {
      setError(error.message); // Display any other error message
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 border border-white/20">
        <h1 className="text-4xl font-extrabold text-white text-center mb-4">QuickRecap</h1>
        <p className="text-gray-200 text-center mb-6">Create an account</p>

        {/* First Name */}
        <div className="mb-3">
          <label className="text-white text-sm font-semibold">First Name:</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label className="text-white text-sm font-semibold">Last Name:</label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="text-white text-sm font-semibold">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="text-white text-sm font-semibold">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordStrengthError(""); // Reset error on password change
            }}
            className="border border-gray-300 p-3 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-white text-sm font-semibold">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Strength Error */}
        {passwordStrengthError && <p className="text-red-500 text-center mb-4">{passwordStrengthError}</p>}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Success Message */}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="bg-blue-600 text-white p-3 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-300"
        >
          Signup
        </button>

        {/* Login Link */}
        <p className="text-gray-200 text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-white font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
