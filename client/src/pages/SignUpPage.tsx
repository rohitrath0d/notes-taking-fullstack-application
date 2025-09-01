/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SignupPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
// import { useToast } from "../components/ui/use-toast";
import { toast } from "sonner"

import { FcGoogle } from "react-icons/fc";
import LoginAnimation from "../components/animations/LoginAnimation";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  // const { toast } = useToast();
  const [step, setStep] = useState<"initial" | "otp" | "password">("initial");
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", otp: "", password: "" },
  });

  const requestOtp = async (data: SignupForm) => {
    try {
      setLoading(true);
      setEmail(data.email);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email }),
      });
      if (!res.ok) throw new Error("Failed to request OTP");
      // toast({ title: "OTP sent!", description: `Check your email for the OTP.` });
      toast(
        //  { title: "OTP sent!",
        "OTP sent!", {
        // description: "Sunday, December 03, 2023 at 9:00 AM",
        description: `Check your email for the OTP.`,
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      })
      setStep("otp");
    } catch (err: any) {
      // toast({ variant: "destructive", title: "Error", description: err.message });
      toast("Error", {
        description: err.message,
      })
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data: SignupForm) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: data.otp }),
      });
      if (!res.ok) throw new Error("Invalid OTP");
      // toast({ title: "Email verified!", description: "OTP verified successfully" });
      toast("Email verified!", {
        description: "OTP verified successfully",
      });
      setOtpVerified(true);
      setStep("password");
    } catch (err: any) {
      // toast({ variant: "destructive", title: "Error", description: err.message });
      toast("Error", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const completeSignup = async (data: SignupForm) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: data.password }),
      });
      if (!res.ok) throw new Error("Signup failed");
      // toast({ title: "Success!", description: "Account created successfully!" });
      toast("Success!", {
        description: "Account created successfully!",
      });
      form.reset();
      setStep("initial");
      setOtpVerified(false);
    } catch (err: any) {
      // toast({ variant: "destructive", title: "Error", description: err.message });
      toast("Error", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-lg">
        {/* Left - Video animation */}
        {/* <div className="hidden lg:flex items-center justify-center bg-muted w-full lg:w-1/2">
          <video
            src="/animations/signup.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div> */}

        <div className="hidden lg:flex items-center justify-center bg-muted w-1/2 rounded-2xl p-5 ml-5 ">
          <LoginAnimation />
        </div>

        {/* Right - Form */}
        <CardContent className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full flex items-center justify-center gap-2"
            onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/api/googleauth/google`)}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <div className="text-center my-4 text-sm text-muted-foreground">OR</div>

          {/* Local Signup Flow */}
          {step === "initial" && (
            <form onSubmit={form.handleSubmit(requestOtp)} className="space-y-4">
              <Input placeholder="Full Name" {...form.register("name")} />
              <Input type="email" placeholder="Email" {...form.register("email")} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending OTP..." : "Get OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={form.handleSubmit(verifyOtp)} className="space-y-4">
              <Input placeholder="Enter OTP" {...form.register("otp")} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {step === "password" && otpVerified && (
            <form onSubmit={form.handleSubmit(completeSignup)} className="space-y-4">
              <div className="text-green-600 text-sm font-medium">✅ Email verified successfully</div>
              <Input type="password" placeholder="Set Password" {...form.register("password")} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Completing..." : "Complete Signup"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
