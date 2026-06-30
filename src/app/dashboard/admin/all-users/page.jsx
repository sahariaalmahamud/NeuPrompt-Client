
import AdminUsersTable from "@/components/dashboard/admin/AdminUsersTable";
import { getUsersList } from "@/lib/api/users";



export default async function AdminUsersPage() {
  const getUsers = await getUsersList();
  const users = getUsers?.users || [];

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Overview Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">
            User Management System
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure system access profiles, modify organizational structural roles, and toggle user authorization metrics.
          </p>
        </div>

        {/* Client Side Core Interactive Datatable */}
        <AdminUsersTable users={users} />
      </div>
    </div>
  );
}