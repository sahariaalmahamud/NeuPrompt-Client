"use client";

import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

const FooterHeading = ({ children }) => (
  <h4 className="text-white font-semibold mb-6 tracking-tight">{children}</h4>
);

const FooterLink = ({ href, children }) => (
  <li>
    <Link href={href} className="text-zinc-400 hover:text-blue-400 transition-colors text-sm">
      {children}
    </Link>
  </li>
);

// ----------------------------------------------------------------------
// MAIN FOOTER COMPONENT
// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="relative bg-[#030303] border-t border-white/5 pt-20 pb-8 overflow-hidden font-sans">
      
      {/* Subtle Background Glow for the Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[150px] bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ✉️ NEWSLETTER BANNER (Integrated elegantly at the top) */}
        <div className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Stay updated</h3>
            <p className="text-zinc-400">Get the latest prompts, platform features, and creator updates.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-72 bg-white/5 border-white/10 hover:bg-white/10 focus-within:!bg-white/10 focus-within:border-blue-500 rounded-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full text-white placeholder:text-zinc-500 bg-transparent"
              />
            </div>
            <Button className="bg-white text-black font-semibold hover:bg-zinc-200 transition-colors px-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Subscribe
            </Button>
          </div>
        </div>

        {/* 🗺️ MULTI-COLUMN NAVIGATION */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Column 1: Brand & Socials (Spans 2 columns on large screens for better balance) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col items-start pr-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">NeuPrompt</span>
            </Link>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs">
              Discover, share, and monetize production-ready AI prompts. The ultimate ecosystem for AI creators.
            </p>

            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                <FaGithub size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                <FaXTwitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                <FaLinkedin size={20} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                <FaDiscord size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <FooterHeading>Platform</FooterHeading>
            <ul className="flex flex-col gap-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/prompts">All Prompts</FooterLink>
              <FooterLink href="/categories">Categories</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <ul className="flex flex-col gap-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <FooterHeading>Legal</FooterHeading>
            <ul className="flex flex-col gap-3">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
            </ul>
          </div>

        </div>

        {/* ⚖️ BOTTOM SECTION */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} NeuPrompt. All rights reserved.
          </p>
          <p className="text-zinc-500 text-sm flex items-center gap-1">
            Made with <span className="text-rose-500 animate-pulse">❤️</span> for AI Creators.
          </p>
        </div>

      </div>
    </footer>
  );
}