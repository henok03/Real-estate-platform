import { redirect } from 'next/navigation';
import { getSessionAdmin } from '@/lib/auth';
import { isUsingNeon } from '@/lib/db';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Database, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getSessionAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  const usingNeon = isUsingNeon();

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      {/* Sidebar Navigation */}
      <AdminSidebar adminEmail={admin.email} adminName={admin.full_name} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Status Banner */}
     

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
