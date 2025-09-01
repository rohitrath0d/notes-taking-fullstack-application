// react-router-dom setup
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "../pages/SignUpPage";
// import LoginPage from "../pages/LoginPage";
// import DashboardPage from "../pages/DashboardPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}