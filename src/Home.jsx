import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./Config"; // ✅ Import Firestore
import { doc, getDoc } from "firebase/firestore"; // ✅ Import Firestore functions

function Home() {
  const [userName, setUserName] = useState("User");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          // 🔥 Fetch user's Firestore document using UID
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(`${userData.firstName} ${userData.lastName}`); // ✅ Set full name
          } else {
            console.log("No user data found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/login"));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type.startsWith("audio") ? "Audio" : "Video");
      setUploadStatus("");
    }
  };

  const handleUpload = () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setUploadStatus("Uploading...");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("Upload successful!");
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>QuickRecap</h1>
        <p style={styles.subtitle}>Welcome, <span style={styles.username}>{userName}</span>!</p>

        {/* File Upload */}
        <div style={styles.inputContainer}>
          <label style={styles.label}>Upload Audio or Video:</label>
          <input type="file" accept="audio/*,video/*" onChange={handleFileChange} style={styles.input} />
        </div>

        {file && (
          <p style={styles.fileInfo}>
            Selected: <strong>{file.name}</strong> ({fileType})
          </p>
        )}

        {/* Upload Button */}
        <button onClick={handleUpload} style={styles.button} disabled={!file}>
          Upload {fileType || "File"}
        </button>

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }}></div>
          </div>
        )}

        {uploadStatus && <p style={styles.status}>{uploadStatus}</p>}

        {/* Summarize Button */}
        <button
          onClick={() => navigate("/output")}
          style={{ ...styles.summarizeButton, opacity: file ? 1 : 0.5 }}
          disabled={!file}
        >
          Summarize
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
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
    background: "rgba(255, 255, 255, 0.9)", // Solid white with slight transparency
    backdropFilter: "blur(5px)", // Light blur effect for a modern touch
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
  username: {
    color: "#007bff",
    fontWeight: "bold",
  },
  inputContainer: {
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
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border 0.3s",
  },
  fileInfo: { fontSize: "14px", color: "#555", marginBottom: "10px" },
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
    marginBottom: "10px",
  },
  summarizeButton: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    background: "#6f42c1",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
    marginBottom: "10px",
  },
  logoutButton: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    background: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  progressBar: {
    width: "100%",
    background: "#ddd",
    borderRadius: "6px",
    height: "6px",
    marginTop: "10px",
  },
  progressFill: { height: "6px", background: "#28a745", borderRadius: "6px" },
  status: { marginTop: "10px", color: "#555", fontSize: "14px" },
};

export default Home;
