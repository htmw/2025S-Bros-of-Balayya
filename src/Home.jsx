import { auth, storage } from "./Config"; // Import Firebase storage
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Home() {
  const [userName, setUserName] = useState("");
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
    auth.signOut();
    navigate("/");
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "audio") {
      setAudioFile(file);
      setVideoFile(null); // Ensure only one file is uploaded
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

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setUploadStatus("Upload failed. Try again.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadStatus("Upload successful!");
        console.log("File available at:", downloadURL);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, <span className="text-blue-600">{userName}</span>!
        </h1>
        <p className="text-gray-500 mb-6">You’re logged in to QuickRecap.</p>

        {/* Upload Section */}
        <div className="space-y-4">
          {/* Audio Upload */}
          <label className="block text-lg font-medium text-gray-700">🎙️ Upload Audio</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileChange(e, "audio")}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
          />
          <button
            onClick={() => handleUpload("audio")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Upload Audio
          </button>

          {/* Video Upload */}
          <label className="block text-lg font-medium text-gray-700">🎥 Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
          />
          <button
            onClick={() => handleUpload("video")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Upload Video
          </button>
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        {uploadStatus && <p className="text-gray-600 mt-2">{uploadStatus}</p>}

        {/* Summarize Button */}
        <button
          onClick={() => navigate("/output")}
          disabled={!audioFile && !videoFile}
          className={`w-full mt-4 py-2 rounded-lg font-semibold transition duration-300 ${
            audioFile || videoFile
              ? "bg-purple-500 hover:bg-purple-600 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Summarize
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
