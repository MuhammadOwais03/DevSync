import { Routes, Route } from "react-router-dom";
import UserHome from "../pages/user/userHome.jsx";
import AuthForm from "../pages/user/AuthForm.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Create from "../pages/user/Create.jsx";

// import NotFound from "../pages/NotFound.jsx"; 

function UserRoutes() {

  

  return (
    <Routes>
      
      <Route path="home" element={<UserHome />} />
      <Route path="create" element={<Create />} />
      <Route path="/" element={<AuthForm />} />
    </Routes>
  );
}

export default UserRoutes;
