// components/dashboard/admin/reports/Toast.jsx
// ─────────────────────────────────────────────────────────────
// Re-exports the ToastContainer from react-toastify configured
// to match the dark admin dashboard design.
//
// HOW IT WORKS:
//   This file has two exports:
//
//   1. <ToastContainer />  (default export)
//      Drop this once anywhere in the tree — ReportsPage renders
//      it. It's the invisible mount point where all toasts appear.
//
//   2. notify(message, type)  (named export)
//      Call this imperatively after any action — no React state
//      needed. ReportsPage calls it directly in handleActionConfirm.
//
// INSTALLATION:
//   npm install react-toastify
//   # or
//   yarn add react-toastify
//
// GLOBAL CSS:
//   Import the toastify base styles once in your root layout:
//   import "react-toastify/dist/ReactToastify.css";
//   (app/layout.jsx or app/layout.tsx)
//
// TYPE VALUES:
//   "success" → green  ✓  (action completed)
//   "danger"  → red    ✗  (destructive action / error)
//   "warning" → orange ⚠  (warning issued to creator)
//   "info"    → blue   ℹ  (neutral info, e.g. dismissed)
//   ""        → default   (fallback, no icon colour)
//
// react-toastify docs: https://fkhadra.github.io/react-toastify
// ─────────────────────────────────────────────────────────────
"use client";

import { ToastContainer as ReactToastContainer, toast } from "react-toastify";

// ── Type → react-toastify method mapping ──────────────────────
// react-toastify has: toast.success / toast.error / toast.warn /
// toast.info / toast() (default). We map our internal type names
// to the correct method so icons and colours match.
const TOAST_METHODS = {
  success: toast.success,
  danger:  toast.error,   // react-toastify calls it "error"
  warning: toast.warn,    // react-toastify calls it "warn"
  info:    toast.info,
};

// ── notify() — imperative toast trigger ───────────────────────
// Called by ReportsPage after each confirmed action.
// No component state involved — react-toastify manages its own
// internal queue.
//
// Usage:
//   import { notify } from "./Toast";
//   notify("Warning sent to creator.", "warning");
//
export function notify(message, type = "") {
  const method = TOAST_METHODS[type] ?? toast;
  method(message, {
    // Auto-dismiss after 3.5 s (matches the old custom Toast timing)
    autoClose: 3500,
    // Pause the timer while the user hovers over the toast
    pauseOnHover: true,
    // Slide in from the bottom-right
    position: "bottom-right",
    // Show a progress bar that counts down to auto-dismiss
    hideProgressBar: false,
    // Each new toast stacks rather than replacing the previous one
    closeOnClick: true,
    draggable: true,
  });
}

// ── <ToastContainer /> — mount point ──────────────────────────
// Wraps react-toastify's ToastContainer with project-specific
// defaults so callers don't repeat config on every usage.
//
// Rendered once inside ReportsPage (not in layout.jsx) so it's
// scoped to the admin area. Move it to layout.jsx if you want
// toasts available app-wide.
//
export default function ToastContainer() {
  return (
    <ReactToastContainer
      // Stack toasts from the bottom-right corner
      position="bottom-right"
      // Default auto-close (overridden per-toast in notify())
      autoClose={3500}
      // Show newest toast on top when stacked
      newestOnTop
      // Dismiss on click
      closeOnClick
      // Keep showing while mouse is over the toast
      pauseOnHover
      // Allow drag-to-dismiss on mobile
      draggable
      // react-toastify theme — "dark" gives a near-black background
      // that matches the #030303 / #0a0a0c dashboard palette
      theme="dark"
      // Limit to 4 toasts visible at once — avoids overwhelming
      // the screen if multiple actions fire in quick succession
      limit={4}
      // CSS class on the outer container div — lets you fine-tune
      // position if the default 16px offset doesn't suit your layout
      className="!bottom-6 !right-4 sm:!right-6"
    />
  );
}