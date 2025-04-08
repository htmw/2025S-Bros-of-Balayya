import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./Config";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (Object.values(formData).some((field) => !field)) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date(),
      });

      setSuccessMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>QuickRecap</h1>
        <p style={styles.subtitle}>Create an Account</p>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

        {/* Input Fields */}
        {["firstName", "lastName", "email", "password", "confirmPassword"].map((field, index) => (
          <div key={index} style={styles.inputContainer}>
            <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              value={formData[field]}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
        ))}

        {/* Signup Button */}
        <button onClick={handleSignup} style={styles.button} disabled={loading}>
          {loading ? "Signing Up..." : "Signup"}
        </button>

        {/* Login Redirect */}
        <p style={styles.footerText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>Login</span>
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
    backgroundColor: "#ECF0F1", // Softer background color
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px", // Slightly wider for better readability
    textAlign: "center",
    border: "1px solid #ddd",
  },
  title: {
    fontSize: "36px", // Larger font for the title
    fontWeight: "700", // Bold for emphasis
    color: "#2c3e50", // Dark color for title
    marginBottom: "16px", // More spacing from the top
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for title
  },
  subtitle: {
    fontSize: "18px",
    color: "#7f8c8d", // Softer subtitle color
    marginBottom: "30px", // More breathing space between subtitle and inputs
  },
  inputContainer: {
    width: "100%",
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    color: "#34495e", // Softer grey for labels
    fontWeight: "600",
    marginBottom: "8px", // More space below the label
    display: "block",
    fontSize: "14px",
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
    background: "#FF6F61", // Use the main theme color here
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
  },
  buttonHover: {
    background: "#FF3B2A", // Darker shade on hover
  },
  errorMessage: {
    background: "#FF4D4D",
    color: "#fff",
    padding: "12px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  successMessage: {
    background: "#28a745",
    color: "#fff",
    padding: "12px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    fontWeight: "600", // Stronger emphasis on the link
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Signup;
