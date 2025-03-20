import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserRoutes from "./routes/userRoutes.jsx"; // For regular users
import { ToastProvider } from "./context/ToastContext.jsx"; 
import "./index.css";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect, useState } from "react";
import { useSocketStore } from "./store/useSocketStore.js";

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false); 

  const { connectSocket } = useSocketStore();

  useEffect(() => {
    connectSocket();
  }
  , []);

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

  
  // if (!authChecked) {
  //   return <div>Loading...</div>;  
  // }

  return (
    <ToastProvider>
      <Router>
        <Routes>
          
          {/* <Route path="/" element={<Navigate to={isAuthenticated ? "/user/home" : "/user/"} replace />} /> */}
          <Route path="/" element={<Navigate to="/user/create"/>} />
          <Route path="/user/*" element={<UserRoutes />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
