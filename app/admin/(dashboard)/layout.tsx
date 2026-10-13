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
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Environment:
            </span>
            {usingNeon ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Neon PostgreSQL Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800" title="To persist across cloud redeploys, set DATABASE_URL in .env.local">
                <Database className="h-3.5 w-3.5 text-amber-600" />
                <span>Memory Store Active (Zero fake properties)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="hidden sm:inline-block">Logged in as:</span>
            <span className="font-semibold text-zinc-900">{admin.full_name || admin.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
