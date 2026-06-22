"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Dropdown, Avatar } from "@heroui/react";

// ----------------------------------------------------------------------
// MOCK DATA & ROUTING LOGIC
// ----------------------------------------------------------------------

const mockUser = {
  name: "Besy Nospe",
  email: "besy@gmail.com",
  photoURL: "", // Test with "" to see the 'B' fallback, or add a URL
  role: "creator", // Change to "user" or "admin" to test dynamic routing
  subscription: "free",
  createdAt: new Date(),
};

// Toggle this boolean to test Logged In vs Logged Out states
const IS_LOGGED_IN = true; 

const getDashboardRoute = (role) => {
  switch (role) {
    case "admin":
      return "/admin-dashboard";
    case "creator":
      return "/creator-dashboard";
    default:
      return "/dashboard";
  }
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Prompts", href: "/prompts" },
];

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group z-50">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-shadow">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <p className="font-display font-bold text-xl text-white tracking-tight">
      NeuPrompt
    </p>
  </Link>
);

// ----------------------------------------------------------------------
// MAIN NAVBAR COMPONENT
// ----------------------------------------------------------------------

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const dashboardRoute = getDashboardRoute(mockUser?.role);
  const activePath = isMounted ? pathname : null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#030303]/70 backdrop-blur-2xl border-b border-white/5 font-sans ">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: Mobile Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-1 text-white focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-[14px] relative flex flex-col justify-between">
              <span className={`block h-[2px] w-full bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-[2px] w-full bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] w-full bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
          </button>
          
          <Logo />
        </div>

        {/* CENTER: Desktop Links with Framer Motion Highlight */}
        <ul className="hidden sm:flex items-center h-full gap-8">
          {navLinks.map((link) => {
            const isActive = activePath === link.href;
            return (
              <li key={link.name} className="h-full flex items-center">
                <Link
                  href={link.href}
                  className={`relative h-full flex items-center text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT: Desktop Auth/Profile */}
        <div className="hidden sm:flex items-center gap-4">
          {IS_LOGGED_IN ? (
            <>
              <Link href={dashboardRoute}>
                <Button 
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 font-medium transition-all rounded-full"
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>

              {/* Hero UI v3 Dropdown Compound Component */}
              <Dropdown>
                <Dropdown.Trigger>
                  <button className="outline-none focus:outline-none">
                    <Avatar
                      src={mockUser.photoURL}
                      name={mockUser.name.charAt(0)}
                      size="sm"
                      className="ring-2 ring-transparent hover:ring-blue-500/50 transition-all cursor-pointer"
                    />
                  </button>
                </Dropdown.Trigger>
                
                <Dropdown.Popover className="bg-[#0a0a0c] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-2xl min-w-[200px]">
                  <Dropdown.Menu aria-label="User menu" className="p-2 flex flex-col gap-1">
                    
                    <Dropdown.Item id="user-info" textValue="User Info" className="px-3 py-2 cursor-default hover:bg-transparent">
                      <p className="text-xs text-zinc-500">Signed in as</p>
                      <p className="font-semibold text-white truncate">{mockUser.email}</p>
                    </Dropdown.Item>
                    
                    <Dropdown.Item id="div1" textValue="divider" className="p-0 pointer-events-none">
                      <div className="h-px bg-white/10 w-full my-1" />
                    </Dropdown.Item>

                    <Dropdown.Item id="profile" textValue="Profile" className="px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                      <Link href="/profile" className="w-full flex">👤 My Profile</Link>
                    </Dropdown.Item>
                    
                    <Dropdown.Item id="dashboard" textValue="Dashboard" className="px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                      <Link href={dashboardRoute} className="w-full flex">⚙ Dashboard</Link>
                    </Dropdown.Item>

                    <Dropdown.Item id="div2" textValue="divider" className="p-0 pointer-events-none">
                      <div className="h-px bg-white/10 w-full my-1" />
                    </Dropdown.Item>

                    <Dropdown.Item id="logout" textValue="Logout" className="px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                      <Link href="/" className="w-full flex">🚪 Logout</Link>
                    </Dropdown.Item>

                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button 
                  className="bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-full px-6"
                  size="sm"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 📱 MOBILE: Drawer Menu (Framer Motion) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-16 left-0 right-0 bg-[#030303]/95 backdrop-blur-3xl border-b border-white/5 sm:hidden overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col px-6 py-6 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={`mobile-${link.name}`}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium ${
                    activePath === link.href ? "text-blue-400" : "text-zinc-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {IS_LOGGED_IN ? (
                <>
                  <Link href={dashboardRoute} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-zinc-300">
                    Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-zinc-300">
                    Profile
                  </Link>
                  <div className="h-px w-full bg-white/5 my-2" />
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-red-400">
                    Logout
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-white/5 text-white border border-white/10 rounded-full" variant="flat">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-white text-black font-semibold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}