import { useNavigate } from "react-router-dom";
import { FaUpload, FaRegFileAudio, FaRegLightbulb } from "react-icons/fa";

function FrontPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>QuickRecap</h1>
        <p style={styles.subtitle}>Transform your media into personalized, concise summaries.</p>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <FaUpload style={styles.icon} />
          <h2 style={styles.featureTitle}>Upload Your Media</h2>
          <p style={styles.featureText}>
            Easily upload audio or video files. No complicated setup, just upload!
          </p>
        </div>

        <div style={styles.featureCard}>
          <FaRegFileAudio style={styles.icon} />
          <h2 style={styles.featureTitle}>Automatic Transcription</h2>
          <p style={styles.featureText}>
            Our technology transcribes your media content into text quickly and accurately.
          </p>
        </div>

        <div style={styles.featureCard}>
          <FaRegLightbulb style={styles.icon} />
          <h2 style={styles.featureTitle}>Personalized Summaries</h2>
          <p style={styles.featureText}>
            Get concise, tailored summaries based on your preferences and interests.
          </p>
        </div>
      </div>

      <div style={styles.ctaContainer}>
        <button onClick={() => navigate("/login")} style={styles.ctaButton}>Login</button>
        <button onClick={() => navigate("/signup")} style={styles.ctaButton}>Sign Up</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECF0F1",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "1200px",
  },
  title: {
    fontSize: "56px",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "15px",
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  subtitle: {
    fontSize: "20px",
    color: "#7f8c8d",
    fontWeight: "500",
    lineHeight: "1.6", // Softer background to enhance text readability
    padding: "10px 20px",
  },
  features: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "1200px",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  featureCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    width: "300px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  icon: {
    fontSize: "40px",
    color: "#1F8DD6",
    marginBottom: "15px",
  },
  featureTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#FF6F61",
    marginBottom: "10px",
  },
  featureText: {
    fontSize: "16px",
    color: "#34495e",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  ctaContainer: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  ctaButton: {
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "30px",
    border: "none",
    background: "#FF6F61",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    boxShadow: "0 6px 15px rgba(0, 123, 255, 0.2)",
  },
};

export default FrontPage;
