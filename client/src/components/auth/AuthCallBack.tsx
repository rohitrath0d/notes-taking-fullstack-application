/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AuthCallBack() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      try {
        const code = searchParams.get("code");
        const type = searchParams.get("type");
        
        if (!code || !type) {
          throw new Error("Invalid callback parameters");
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/googleauth/exchange-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to exchange code for token");
        }
        
        // Store token and user data
        localStorage.setItem("token", data.token);
        
        // Redirect to dashboard
        toast.success("Login successful!");
        navigate("/dashboard");
        
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Authentication failed");
        toast.error("Authentication failed");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    
    exchangeCodeForToken();
  }, [searchParams, navigate]);

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
            onClick={() => navigate("/login")}
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