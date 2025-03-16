import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import AdminRoutes from "./routes/AdminRoutes.jsx";
import UserRoutes from "./routes/userRoutes.jsx"; // For regular users
import { ToastProvider } from "./context/ToastContext.jsx"; 
import "./index.css";
import { io } from "socket.io-client";
import { useEffect } from "react";


function App() {


  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Redirect root path */}
          <Route path="/" element={<Navigate to="/user/home" replace />} />    
          {/* Admin routes */}
          {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}

          {/* User routes */}
          <Route path="/user/*" element={<UserRoutes />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
