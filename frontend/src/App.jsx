import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserRoutes from "./routes/userRoutes.jsx"; // For regular users
import { ToastProvider } from "./context/ToastContext.jsx"; 
import "./index.css";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect, useState } from "react";

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false); 

  useEffect(() => {
    const fetchAuth = async () => {
      await checkAuth();  
      setAuthChecked(true); 
    };

    fetchAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  
  if (!authChecked) {
    return <div>Loading...</div>;  
  }

  return (
    <ToastProvider>
      <Router>
        <Routes>
          
          <Route path="/" element={<Navigate to={isAuthenticated ? "/user/home" : "/user/"} replace />} />
          <Route path="/user/*" element={<UserRoutes />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
