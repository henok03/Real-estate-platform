'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Users,
  MessageSquare,
  MessageSquareQuote,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  adminEmail: string;
  adminName?: string | null;
}

export function AdminSidebar({ adminEmail, adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/properties', label: 'Properties', icon: Building },
    { href: '/admin/properties/new', label: 'Add Property', icon: PlusCircle },
    { href: '/admin/agents', label: 'Agents', icon: Users },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { href: '/admin/inquiries', label: 'Inquiries & Messages', icon: MessageSquare },
    { href: '/admin/security', label: 'Security & Password', icon: KeyRound },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-amber-500">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-serif font-bold text-zinc-900">Aura Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg border border-zinc-200 p-2 text-zinc-700"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-zinc-950 text-white transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-zinc-800/80 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-bold shadow">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white">Aura Estates</span>
              <span className="block text-[10px] uppercase tracking-widest text-zinc-400">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="border-b border-zinc-800/80 p-4">
          <div className="rounded-xl bg-zinc-900 p-3">
            <p className="text-xs font-semibold text-white truncate">{adminName || 'Admin'}</p>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">{adminEmail}</p>
            <div className="mt-2 flex items-center gap-1.5">
             
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          {links.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-amber-500' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-zinc-800/80 p-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2.5 border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-rose-950 hover:border-rose-800 hover:text-rose-200"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              <span>Sign Out</span>
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
