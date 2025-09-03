/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "../../lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthCookie = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/googleauth/check`, {
          method: "GET",
          // Authorization: `Bearer ${localStorage.getItem("token") || ""}`,

          // headers: {
          //   // "Authorization": `Bearer ${token}`,
          //   "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
          // },

          credentials: 'include' // Important for sending cookies
        });

        if (response.ok) {
          const data = await response.json();

          if (data.token) {
            // Move token from cookie to localStorage for API requests
            localStorage.setItem("token", data.token);

            // Store user data if needed
            if (data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
            }

            toast.success("Login successful!");
            navigate("/dashboard");
          } else {
            throw new Error("No token received");
          }
        } else {
          throw new Error("Authentication check failed");
        }
      } catch (err: any) {
        console.error("Auth check error:", err);
        setError(err.message || "Authentication failed");
        toast.error("Authentication failed");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthCookie();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3">Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          <p>Authentication Error: {error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}