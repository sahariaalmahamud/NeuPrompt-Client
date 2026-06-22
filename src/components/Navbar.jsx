"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Bars, Xmark } from "@gravity-ui/icons";
// import { useSession, signOut } from "@/lib/auth-client";

// import { useRouter } from "next/navigation";

export default function Navbar() {
//   const router = useRouter();
//   const { data: session, isPending } = useSession();

  // console.log("Session in Navbar:", session, "Pending:", isPending);

//   const user = session?.user;

  // console.log("User in Navbar:", user);

  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Company", href: "/company" },
    { name: "Pricing", href: "/plans" },
  ];

  const dashboardLinks = {
    'seeker': "/dashboard/seeker",
    'recruiter': "/dashboard/recruiter",
    'admin': "/dashboard/admin"
  };

  // console.log("Dashboard Links:", dashboardLinks);

//   if(user?.email) {
//     navLinks.push({ name: "Dashboard", href: dashboardLinks[user?.role || 'seeker'] });
//   }

  const handleSignOut = async () => {
    try {
      await signOut();
    //   router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4">
      <div className="mx-auto max-w-7xl">
        <nav className="rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/globe.svg"
                alt="Hireloop"
                width={160}
                height={50}
                priority
                className="h-10 w-auto md:h-11"
              />
            </Link>

            {/* Desktop / Tablet Menu */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop / Tablet Actions */}
            <div className="hidden md:flex items-center gap-6">
              <div className="h-5 w-px bg-zinc-700" />
              
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                Dashboard
              </Link>

          
                (
                  <>
                    {/* <p>hello, {user.name}</p> */}
                    <p>hello,</p>
                    <Button onClick = {handleSignOut} variant="ghost">Sign Out</Button>
                  </>
                ) : (
                  <Link
                    // href="/auth/signin"
                    href="signin"
                    className="text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
                  >
                    Sign In
                  </Link>
                )


              <Button
                radius="lg"
                className="bg-linear-to-r from-violet-600 to-indigo-500 px-6 text-white font-medium"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <Xmark width={24} height={24} />
              ) : (
                <Bars width={24} height={24} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="border-t border-white/10 md:hidden">
              <div className="flex flex-col px-6 py-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="py-3 text-zinc-300 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="my-4 h-px bg-zinc-800" />

                <Link
                  href="/auth/signin"
                  className="py-3 text-violet-400 hover:text-violet-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>

                <Button
                  radius="lg"
                  className="mt-3 bg-linear-to-r from-violet-600 to-indigo-500 text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div >
    </header >
  );
}