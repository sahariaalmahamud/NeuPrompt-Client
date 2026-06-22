"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#05060A]">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-900/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Section */}
          <div className="lg:col-span-5">
            <Link href="/">
              {/* <Image
                src="/logo.png"
                alt="Hireloop"
                width={180}
                height={50}
                className="h-11 w-auto"
              /> */}
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
              The AI-native career platform. Built for people who
              take their work seriously.
            </p>

            {/* Social Icons */}
            <div className="mt-10 flex items-center gap-3">
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                f
              </Link>

              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-600 text-white transition hover:bg-indigo-500"
              >
                p
              </Link>

              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                in
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {/* Product */}
              <div>
                <h3 className="mb-5 text-sm font-semibold text-indigo-400">
                  Product
                </h3>

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Job Discovery
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Worker AI
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Companies
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Salary Data
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="mb-5 text-sm font-semibold text-indigo-400">
                  Navigations
                </h3>

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Help Center
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Career Library
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="mb-5 text-sm font-semibold text-indigo-400">
                  Resources
                </h3>

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Brand Guideline
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Newsroom
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row">
          <p className="text-sm text-zinc-500">
            Copyright 2026 — Hire Loop
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-zinc-500 hover:text-white"
            >
              Terms & Policy
            </Link>

            <Link
              href="#"
              className="text-sm text-zinc-500 hover:text-white"
            >
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}