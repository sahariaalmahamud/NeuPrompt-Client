"use client";

import { useState, Suspense } from "react";
import { Card, Button, Label, Spinner } from "@heroui/react";
import { Eye, EyeSlash, Person, At, ShieldKeyhole, Picture, Compass, Check } from "@gravity-ui/icons";
import { authClient, signUp } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import * as motion from "motion/react-client";
import Link from "next/link";

// Premium Google SVG Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [image, setImage] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setIsUploadingImage(true);

    const body = new FormData();
    body.append("image", file);

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_UPLOAD_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body });
      const data = await res.json();

      if (data.success) {
        setImage(data.data.url);
      } else {
        setError("Upload failed: " + data.error.message);
      }
    } catch {
      setError("An error occurred while uploading the image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please upload an avatar image to create your account.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: authError } = await signUp.email({ email, password, name, role, image });
      if (!authError) {
        // Direct routing based on Role
        router.push(role === "creator" ? "/" : "/prompts");
      } else {
        setError(authError.message || "Something went wrong during signup.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/auth/onboarding", // Force redirection to onboarding to check role
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4 py-12 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <Card className="w-full p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 bg-[#0a0a0c]/80 backdrop-blur-2xl rounded-[32px]">
          
          <div className="flex flex-col items-center justify-center gap-2 pb-8 border-b border-white/5 mb-8 text-center relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">Create an account</h1>
            <p className="text-sm text-zinc-400">Join the ultimate AI prompt ecosystem.</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            
            {/* AVATAR UPLOAD */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className={`relative group w-20 h-20 rounded-full border border-dashed transition-all duration-300 shadow-inner flex items-center justify-center overflow-hidden bg-[#030303] ${!image && error ? 'border-red-500/50' : 'border-white/20 hover:border-blue-500/50'}`}>
                {image ? <img src={image} alt="Preview" className="w-full h-full object-cover" /> : <Picture className="text-zinc-500 group-hover:text-blue-400 transition-colors" size={24} />}
                {isUploadingImage && <div className="absolute inset-0 bg-[#030303]/80 backdrop-blur-sm flex items-center justify-center z-10"><Spinner size="sm" color="white" /></div>}
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={handleFileUpload} disabled={isUploadingImage} />
              </div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest font-mono">
                {image ? "Change Avatar" : "Upload Avatar"} <span className="text-red-500">*</span>
              </p>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-zinc-300 ml-1">Name <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-1 bg-[#030303] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
                <Person className="text-zinc-500" size={18} />
                <input required type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-white placeholder:text-zinc-600" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-zinc-300 ml-1">Email <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-1 bg-[#030303] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
                <At className="text-zinc-500" size={18} />
                <input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-white placeholder:text-zinc-600" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-zinc-300 ml-1">Password <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-1 bg-[#030303] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
                <ShieldKeyhole className="text-zinc-500" size={18} />
                <input required type={isVisible ? "text" : "password"} placeholder="Secure password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-white placeholder:text-zinc-600" />
                <button type="button" onClick={toggleVisibility} className="focus:outline-none text-zinc-500 hover:text-zinc-300 transition-colors">
                  {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Premium Role Selection Cards */}
            <div className="flex flex-col gap-3 mt-2">
              <Label className="text-sm font-medium text-zinc-300 ml-1">Account Type <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => setRole("user")} className={`cursor-pointer relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${role === "user" ? "bg-blue-500/10 border-blue-500" : "bg-[#030303] border-white/10 hover:border-white/30"}`}>
                  <Compass size={20} className={role === "user" ? "text-blue-400" : "text-zinc-500"} />
                  <span className={`text-sm font-bold ${role === "user" ? "text-white" : "text-zinc-400"}`}>User / Buyer</span>
                </div>
                <div onClick={() => setRole("creator")} className={`cursor-pointer relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${role === "creator" ? "bg-purple-500/10 border-purple-500" : "bg-[#030303] border-white/10 hover:border-white/30"}`}>
                  <Person size={20} className={role === "creator" ? "text-purple-400" : "text-zinc-500"} />
                  <span className={`text-sm font-bold ${role === "creator" ? "text-white" : "text-zinc-400"}`}>Creator</span>
                </div>
              </div>
            </div>

            {error && <div className="px-4 py-3 text-sm font-medium rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">{error}</div>}

            <Button type="submit" isLoading={isLoading} isDisabled={isLoading || isUploadingImage} className="w-full font-semibold rounded-2xl text-sm h-12 bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:bg-blue-500 transition-all border border-blue-500/50 mt-2">
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">or sign up with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Premium Google Button */}
          <Button 
            onClick={handleGoogleSignUp} 
            isLoading={isGoogleLoading}
            className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            {!isGoogleLoading && <GoogleIcon />}
            Google
          </Button>

          <div className="text-center pt-8 border-t border-white/5 mt-8 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href={`/auth/signin?redirect=${redirectTo}`} className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </div>

        </Card>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#030303]">
        <Spinner size="lg" color="white" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}