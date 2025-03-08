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
    width: "100%",  // Ensures alignment
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
    width: "calc(100% - 24px)",  // Makes input align perfectly within the box
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
  successMessage: {
    background: "#28a745",
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
  link: {
    color: "#4B0082",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Signup;
