import { Routes, Route, Navigate, Link } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Logout from "./Logout.jsx";

function App() {
  return (
    <div>
      <h1>Firebase Auth</h1>
      
      {/* Navigation Menu */}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<h2>Welcome to QuickRecap</h2>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
