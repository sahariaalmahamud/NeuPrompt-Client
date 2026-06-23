"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Dropdown,
  Avatar,
  Label
} from "@heroui/react";
import {
  Bars,
  Xmark,
  Gear,
  ArrowRightFromSquare,
  Persons
} from "@gravity-ui/icons";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Prompts", href: "/prompts" },
    { name: "Pricing", href: "/plans" },
  ];

  const dashboardLinks = {
    'user': "/dashboard/user",
    'creator': "/dashboard/creator",
    'admin': "/dashboard/admin"
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full flex justify-center transition-all duration-400 ease-in-out pointer-events-none ${isScrolled ? "pt-4 px-4 sm:px-6" : "pt-0 px-0"
        }`}
    >
      <nav
        className={`w-full pointer-events-auto transition-all duration-400 ease-in-out ${isScrolled
          ? "max-w-7xl rounded-2xl border border-white/10 bg-[#030303]/85 backdrop-blur-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)]"
          : "max-w-full rounded-none border-b border-white/5 bg-[#030303]/40 backdrop-blur-md"
          }`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20 transition-all">

          {/* LEFT: Branding */}
          <Link href="/" className="shrink-0 flex items-center gap-2 mr-4 md:mr-8 lg:mr-12 group outline-none">
            <Image
              src="/globe.svg"
              alt="NeuPrompt"
              width={120}
              height={40}
              priority
              className="h-8 lg:h-9 w-auto group-hover:opacity-80 transition-opacity"
            />
            <span className="font-bold text-white text-lg tracking-tight hidden sm:block">NeuPrompt</span>
          </Link>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden md:flex items-center h-full gap-6 lg:gap-8 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative h-full flex items-center text-sm font-medium transition-colors ${isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 rounded-t-md shadow-[0_-2px_10px_rgba(59,130,246,0.5)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: User Profile & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Dropdown placement="bottom-end">
                <Dropdown.Trigger className="rounded-full outline-none cursor-pointer">
                  <Avatar
                    className="ring-2 ring-white/10 hover:ring-blue-500/60 transition-all duration-300"
                    size="sm"
                  >
                    <Avatar.Image
                      alt={user.name || "User Avatar"}
                      src={user.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"}
                    />
                    <Avatar.Fallback delayMs={600} className="bg-zinc-800 text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>

                <Dropdown.Popover className="bg-[#0a0a0c] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-2xl min-w-[240px]">

                  <div className="px-4 pt-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <Avatar size="md">
                        <Avatar.Image
                          alt={user.name || "User Profile Image"}
                          src={user.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"}
                        />
                        <Avatar.Fallback delayMs={600} className="bg-zinc-800 text-white">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col gap-0 overflow-hidden">
                        <p className="text-sm leading-5 font-semibold text-white truncate">{user.name || "Jane Doe"}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email || "jane@example.com"}</p>
                      </div>
                    </div>
                  </div>

                  <Dropdown.Menu className="p-2 flex flex-col gap-1">
                    <Dropdown.Item
                      key="dashboard"
                      textValue="Dashboard"
                      className="rounded-xl hover:bg-white/5 transition-colors"
                      onClick={() => router.push(dashboardLinks[user.role || 'user'])}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-1.5 px-1">
                        <Label className="cursor-pointer text-zinc-300 font-medium">Dashboard</Label>
                        <Gear className="size-4 text-zinc-500" />
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item
                      key="profile"
                      textValue="Profile"
                      className="rounded-xl hover:bg-white/5 transition-colors"
                      onClick={() => router.push("/profile")}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-1.5 px-1">
                        <Label className="cursor-pointer text-zinc-300 font-medium">My Profile</Label>
                        <Persons className="size-4 text-zinc-500" />
                      </div>
                    </Dropdown.Item>

                    {/* ✨ FIX: Removed the raw <div> and moved the line to the item's top border ✨ */}
                    <Dropdown.Item
                      key="logout"
                      textValue="Logout"
                      className="rounded-xl hover:bg-red-500/10 transition-colors group mt-1 pt-2 border-t border-white/10"
                      onClick={handleSignOut}
                    >
                      <div className="flex w-full items-center justify-between gap-2 py-1.5 px-1">
                        <Label className="cursor-pointer text-red-400 font-medium group-hover:text-red-300">Sign Out</Label>
                        <ArrowRightFromSquare className="size-4 text-red-400 group-hover:text-red-300" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <>
                <Link href="/auth/signin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white font-semibold tracking-wide hover:bg-blue-500 p-2 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                  size="sm"
                  radius="full"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 text-zinc-300 hover:text-white transition-colors outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <Xmark width={24} height={24} /> : <Bars width={24} height={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="border-t border-white/10 md:hidden py-4 px-4 flex flex-col gap-2 bg-[#030303]/95 backdrop-blur-3xl rounded-b-2xl shadow-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-blue-500/10 text-blue-400" : "text-zinc-300 hover:text-white hover:bg-white/5"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}

            {user ? (
              <div className="mt-2 bg-white/5 rounded-xl overflow-hidden border border-white/5">
                <Link
                  href={dashboardLinks[user.role || 'user']}
                  className="px-4 py-4 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white flex items-center justify-between border-b border-white/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Dashboard</span>
                  <Gear className="size-4" />
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-4 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white flex items-center justify-between border-b border-white/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>My Profile</span>
                  <Persons className="size-4" />
                </Link>
                <button
                  onClick={() => { setIsOpen(false); handleSignOut(); }}
                  className="w-full px-4 py-4 text-sm font-medium text-red-400 hover:bg-red-500/10 flex items-center justify-between text-left transition-colors"
                >
                  <span>Sign Out</span>
                  <ArrowRightFromSquare className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Button as={Link} href="/auth/signin" variant="bordered" className="border-white/10 text-white rounded-xl h-12 font-semibold text-base">
                  Sign In
                </Button>
                <Button as={Link} href="/auth/signup" className="bg-blue-600 text-white rounded-xl h-12 font-semibold text-base shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}