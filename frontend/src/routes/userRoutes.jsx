import { Routes, Route } from "react-router-dom";
import UserHome from "../pages/user/userHome.jsx";

// import NotFound from "../pages/NotFound.jsx"; 

function UserRoutes() {
  return (
    <Routes>
      <Route path="home" element={<UserHome />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default UserRoutes;
