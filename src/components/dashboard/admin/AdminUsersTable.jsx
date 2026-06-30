"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Person, Briefcase } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { updateUserRole, deleteUser } from "@/lib/actions/users";
import ConfirmActionModal from "./Confirmactionmodal ";

export default function AdminUsersTable({ users: initialUsers = [] }) {
  // Helper to cleanly format and map incoming dataset items safely
  const normalizeUsers = (data) =>
    data.map((u) => {
      const normalizedRole = u.role ? u.role.toLowerCase() : "user";
      return {
        ...u,
        role: normalizedRole,
        status: u.status || "Active",
        preSuspensionRole: u.preSuspensionRole?.toLowerCase() || normalizedRole,
      };
    });

  const [users, setUsers] = useState(() => normalizeUsers(initialUsers));

  // Synchronize local UI state whenever server revalidatePath fires fresh data
  useEffect(() => {
    setUsers(normalizeUsers(initialUsers));
  }, [initialUsers]);

  // ── Pagination ───────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsersSlice = users.slice(indexOfFirstItem, indexOfLastItem);

  // Keep currentPage valid if the list shrinks (e.g. after a delete)
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // ── Confirm modal state ─────────────────────────────────────
  // pendingAction: null | { type: "delete" | "suspend", user }
  const [pendingAction, setPendingAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Role management ─────────────────────────────────────────
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "user" ? "creator" : "user";
    const prevUsers = users;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, preSuspensionRole: newRole } : u))
    );

    try {
      await updateUserRole(userId, newRole);
      toast.success(`Role updated to ${newRole === "creator" ? "Creator" : "User"}.`);
    } catch (error) {
      console.error("Failed to update user role:", error);
      setUsers(prevUsers);
      toast.error(error.message || "Failed to update role. Please try again.");
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    const newRole = "admin";
    const prevUsers = users;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, preSuspensionRole: newRole } : u))
    );

    try {
      await updateUserRole(userId, newRole);
      toast.success("User promoted to Admin.");
    } catch (error) {
      console.error("Failed to promote user to Admin:", error);
      setUsers(prevUsers);
      toast.error(error.message || "Failed to promote user. Please try again.");
    }
  };

  // ── Suspend / Activate ──────────────────────────────────────
  // Suspend now goes through the confirm modal instead of firing
  // immediately, since it changes a user's access — worth a beat
  // of friction, same as delete.
  const confirmSuspendUser = async () => {
    const { user } = pendingAction;
    setIsProcessing(true);
    const prevUsers = users;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: "Suspended", preSuspensionRole: user.role } : u
      )
    );

    try {
      // NOTE: if your backend needs an explicit suspend endpoint rather
      // than encoding it via role, swap this for a dedicated action,
      // e.g. suspendUser(user.id). Left as a status-only local change
      // here since no suspend API was provided in the original code.
      toast.success(`${user.name} has been suspended.`);
      setPendingAction(null);
    } catch (error) {
      console.error("Failed to suspend user:", error);
      setUsers(prevUsers);
      toast.error(error.message || "Failed to suspend user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActivateUser = async (id, rememberedRole) => {
    const prevUsers = users;

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Active", role: rememberedRole } : u))
    );

    try {
      await updateUserRole(id, rememberedRole);
      toast.success("User reactivated.");
    } catch (error) {
      console.error("Failed to reactivate user:", error);
      setUsers(prevUsers);
      toast.error(error.message || "Failed to reactivate user. Please try again.");
    }
  };

  // ── Delete (the actual fix) ──────────────────────────────────
  const confirmDeleteUser = async () => {
    const { user } = pendingAction;
    setIsProcessing(true);
    const prevUsers = users;

    // Optimistic removal
    setUsers((prev) => prev.filter((u) => u.id !== user.id));

    try {
      // FIX: this is the API call that was completely missing before.
      await deleteUser(user.id);
      toast.success(`${user.name}'s account has been permanently deleted.`);
      setPendingAction(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Restore the row since the delete didn't actually succeed
      setUsers(prevUsers);
      toast.error(error.message || "Failed to delete user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Modal dispatch ───────────────────────────────────────────
  const openDeleteModal = (user) => setPendingAction({ type: "delete", user });
  const openSuspendModal = (user) => setPendingAction({ type: "suspend", user });
  const closeModal = useCallback(() => {
    if (isProcessing) return;
    setPendingAction(null);
  }, [isProcessing]);

  const handleModalConfirm = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "delete") confirmDeleteUser();
    if (pendingAction.type === "suspend") confirmSuspendUser();
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // ── Shared sub-renders (used by both table rows and mobile cards) ──
  const RoleBadge = ({ user }) => {
    const isSuspended = user.status === "Suspended";
    const isAdmin = user.role === "admin";
    const isCreator = user.role === "creator";

    if (isSuspended) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-500 rounded-full line-through">
          Suspended
        </span>
      );
    }
    if (isAdmin || isCreator) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1e152a] border border-[#492b70] text-[10px] font-bold text-purple-400 rounded-full shadow-sm">
          <Briefcase size={11} className="text-purple-400" />
          {isAdmin ? "Admin" : "Creator"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1e1e24] border border-[#2e2e38] text-[10px] font-medium text-zinc-300 rounded-full">
        <Person size={12} className="text-zinc-500" />
        User
      </span>
    );
  };

  const StatusBadge = ({ user }) => {
    const isSuspended = user.status === "Suspended";
    return !isSuspended ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-[11px] font-semibold text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-red-500/10 bg-red-500/5 text-[11px] font-semibold text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Suspended
      </span>
    );
  };

  const ActionButtons = ({ user, dense = false }) => {
    const isSuspended = user.status === "Suspended";
    const isAdmin = user.role === "admin";
    const isUser = user.role === "user";
    const isCreator = user.role === "creator";

    if (isSuspended) {
      return (
        <>
          <button
            onClick={() => handleActivateUser(user.id, user.preSuspensionRole)}
            className="text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Activate
          </button>
          <button
            onClick={() => openDeleteModal(user)}
            className={`text-zinc-400 hover:text-white transition-colors ${dense ? "" : "border-l border-zinc-800 pl-3"}`}
          >
            Delete
          </button>
        </>
      );
    }

    return (
      <>
        {(isUser || isCreator) && (
          <>
            <button
              onClick={() => handleToggleRole(user.id, user.role)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {isUser ? "Make Creator" : "Make User"}
            </button>
            <button
              onClick={() => handlePromoteToAdmin(user.id)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Promote Admin
            </button>
          </>
        )}

        {isAdmin && (
          <span className="text-zinc-600 font-medium select-none cursor-not-allowed italic">
            System Protected
          </span>
        )}

        <button
          onClick={() => openSuspendModal(user)}
          className={`text-red-500/80 hover:text-red-400 transition-colors ${dense ? "" : "border-l border-zinc-800 pl-3"}`}
        >
          Suspend
        </button>
      </>
    );
  };

  return (
    <div className="bg-[#121214] border border-[#1d1d20] rounded-2xl overflow-hidden shadow-2xl">
      {/* ════════════════════════════════════════════════════════
          DESKTOP / TABLET TABLE — visible from `lg` breakpoint up
          (≈1024px: laptops, desktops, large monitors)
          ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#1d1d20] text-[11px] font-bold tracking-wider uppercase text-zinc-500 bg-[#161619]">
              <th className="py-4 px-6">User Name</th>
              <th className="py-4 px-6">Email Address</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Join Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1d1d20]/50 text-xs">
            {currentUsersSlice.map((user) => {
              const initials = user.name ? user.name.substring(0, 2).toUpperCase() : "US";
              return (
                <tr key={user.id} className="hover:bg-[#161619]/40 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1e1e22] border border-[#27272a] text-zinc-400 flex items-center justify-center text-[10px] font-bold tracking-wide shrink-0">
                        {initials}
                      </div>
                      <span className="font-semibold text-zinc-200 capitalize">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-zinc-400 font-medium">{user.email}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <RoleBadge user={user} />
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-zinc-400">{formatDate(user.createdAt)}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <StatusBadge user={user} />
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3 font-semibold text-xs">
                      <ActionButtons user={user} />
                    </div>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-zinc-500 font-medium">
                  No system profile records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE / TABLET CARD LIST — visible below `lg` breakpoint
          (phones, large phones, tablets/portrait)
          A 6-column table cannot be made readable at these widths
          no matter how compressed; a stacked card is the correct
          pattern here, not a horizontally-scrolling table.
          ════════════════════════════════════════════════════════ */}
      <div className="lg:hidden divide-y divide-[#1d1d20]/60">
        {currentUsersSlice.map((user) => {
          const initials = user.name ? user.name.substring(0, 2).toUpperCase() : "US";
          return (
            <div key={user.id} className="p-4 sm:p-5 flex flex-col gap-3">
              {/* Identity row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1e1e22] border border-[#27272a] text-zinc-400 flex items-center justify-center text-[11px] font-bold tracking-wide shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-zinc-200 capitalize text-sm truncate">
                      {user.name}
                    </span>
                    <span className="text-zinc-500 text-xs truncate">{user.email}</span>
                  </div>
                </div>
                <StatusBadge user={user} />
              </div>

              {/* Meta row: role + join date */}
              <div className="flex items-center justify-between flex-wrap gap-2 pl-12 sm:pl-[52px]">
                <RoleBadge user={user} />
                <span className="text-[11px] text-zinc-500">Joined {formatDate(user.createdAt)}</span>
              </div>

              {/* Actions row — wraps on very narrow phones */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 pl-12 sm:pl-[52px] pt-1 text-xs font-semibold">
                <ActionButtons user={user} dense />
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="text-center py-12 text-zinc-500 font-medium text-sm px-4">
            No system profile records found.
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          PAGINATION FOOTER — responsive: stacks on phones,
          single row from `sm` up
          ════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#1d1d20] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 bg-[#161619]/60">
        <div className="text-center sm:text-left">
          Showing <span className="text-zinc-300 font-medium">{totalItems === 0 ? 0 : indexOfFirstItem + 1}</span> to{" "}
          <span className="text-zinc-300 font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
          <span className="text-zinc-300 font-medium">{totalItems.toLocaleString()}</span> users
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;

            if (
              totalPages > 4 &&
              pageNum !== 1 &&
              pageNum !== totalPages &&
              Math.abs(currentPage - pageNum) > 1
            ) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return (
                  <span key={pageNum} className="px-1 text-zinc-600">
                    …
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all border ${
                  isActive
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════
          CONFIRM MODAL — shared by Delete and Suspend
          ════════════════════════════════════════════════════════ */}
      <ConfirmActionModal
        isOpen={pendingAction !== null}
        isLoading={isProcessing}
        onClose={closeModal}
        onConfirm={handleModalConfirm}
        title={pendingAction?.type === "delete" ? "Delete user account" : "Suspend user"}
        confirmText={pendingAction?.type === "delete" ? "Delete permanently" : "Suspend user"}
        confirmColor={pendingAction?.type === "delete" ? "danger" : "warning"}
        message={
          pendingAction?.type === "delete" ? (
            <>
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">{pendingAction.user.name}</strong>&apos;s account? This
              action cannot be undone.
            </>
          ) : pendingAction?.type === "suspend" ? (
            <>
              Suspend <strong className="text-white">{pendingAction.user.name}</strong>? They will lose
              access until reactivated. Their current role will be restored when you activate them
              again.
            </>
          ) : (
            ""
          )
        }
      />
    </div>
  );
}