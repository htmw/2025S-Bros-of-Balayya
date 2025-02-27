import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    specialChar: false,
    uppercase: false,
  });

  const navigate = useNavigate();

  // Password validation function
  const handlePasswordChange = (password) => {
    setPassword(password);
    setPasswordStrength({
      length: password.length >= 8,
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!Object.values(passwordStrength).every((v) => v)) {
      setError("Password must meet all strength requirements.");
      return;
    }

    // Simulating successful signup
    setSuccessMessage("Signup successful! Redirecting...");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={styles.title}>QuickRecap</h1>
        <p style={styles.subtitle}>Create an account</p>

        {error && <div style={styles.errorPopup}>{error}</div>}
        {successMessage && <div style={styles.successPopup}>{successMessage}</div>}

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          style={styles.input}
        />

        {/* Password Strength Validation */}
        <div style={styles.passwordRules}>
          <p style={passwordStrength.length ? styles.validRule : styles.invalidRule}>
            ✔ At least 8 characters
          </p>
          <p style={passwordStrength.number ? styles.validRule : styles.invalidRule}>
            ✔ Contains a number
          </p>
          <p style={passwordStrength.specialChar ? styles.validRule : styles.invalidRule}>
            ✔ Contains a special character
          </p>
          <p style={passwordStrength.uppercase ? styles.validRule : styles.invalidRule}>
            ✔ Contains an uppercase letter
          </p>
        </div>

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSignup} style={styles.button}>
          Signup
        </button>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

// CSS-in-JS Styling
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(to right, #4a90e2, #9013fe)",
  },
  formBox: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: "16px",
    color: "#777",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  footerText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555",
  },
  link: {
    color: "#4a90e2",
    cursor: "pointer",
    textDecoration: "underline",
  },
  passwordRules: {
    textAlign: "left",
    marginBottom: "10px",
    fontSize: "14px",
  },
  validRule: {
    color: "green",
  },
  invalidRule: {
    color: "red",
  },
  errorPopup: {
    backgroundColor: "#ff4d4d",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  successPopup: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
};

export default Signup;
