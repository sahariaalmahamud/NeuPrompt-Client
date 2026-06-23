"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@heroui/react";
import {
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
  Bookmark,
  FileText,
  CreditCard,
  Persons,
  Briefcase,
  ChartColumn,
  Factory,
  ArrowRightFromSquare,
  Xmark,
  Bars,
} from "@gravity-ui/icons";

import { useSession, signOut } from "@/lib/auth-client";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const creatorNavLinks = [
    { icon: House, href: "/dashboard/creator", label: "Home" },
    { icon: Person, href: "/dashboard/creator/my-profile", label: "My Profile" },
    { icon: Bell, href: "/dashboard/creator/add-prompt", label: "Add Prompt" },
    { icon: Envelope, href: "/dashboard/creator/my-prompts", label: "My Prompts" },
  ];

  const userNavLinks = [
    { icon: House, href: "/dashboard/user", label: "Home" },
    { icon: Person, href: "/dashboard/user/my-profile", label: "My Profile" },
    { icon: Bell, href: "/dashboard/user/add-prompt", label: "Add Prompt" },
    { icon: Magnifier, href: "/dashboard/user/my-prompts", label: "My Prompts" },
    { icon: Bookmark, href: "/dashboard/user/saved-prompts", label: "Saved" },
    { icon: FileText, href: "/dashboard/user/my-reviews", label: "Reviews" },
  ];

  const adminNavLinks = [
    { icon: ChartColumn, href: "/dashboard/admin", label: "Analytics" },
    { icon: Persons, href: "/dashboard/admin/my-profile", label: "My Profile" },
    { icon: Factory, href: "/dashboard/admin/all-users", label: "Users" },
    { icon: Briefcase, href: "/dashboard/admin/all-prompts", label: "Prompts" },
    { icon: CreditCard, href: "/dashboard/admin/payments", label: "Payments" },
    { icon: Gear, href: "/dashboard/admin/reported-prompts", label: "Reports" },
  ];

  const navLinkMap = { user: userNavLinks, creator: creatorNavLinks, admin: adminNavLinks };
  const navItems = navLinkMap[user?.role || "user"] ?? userNavLinks;
  // Bottom mobile bar shows first 5 items
  const mobileBottomItems = navItems.slice(0, 5);

  // ─── Sub-components ────────────────────────────────────────────────────────

  const ProfileCard = ({ compact = false }) => (
    <div
      className={`relative rounded-2xl border border-white/5 bg-[#0d0d10] overflow-hidden group transition-all duration-300 ${
        compact ? "p-2" : "p-3 mb-6"
      }`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {compact ? (
        // Tablet: just avatar centred
        <div className="flex justify-center">
          <Avatar
            src={user?.image}
            name={user?.name?.charAt(0) || "U"}
            // className="ring-2 ring-white/10 ring-offset-1 ring-offset-[#0d0d10]"
            size="sm"
          />
        </div>
      ) : (
        // Full: avatar + text
        <div className="relative flex items-center gap-3 z-10">
          <Avatar
            src={user?.image}
            name={user?.name?.charAt(0) || "U"}
            // className="ring-2 ring-white/10 ring-offset-2 ring-offset-[#0d0d10] shrink-0"
            size="sm"
          />
          <div className="flex flex-col overflow-hidden min-w-0">
            <p className="truncate text-sm font-semibold text-white leading-tight">
              {user?.name || "Loading…"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                {user?.role || "USER"}
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                {user?.subscription || "Pro"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const NavItem = ({ item, showLabel = true }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group overflow-hidden ${
          showLabel ? "" : "justify-center px-0"
        } ${
          isActive
            ? "bg-blue-500/10 text-blue-400"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
        }`}
        title={!showLabel ? item.label : undefined}
      >
        {/* Active left bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.7)]" />
        )}
        {/* Subtle hover bg sweep */}
        <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-200" />

        <item.icon
          className={`shrink-0 size-[18px] relative z-10 transition-colors duration-200 ${
            isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
          }`}
        />
        {showLabel && (
          <span className="relative z-10 truncate">{item.label}</span>
        )}
      </Link>
    );
  };

  const NavigationLinks = ({ showLabels = true }) => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <NavItem key={item.label} item={item} showLabel={showLabels} />
      ))}
    </nav>
  );

  const SignOutButton = ({ compact = false }) => (
    <button
      onClick={handleSignOut}
      className={`mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/70 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/15 group ${
        compact ? "justify-center px-0" : ""
      }`}
      title={compact ? "Sign out" : undefined}
    >
      <ArrowRightFromSquare className="size-[18px] shrink-0" />
      {!compact && <span>Sign out</span>}
    </button>
  );

  const SectionLabel = ({ label }) => (
    <p className="mb-2 mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 pl-3 select-none">
      {label}
    </p>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ────────────────────────── DESKTOP sidebar (≥1024px) ─────────────────── */}
      <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-white/[0.06] bg-[#030303] flex-col p-4 min-h-screen sticky top-0 h-screen">
        {/* Logo / wordmark area */}
        <div className="flex items-center gap-2 px-1 mb-6 mt-1">
          <span className="size-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-black">P</span>
          </span>
          <span className="text-white font-semibold text-sm tracking-tight">PromptHub</span>
        </div>

        <ProfileCard />
        <SectionLabel label="Menu" />
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <NavigationLinks showLabels={true} />
        </div>

        {/* Divider */}
        <div className="mt-4 h-px bg-white/5" />
        <SignOutButton compact={false} />
      </aside>

      {/* ────────────────────────── TABLET sidebar (768–1023px) ──────────────── */}
      <aside className="hidden md:flex lg:hidden w-[64px] shrink-0 border-r border-white/[0.06] bg-[#030303] flex-col items-center py-4 gap-3 min-h-screen sticky top-0 h-screen">
        {/* Logo mark */}
        <div className="size-9 rounded-xl bg-blue-600 flex items-center justify-center mb-2 shrink-0">
          <span className="text-white text-xs font-black">P</span>
        </div>

        <ProfileCard compact={true} />

        <nav className="flex flex-col gap-1 w-full px-2 flex-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} showLabel={false} />
          ))}
        </nav>

        <div className="w-8 h-px bg-white/5 mb-1" />
        <div className="px-2 w-full">
          <SignOutButton compact={true} />
        </div>
      </aside>

      {/* ────────────────────────── MOBILE (<768px) ──────────────────────────── */}
      {/* Hamburger trigger — top-left */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 size-10 rounded-xl bg-[#0d0d10] border border-white/10 flex items-center justify-center text-zinc-300 shadow-lg hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Bars className="size-5" />
        </button>

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Slide-in drawer */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-[#030303] border-r border-white/[0.06] flex flex-col p-4 transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="size-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-black">P</span>
              </span>
              <span className="text-white font-semibold text-sm tracking-tight">PromptHub</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <Xmark className="size-4" />
            </button>
          </div>

          <ProfileCard />
          <SectionLabel label="Menu" />

          <div className="flex-1 overflow-y-auto scrollbar-none">
            <NavigationLinks showLabels={true} />
          </div>

          <div className="mt-4 h-px bg-white/5" />
          <SignOutButton compact={false} />
        </div>

        {/* Bottom quick-nav bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#030303]/95 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-around px-2 h-16 safe-area-pb">
          {mobileBottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 min-w-0 ${
                  isActive ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <item.icon
                  className={`size-5 shrink-0 transition-transform duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                <span className="text-[9px] font-medium tracking-wide truncate">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}