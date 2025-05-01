import { useEffect, useState } from "react";
import { auth, db } from "./Config"; // Firebase config
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Profile() {
  const [userName, setUserName] = useState({ firstName: "", lastName: "" });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName({ firstName: userData.firstName, lastName: userData.lastName });
            setEmail(auth.currentUser.email);
            setRole(userData.role || ""); // Email is directly from the auth object
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserName(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value); // Update role when the user changes the dropdown
  };

  const handleSaveChanges = async () => {
    if (!userName.firstName || !userName.lastName) {
      setErrorMessage("Please fill in both first and last name.");
      return;
    }

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { firstName: userName.firstName, lastName: userName.lastName, role: role }, { merge: true });
      setIsEditing(false); // Exit editing mode after save
      setErrorMessage(""); // Clear error message
    } catch (error) {
      setErrorMessage("Error updating user data.");
      console.error("Error updating user data:", error);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login"); // Navigate to login page after logout
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navLogo}>QuickRecap</div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate("/")}>Home</button>
          <button style={styles.navButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.profileSection}>
        <h2>Profile</h2>
        <div style={styles.profileInfo}>
          <div style={styles.profileRow}>
            <span style={styles.profileLabel}>First Name:</span>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={userName.firstName}
                onChange={handleInputChange}
                style={styles.input}
              />
            ) : (
              <span>{userName.firstName}</span>
            )}
          </div>

          <div style={styles.profileRow}>
            <span style={styles.profileLabel}>Last Name:</span>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={userName.lastName}
                onChange={handleInputChange}
                style={styles.input}
              />
            ) : (
              <span>{userName.lastName}</span>
            )}
          </div>

          <div style={styles.profileRow}>
            <span style={styles.profileLabel}>Email:</span>
            <span>{email}</span>
          </div>

          <div style={styles.profileRow}>
            <span style={styles.profileLabel}>Role:</span>
            {isEditing ? (
              <select
                value={role}
                onChange={handleRoleChange}
                style={styles.input}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="teacher">Teacher</option>
                <option value="content-creator">Content Creator</option>
              </select>
            ) : (
              <span>{role || "Not set"}</span>
              )}
          </div>

          {isEditing ? (
            <div style={styles.buttonWrapper}>
              <button onClick={handleSaveChanges} style={styles.saveButton}>Save Changes</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} style={styles.editButton}>Edit</button>
          )}

          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        </div>
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
    backgroundColor: "#f9f9f9",
    flexDirection: "column",
    gap: "20px",
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
    backgroundColor: "#333",
    color: "#fff",
    zIndex: 10,
  },
  navLogo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  navButton: {
    background: "#007bff",
    color: "#fff",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  profileSection: {
    paddingTop: "120px", // Offset for the navbar
    width: "90%",
    maxWidth: "600px",
    margin: "0 auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  profileRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileLabel: {
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "60%",
    padding: "8px 12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
  },
  buttonWrapper: {
    marginTop: "20px",
  },
  saveButton: {
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  editButton: {
    padding: "10px 20px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  errorMessage: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
};

export default Profile;
