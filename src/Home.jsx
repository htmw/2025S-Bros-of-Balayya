import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./Config";

function Home() {
  const [userName, setUserName] = useState("User");
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || "User");
    }
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/login"));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "audio") {
      setAudioFile(file);
      setVideoFile(null);
    } else {
      setVideoFile(file);
      setAudioFile(null);
    }
  };

  const handleUpload = (type) => {
    const file = type === "audio" ? audioFile : videoFile;
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
        <h1 style={styles.title}>Welcome, <span style={styles.username}>{userName}</span>!</h1>
        <p style={styles.subtitle}>You’re logged in to QuickRecap.</p>

        <div style={styles.uploadSection}>
          <label style={styles.label}>🎙️ Upload Audio</label>
          <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, "audio")} style={styles.input} />
          <button onClick={() => handleUpload("audio")} style={styles.buttonBlue}>Upload Audio</button>

          <label style={styles.label}>🎥 Upload Video</label>
          <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, "video")} style={styles.input} />
          <button onClick={() => handleUpload("video")} style={styles.buttonGreen}>Upload Video</button>
        </div>

        {uploadProgress > 0 && (
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }}></div>
          </div>
        )}
        {uploadStatus && <p style={styles.status}>{uploadStatus}</p>}

        <button
          onClick={() => navigate("/output")}
          disabled={!audioFile && !videoFile}
          style={{ ...styles.buttonPurple, opacity: audioFile || videoFile ? 1 : 0.5, cursor: audioFile || videoFile ? "pointer" : "not-allowed" }}
        >
          Summarize
        </button>

        <button onClick={handleLogout} style={styles.buttonRed}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "linear-gradient(to right, #007bff, #6610f2)" },
  card: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", width: "400px", textAlign: "center" },
  title: { fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "10px" },
  username: { color: "#007bff" },
  subtitle: { color: "#666", marginBottom: "20px" },
  uploadSection: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "16px", fontWeight: "600", color: "#444" },
  input: { width: "100%", padding: "10px", fontSize: "14px", border: "1px solid #ddd", borderRadius: "6px" },
  buttonBlue: { background: "#007bff", color: "#fff", fontSize: "16px", padding: "10px", borderRadius: "6px", cursor: "pointer" },
  buttonGreen: { background: "#28a745", color: "#fff", fontSize: "16px", padding: "10px", borderRadius: "6px", cursor: "pointer" },
  buttonPurple: { background: "#6f42c1", color: "#fff", fontSize: "16px", padding: "10px", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
  buttonRed: { background: "#dc3545", color: "#fff", fontSize: "16px", padding: "10px", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
  progressBar: { width: "100%", background: "#ddd", borderRadius: "6px", height: "6px", marginTop: "10px" },
  progressFill: { height: "6px", background: "#28a745", borderRadius: "6px" },
  status: { marginTop: "10px", color: "#555", fontSize: "14px" }
};

export default Home;
