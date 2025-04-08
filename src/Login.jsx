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
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#FF6F61"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"}
          />
        </div>

        {/* Password Input */}
        <div style={styles.inputContainer}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#FF6F61"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"}
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
            Sign up
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
    backgroundColor: "#ECF0F1", // Match with main page background
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    border: "1px solid #ddd",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#2c3e50", // Match the header color from the front page
    marginBottom: "16px",
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  subtitle: {
    fontSize: "18px",
    color: "#7f8c8d",
    fontWeight: "500",
    marginBottom: "30px",
  },
  inputContainer: {
    width: "100%",
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    color: "#555",
    fontWeight: "500",
    marginBottom: "8px",
    fontSize: "14px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    background: "#FF6F61", // Button color matching with the front page
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
  },
  buttonHover: {
    background: "#e76f51", // Darker shade on hover
  },
  errorMessage: {
    background: "#ff4d4d",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  footerText: {
    marginTop: "30px",
    fontSize: "14px",
  },
  newUserText: {
    color: "#666",
  },
  signupLink: {
    color: "#FF6F61", // Matching color to the buttons
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
