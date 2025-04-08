import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./Config"; // ✅ Import Firestore
import { doc, getDoc, setDoc } from "firebase/firestore"; // ✅ Import Firestore functions
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

function Home() {
  const [userName, setUserName] = useState("User");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [fileUrl, setFileUrl] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(""); 
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(`${userData.firstName} ${userData.lastName}`);
            setTranscript(userData.transcript || "No transcript available.");
            setSummary(userData.summary || "No summary available.");
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
      const fileType = selectedFile.type;
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
  
      // Check if the file type is either audio/mp3 or video/mp4
      if (
        (fileType === "audio/mp3" || fileExtension === "mp3") || 
        (fileType === "video/mp4" || fileExtension === "mp4")
      ) {
        setFile(selectedFile);
        setFileType(fileType.startsWith("audio") ? "Audio" : "Video");
        setUploadProgress(0);
        setIsUploadComplete(false);
      } else {
        alert("Please upload an MP3 or MP4 file only.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            const userRef = doc(db, "users", auth.currentUser.uid);
            setDoc(userRef, { fileUrl: downloadURL }, { merge: true })
              .then(() => {
                setFileUrl(downloadURL); 
                setIsUploadComplete(true); 
                setUploadProgress(100); 
              })
              .catch((error) => {
                console.error("Error saving URL to Firestore:", error);
                alert("Error saving URL to Firestore.");
              });
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            alert("Error getting download URL.");
          });
      }
    );
  };

  const Modal = ({ title, content, onClose }) => (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div style={styles.scrollableContent}>
          <p>{content}</p>
        </div>
        <button style={styles.modalCloseButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navLogo}>QuickRecap</div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate("/profile")}>Profile</button>
          <button style={styles.navButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.mainSection}>
        <div style={styles.welcomeText}>
          <h1 style={styles.title}>
            Welcome, <span style={styles.username}>{userName}</span>
          </h1>
        </div>

        <div style={styles.uploadSection}>
          <div style={styles.uploadRow}>
            <span style={styles.uploadLabel}>Upload File:</span>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              style={styles.input}
            />
            <div style={styles.progressWrapper}>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${uploadProgress}%`,
                    backgroundColor: isUploadComplete ? "#28a745" : "#007bff",
                  }}
                ></div>
              </div>
            </div>
            <button
              onClick={handleUpload}
              style={styles.uploadButton}
              disabled={!file}
            >
              Upload {fileType || "File"}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.additionalContainer}>
        <div style={styles.previewContainer}>
          <div style={styles.videoWrapper}>
            {fileUrl && fileType === "Video" ? (
              <video controls style={styles.video}>
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No video selected or uploaded yet.</p>
            )}
          </div>

          <div style={styles.buttonsWrapper}>
            <button
              style={styles.previewButton}
              onClick={() => setIsTranscriptModalOpen(true)}
            >
              Transcript
            </button>
            <button
              style={styles.previewButton}
              onClick={() => setIsSummaryModalOpen(true)}
            >
              Summary
            </button>
            <button
              style={styles.previewButton}
              onClick={() => setIsPersonalizeModalOpen(true)}
            >
              Personalize
            </button>
          </div>
        </div>
      </div>

      {isTranscriptModalOpen && (
        <Modal
          title="Transcript"
          content={transcript}
          onClose={() => setIsTranscriptModalOpen(false)}
        />
      )}
      {isSummaryModalOpen && (
        <Modal
          title="Summary"
          content={summary}
          onClose={() => setIsSummaryModalOpen(false)}
        />
      )}
      {isPersonalizeModalOpen && (
        <Modal
          title="Personalize"
          content="Coming soon..."
          onClose={() => setIsPersonalizeModalOpen(false)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECF0F1",  // Light grey background like the old page
    flexDirection: "column", // Ensures everything is stacked vertically
    gap: "20px", // Light grey background like the old page
    fontFamily: "'Roboto', sans-serif",
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#2c3e50", // Darker navbar background like the old page
    color: "#fff",
    zIndex: 10,
  },
  navLogo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#FF6F61",// White text for logo
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  navButton: {
    background: "#FF6F61", // Simpler button background
    color: "#fff",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  mainSection: {
    paddingTop: "120px", // Offset for the navbar
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto",
    background: "#fff",  // Solid white background, like the old page's form card
    padding: "30px",
    borderRadius: "8px",  // More compact border radius for a cleaner look
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
  },
  welcomeText: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000",
  },
  username: {
    color: "#000",
    fontWeight: "bold",
  },
  uploadSection: {
    display: "flex",
    alignItems: "center",  // Vertically align items
    justifyContent: "flex-start",  // Align items starting from the left
    width: "100%",  // Full width of the parent container
    gap: "20px",  // Add space between elements
  },
  uploadRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",  // Full width of the parent container
  },
  uploadLabel: {
    fontWeight: "600",
    color: "#333",
    marginRight: "10px",
    flex: 1,  // Make the label take up space on the left
  },
  input: {
    width: "200px",  // Smaller width for the file input
    padding: "8px 12px",  // Adjust padding to make the box more compact
    fontSize: "16px",  // Smaller font size for better alignment
    borderRadius: "6px",  // Slightly rounded corners
    border: "1px solid #ddd",  // Light border for input box
    outline: "none",  // Remove default outline
    flex: 2,  // Make the input take up more space than the label
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    background: "#FF6F61",  // Simplified button background
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
  },
  progressWrapper: {
    display: "flex",
    justifyContent: "center",  // Center the progress bar
    alignItems: "center",  // Vertically center the progress bar
    flex: 3,  // Give the progress bar more space than the button
    width: "auto",  // Auto adjust width based on the content (for centering)
  },
  progressBar: {
    width: "150px",  // Reduce the width of the progress bar
    height: "10px",
    backgroundColor: "#ddd",
    borderRadius: "5px",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007bff", // Default color while uploading
    borderRadius: "5px",
  },
  uploadButton: {
    padding: "8px 16px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "#FF6F61",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    flex: 1,  // Button takes up the remaining space
    textAlign: "center",  // Center text inside the button
  },
  additionalContainer: {
    display: "flex",
    flexDirection: "column", // Keep the overall section stacking vertically
    gap: "20px",  // Adds space between video preview and buttons
    backgroundColor: "rgba(255, 255, 255, 0.9)", // White background for the new container
    width: "90%",
    maxWidth: "800px",
    marginTop: "30px",  // Gap between containers
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  previewContainer: {
    display: "flex",
    width: "100%",  // Make the container take up full width
    justifyContent: "space-between", // Space out the video and buttons sections
    gap: "20px", // Spread video and buttons across the container
  },
  previewWrapper: {
    display: "flex",
    flexDirection: "row",  // Align video and buttons in a row
    alignItems: "flex-start",  // Align items at the start (top-aligned)
    justifyContent: "space-between",  // Ensures there's space between video and buttons
    width: "100%",
  },
  videoWrapper: {
    flex: "60%",  // 60% width for the video section
    display: "flex",
    justifyContent: "center",  // Center the video inside its container
    alignItems: "center",  // Space between video and buttons
  },
  video: {
    width: "80%",  // Make the video take up 80% of its container width
    height: "auto",  // Keep the aspect ratio intact
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  buttonsWrapper: {
    flex: "40%",  // 40% width for the buttons section
    display: "flex",
    flexDirection: "column",  // Stack buttons vertically
    justifyContent: "center",  // Center buttons vertically in the container
    gap: "10px",  // Space between buttons
    maxWidth: "200px",  // Set a max width to avoid stretching the buttons too wide
  },
  previewButton: {
    padding: "10px 20px",
    background: "#FF6F61",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(32, 5, 5, 0.2)",
    maxHeight: "80vh",
  },
  scrollableContent: {
    maxHeight: "60vh", // Height for the scrollable area
    overflowY: "auto", // Enable vertical scrolling
    marginBottom: "20px", // Space before the close button
  },
  modalCloseButton: {
    background: "#FF6F61",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Home;
