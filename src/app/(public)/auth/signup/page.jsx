"use client";

import { useState, Suspense } from "react";
import { Card, Button, Input, Label, Radio, RadioGroup, Spinner } from "@heroui/react";
import { Eye, EyeSlash, Person, At, ShieldKeyhole, Picture } from "@gravity-ui/icons";
import { signUp } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import * as motion from "motion/react-client";
import Link from "next/link";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [image, setImage] = useState(""); // Stores uploaded image URL

  // UI States
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  // ----------------------------------------------------------------------
  // IMAGE UPLOAD LOGIC (ImgBB)
  // ----------------------------------------------------------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setIsUploadingImage(true);

    const body = new FormData();
    body.append("image", file);

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_UPLOAD_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body
      });
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

  // ----------------------------------------------------------------------
  // SIGNUP LOGIC
  // ----------------------------------------------------------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✨ NEW: Validate that the avatar image is provided before submitting
    if (!image) {
      setError("Please upload an avatar image to create your account.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await signUp.email({
        email,
        password,
        name,
        role,
        image,
      });

      if (!authError) {
        router.push(redirectTo);
      } else {
        setError(authError.message || "Something went wrong during signup.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4 py-12 font-sans relative overflow-hidden">

      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 bg-[#0a0a0c]/80 backdrop-blur-2xl rounded-[32px] z-10">

        {/* Header Container */}
        <div className="flex flex-col items-center justify-center gap-2 pb-8 border-b border-white/5 mb-8 text-center relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-sm text-zinc-400">
            Join the ultimate AI prompt ecosystem.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignup} className="flex flex-col gap-6">

          {/* 📸 AVATAR UPLOAD SECTION */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className={`relative group w-20 h-20 rounded-full border border-dashed transition-all duration-300 shadow-inner flex items-center justify-center overflow-hidden bg-[#030303] ${!image && error ? 'border-red-500/50' : 'border-white/20 hover:border-blue-500/50'}`}>
              {image ? (
                <img src={image} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <Picture className="text-zinc-500 group-hover:text-blue-400 transition-colors" size={24} />
              )}

              {/* Uploading Overlay */}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-[#030303]/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <Spinner size="sm" color="white" />
                </div>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleFileUpload}
                disabled={isUploadingImage}
              />
            </div>
            {/* Added red asterisk to indicate it is required */}
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              {image ? "Change Avatar" : "Upload Avatar"} <span className="text-red-500">*</span>
            </p>
          </div>

          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-zinc-300 ml-1">Name <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-1 bg-[#030303] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
              <Person className="text-zinc-500" size={18} />
              <input
                required
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-zinc-300 ml-1">Email Address <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-1 bg-[#030303] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
              <At className="text-zinc-500" size={18} />
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-zinc-300 ml-1">Password <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-1 bg-[#030303] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
              <ShieldKeyhole className="text-zinc-500" size={18} />
              <input
                required
                type={isVisible ? "text" : "password"}
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-white placeholder:text-zinc-600"
              />
              <button
                className="focus:outline-none text-zinc-500 hover:text-zinc-300 transition-colors"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Dynamic Status Badges */}
          {error && (
            <div className="px-4 py-3 text-sm font-medium rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          {/* Role Selection */}
          {/* Role Selection */}
          <div className="flex flex-col gap-3 mt-2">
            <Label className="text-sm font-medium text-zinc-300 ml-1">
              Account Type <span className="text-red-500">*</span>
            </Label>

            <RadioGroup defaultValue="user" name="role" orientation="horizontal" onChange={value => setRole(value)}>
              <Radio value="user">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  User
                </Radio.Content>
              </Radio>
              <Radio value="creator">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Creator
                </Radio.Content>
              </Radio>
            </RadioGroup>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4"
          >
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading || isUploadingImage}
              className="w-full font-semibold rounded-2xl text-sm h-12 bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:bg-blue-500 transition-all border border-blue-500/50"
            >
              Sign Up
            </Button>
          </motion.div>

          {/* Navigation Option */}
          <div className="text-center pt-6 border-t border-white/5 mt-2 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href={`/auth/signin?redirect=${redirectTo}`} className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Sign in instead
            </Link>
          </div>

        </form>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#030303]">
        <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-10 bg-[#0a0a0c]/80 border border-white/5 rounded-[32px]">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/2 mx-auto bg-white/10 rounded-lg"></div>
            <div className="h-20 w-20 mx-auto bg-white/10 rounded-full"></div>
            <div className="h-12 bg-white/5 rounded-2xl"></div>
            <div className="h-12 bg-white/5 rounded-2xl"></div>
            <div className="h-12 bg-white/5 rounded-2xl"></div>
            <div className="h-12 bg-white/10 rounded-2xl mt-8"></div>
          </div>
        </Card>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}