import { Toaster } from "sonner"
// react-router-dom setup
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import SignupPage from "./pages/SignUpPage";
// import LoginPage from "./pages/UnifiedLoginAndSignInPage";
import UnifiedLoginAndSignInPage from "./pages/UnifiedLoginAndSignInPage";
import DashboardPage from "./pages/DashboardPage";
import AuthCallBack from "./components/auth/AuthCallBack";

function App() {

  return (
    <>

      {/* <div className="text-center text-3xl font-bold text-amber-500 p-40"> Hello from vite frontend!!</div> */}

      <Toaster />
      {/* react touter dom setup */}
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/signup" />} /> */}
          {/* <Route path="/signup" element={<SignupPage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/" element={<Navigate to="/signup-or-login" />} />
          <Route path="/signup-or-login" element={<UnifiedLoginAndSignInPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/auth/callback" element={<AuthCallBack />} />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
