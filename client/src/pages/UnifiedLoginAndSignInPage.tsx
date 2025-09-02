/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import LoginAnimation from "../components/animations/LoginAnimation";
import { API_BASE_URL } from "../lib/api";

// Create different schemas for different steps
const emailSchema = z.object({
  email: z.string().email("Invalid email"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const passwordSchema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = {
  email: string;
  otp?: string;
  password?: string;
  name?: string;
};

export default function UnifiedLoginAndSignInPage() {
  const [step, setStep] = useState<"initial" | "otp" | "password">("initial");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginForm>({
    defaultValues: { email: "", otp: "", password: "", name: "" },
  });

  // Request OTP
  const requestOtp = async (data: LoginForm) => {
    try {
      setLoading(true);
      setEmail(data.email);

      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/request-otp`, {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to send OTP");

      toast.success("OTP sent!", { description: "Check your email for the OTP." });
      setStep("otp");
      setMode(result.mode || "signup");
    } catch (err: any) {
      toast.error("Error", { description: err.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP only
  const verifyOtp = async (data: LoginForm) => {
    try {
      setLoading(true);

      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "OTP verification failed");

      toast.success("OTP verified!", { description: "You can now continue." });

      if (result.mode === "login") {
        // For login, we need to ask for password
        setStep("password");
      } else {
        // For signup, we need to ask for name and password
        setStep("password");
      }
      setMode(result.mode);
    } catch (err: any) {
      toast.error("Error", { description: err.message || "OTP verification failed" });
    } finally {
      setLoading(false);
    }
  };

  // Complete signup or login
  const completeSignupOrLogin = async (data: LoginForm) => {
    try {
      setLoading(true);

      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/complete`, {
      const res = await fetch(`${API_BASE_URL}/api/auth/unified-signup-or-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: data.name,
          password: data.password,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login/Signup failed");

      toast.success("Success!", { description: "Logged in successfully!" });
      localStorage.setItem("token", result.token);

      // Reset form and state
      form.reset();
      setStep("initial");

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error("Error", { description: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission based on current step
  const onSubmit = (data: LoginForm) => {
    if (step === "initial") {
      requestOtp(data);
    } else if (step === "otp") {
      verifyOtp(data);
    } else if (step === "password") {
      completeSignupOrLogin(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-xl">
        {/* Left - Lottie animation */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 w-1/2 p-8 rounded-2xl  ml-5">
          {/* <div className="w-full h-80"> */}
          <LoginAnimation />
          {/* </div> */}
        </div>

        {/* Right - Form */}
        <CardContent className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-6">Sign in to your account</p>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full flex items-center justify-center gap-2 py-5 border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => (window.location.href = `${API_BASE_URL}/api/googleauth/google`)}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Local login flow */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === "initial" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="py-5 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : "Get OTP"}
                </Button>
              </>
            )}

            {step === "otp" && (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600">We sent a code to</p>
                  <p className="font-medium text-gray-800">{email}</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Verification code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="py-5 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-center tracking-widest font-mono"
                    maxLength={6}
                    {...form.register("otp")}
                  />
                  {form.formState.errors.otp && (
                    <p className="text-red-500 text-sm">{form.formState.errors.otp.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : "Verify OTP"}
                </Button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => setStep("initial")}
                  >
                    Change email
                  </button>
                </div>
              </>
            )}

            {step === "password" && (
              <>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mb-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <p className="text-green-600 font-medium">OTP verified successfully</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {mode === "signup"
                      ? "Please create your account"
                      : "Please enter your password to login"}
                  </p>
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="py-5 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {mode === "signup" ? "Create Password" : "Password"}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                    className="py-5 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === "signup" ? "Creating Account..." : "Logging in..."}
                    </span>
                  ) : mode === "signup" ? "Create Account" : "Login"}
                </Button>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {step === "initial" && (
                <>Don't have an account? You'll be automatically signed up</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}