import AdminPayments from "@/components/dashboard/admin/payments/AdminPayments";
import { getAllTransactions } from "@/lib/api/subscriptions";

export const metadata = {
  title: "Payment Management | Admin Dashboard",
  description: "Manage, monitor, and review all premium subscription payments.",
};

export default async function PaymentsPage() {
  // BACKEND INTEGRATION: 
  // Fetch transactions from your database here.
  const  {transactions}  = await getAllTransactions();

  

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden pb-20">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <AdminPayments initialTransactions={transactions} />
      </div>
    </div>
  );
}