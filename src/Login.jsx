import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./Config";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirect to Home Page after login
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>QuickRecap</h1>
        <p style={styles.subtitle}>Sign in to continue</p>

        {error && <p style={styles.errorMessage}>{error}</p>}

        {/* Email Input */}
        <div style={styles.inputContainer}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Password Input */}
        <div style={styles.inputContainer}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Login Button */}
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        {/* Signup Link */}
        <p style={styles.footerText}>
          <span style={styles.newUserText}>New user?</span>{" "}
          <span onClick={() => navigate("/signup")} style={styles.signupLink}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "url('https://t3.ftcdn.net/jpg/05/61/61/36/360_F_561613631_mVmmaQn83oibz1ZzIiOfGBFv7CUp3ucw.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  card: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    width: "350px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#000",
    marginBottom: "20px",
  },
  inputContainer: {
    width: "100%", // Ensures alignment with the box
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    color: "#1A237E",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "calc(100% - 24px)", // Perfect alignment
    padding: "12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
    display: "block",
    margin: "0 auto",
    transition: "border 0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "10px",
  },
  errorMessage: {
    background: "#8B0000",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    fontSize: "14px",
  },
  footerText: {
    marginTop: "15px",
    fontSize: "14px",
  },
  newUserText: {
    color: "#333",
  },
  signupLink: {
    color: "#4B0082",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
