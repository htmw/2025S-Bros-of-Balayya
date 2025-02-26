import { auth } from "./Config"; // Ensure correct import path
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout Error:", err.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
