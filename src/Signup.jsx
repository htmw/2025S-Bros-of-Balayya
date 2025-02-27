import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./Config"; // ✅ Import Firebase instances
import { createUserWithEmailAndPassword } from "firebase/auth"; // ✅ Import Firebase auth function

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
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    specialChar: false,
    uppercase: false,
  });
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (password) => {
    setFormData({ ...formData, password });
    setPasswordStrength({
      length: password.length >= 8,
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  };

  const handleSignup = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (Object.values(formData).some((field) => !field)) {
      setError("All fields are mandatory.");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!Object.values(passwordStrength).every(Boolean)) {
      setError("Password must meet all strength requirements.");
      setLoading(false);
      return;
    }

    try {
      console.log("Starting signup process...");
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("User created:", user.uid);

      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date(),
      });
      console.log("User data stored in Firestore.");

      setSuccessMessage("Signup successful! Redirecting...");
      setLoading(false);

      // ✅ Redirect to login destination (same as login redirection)
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Signup error:", error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={styles.title}>QuickRecap</h1>
        <p style={styles.subtitle}>Create an account</p>

        {error && <div style={styles.errorPopup}>{error}</div>}
        {successMessage && <div style={styles.successPopup}>{successMessage}</div>}

        {["firstName", "lastName", "email", "password", "confirmPassword"].map((field, index) => (
          <div key={index}>
            <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={field === "password" ? (e) => { handlePasswordChange(e.target.value); setShowPasswordRules(true); } : handleInputChange}
              style={styles.input}
            />
          </div>
        ))}

        {showPasswordRules && (
          <div style={styles.passwordRules}>
            {Object.entries(passwordStrength).map(([rule, isValid], idx) => (
              <p key={idx} style={isValid ? styles.validRule : styles.invalidRule}>
                ✔ {rule.charAt(0).toUpperCase() + rule.slice(1).replace(/([A-Z])/g, ' $1')}
              </p>
            ))}
          </div>
        )}

        <button onClick={handleSignup} style={styles.button} disabled={loading}>
          {loading ? "Signing Up..." : "Signup"}
        </button>
        <p style={styles.footerText}>
          Already have an account? <span style={styles.link} onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "grey",
    padding: "20px",
  },
  formBox: {
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
    width: "350px",
    textAlign: "center",
    color: "white",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#A9A9A9",
    marginBottom: "20px",
  },
  label: {
    textAlign: "left",
    display: "block",
    marginTop: "10px",
    fontSize: "14px",
    color: "#D3D3D3",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#2c2c2c",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    color: "white",
    cursor: "pointer",
    marginTop: "15px",
  },
  passwordRules: {
    textAlign: "left",
    marginTop: "10px",
    fontSize: "12px",
  },
  validRule: { color: "#4CAF50" },
  invalidRule: { color: "#FF4D4D" },
  footerText: {
    marginTop: "15px",
    color: "#A9A9A9",
  },
  link: {
    color: "#32CD32",
    cursor: "pointer",
    fontWeight: "bold",
  },
  errorPopup: {
    background: "#ff4d4d",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  successPopup: {
    background: "#4CAF50",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
};

export default Signup;
