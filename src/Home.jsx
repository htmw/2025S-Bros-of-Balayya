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
  const [isUploadComplete, setIsUploadComplete] = useState(false); // Track if upload is complete
  const [fileUrl, setFileUrl] = useState(""); // To store the uploaded file's URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(""); // Store the summary data
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false); // Control transcript modal visibility
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {


          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            setUserName(`${userData.firstName} ${userData.lastName}`);
            if (userData.transcript) {
              setTranscript(userData.transcript); // Set the transcript if it exists
            } else {
              setTranscript("No transcript available."); // If no transcript is found
            }
            if (userData.summary) {
              setSummary(userData.summary); // Set the summary if it exists
            } else {
              setSummary("No summary available.");
            }

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
      setUploadProgress(0); // Reset progress when a new file is selected
      setIsUploadComplete(false); // Reset upload completion flag
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
        // Track progress

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {

        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      },
      () => {
        // Once the upload is complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            const userRef = doc(db, "users", auth.currentUser.uid);
            setDoc(userRef, { fileUrl: downloadURL }, { merge: true })
              .then(() => {
                setFileUrl(downloadURL); // Store the URL of the uploaded file
                setIsUploadComplete(true); // Set upload completion flag
                setUploadProgress(100); // Ensure progress bar fills completely
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

  const Modal = ({ title, content, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2>{title}</h2>
          {/* Scrollable area for the content */}
          <div style={styles.scrollableContent}>
            <p>{content}</p>
          </div>
          <button style={styles.modalCloseButton} onClick={onClose}>Close</button>
        </div>
      </div>

    );
  };

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <div style={styles.navLogo}>QuickRecap</div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div style={styles.mainSection}>
        <div style={styles.welcomeText}>
          <h1 style={styles.title}>
            Welcome, <span style={styles.username}>{userName}</span>
          </h1>
        </div>

        <div style={styles.uploadSection}>
          {/* "Upload File" Text, File Selector, and Upload Button in a Single Row */}
          <div style={styles.uploadRow}>
            <span style={styles.uploadLabel}>Upload File:</span>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              style={styles.input}
            />
            {/* Progress bar */}
            <div style={styles.progressWrapper}>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${uploadProgress}%`, // Set the width dynamically based on progress
                    backgroundColor: isUploadComplete ? "#28a745" : "#007bff", // Green when upload is complete
                  }}
                ></div>
              </div>
            </div>
            {/* Upload Button */}
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

      {/* New White Container Below */}
      <div style={styles.additionalContainer}>
        <div style={styles.previewContainer}>
          {/* Left: Video Preview */}
          <div style={styles.videoWrapper}>
            {fileUrl && fileType === "Video" ? (
              <video controls style={styles.video}>
                <source src={fileUrl} type={fileType === "Video" ? "video/mp4" : ""} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No video selected or uploaded yet.</p>
            )}
          </div>


          {/* Right: Two Buttons Stacked */}
          <div style={styles.buttonsWrapper}>
          <button
            style={styles.previewButton}
            onClick={() => setIsTranscriptModalOpen(true)} // Open transcript modal on click
          >
            Transcript
          </button>
          <button
            style={styles.previewButton}
            onClick={() => setIsSummaryModalOpen(true)} // Open summary modal on click
          >
            Summary
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
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    backgroundImage:
      "url('https://t3.ftcdn.net/jpg/05/61/61/36/360_F_561613631_mVmmaQn83oibz1ZzIiOfGBFv7CUp3ucw.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",  // Reduced padding to make it smaller
 // Transparent cyan background with some opacity
    color: "#fff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",  // Optional: Keep the box shadow for visibility
    zIndex: 10,
    backdropFilter: "blur(5px)",
  },
  navLogo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000", 
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  navButton: {
    background: "rgba(12, 12, 236, 0.93)",  // Semi-transparent background for buttons
    color: "white",  // Fluorescent green color for button text
    padding: "8px 16px",  // Reduced padding for smaller buttons
    fontSize: "14px",  // Smaller font size for the button
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  mainSection: {
    paddingTop: "120px", // Increased offset for the fixed navbar
    width: "90%",
    maxWidth: "800px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(5px)",

    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)"
  },
  welcomeText: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
  },
  username: {
    color: "#007bff",
    fontWeight: "bold",
  },
  uploadSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  uploadRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  uploadLabel: {
    fontWeight: "600",
    color: "#333",
    marginRight: "10px",
  },
  input: {
    width: "150px",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
  },
  progressWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    marginRight: "15px",
  },
  progressBar: {
    width: "100%",
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
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  additionalContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",  // White background for the new container
    width: "90%",
    maxWidth: "800px",
    marginTop: "30px",  // Gap between containers
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    height: "auto",
  },
  previewContainer: {
    display: "flex",
    justifyContent: "space-between", // Left for video, right for buttons
    alignItems: "center",
  },
  videoWrapper: {
    flex: 1,
    marginRight: "20px",
  },
  video: {
    width: "60%", // Make the video smaller by setting width to 80% of its container
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  buttonsWrapper: {
    display: "flex",
    flexDirection: "column", // Stack buttons vertically
    gap: "10px", // Space between buttons
  },
  previewButton: {
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    maxHeight: "80vh",
  },
  scrollableContent: {
    maxHeight: "60vh", // Height for the scrollable area
    overflowY: "auto", // Enable vertical scrolling
    marginBottom: "20px", // Space before the close button
  },
  modalCloseButton: {
    background: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Home;
