import Link from 'next/link';
import {
  Building,
  CheckCircle2,
  FileEdit,
  Archive,
  MessageSquare,
  MessageSquareQuote,
  Mail,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDashboardStats, getPropertyInquiries, getContactMessages } from '@/lib/db';
import { formatCurrency } from '@/components/property/PropertyCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverviewPage() {
  const stats = await getDashboardStats();
  const inquiries = await getPropertyInquiries();
  const messages = await getContactMessages();

  const recentInquiries = inquiries.slice(0, 5);
  const recentMessages = messages.slice(0, 5);

  const statCards = [
    {
      label: 'Total Properties',
      value: stats.totalProperties,
      subtext: 'In PostgreSQL database',
      icon: Building,
      color: 'text-zinc-900',
      bg: 'bg-zinc-100',
    },
    {
      label: 'Published',
      value: stats.publishedProperties,
      subtext: 'Visible to public buyers',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Draft Mode',
      value: stats.draftProperties,
      subtext: 'Awaiting publication',
      icon: FileEdit,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      label: 'Archived',
      value: stats.archivedProperties,
      subtext: 'Deactivated listings',
      icon: Archive,
      color: 'text-zinc-600',
      bg: 'bg-zinc-100',
    },
    {
      label: 'Property Inquiries',
      value: stats.newInquiriesCount,
      subtext: 'From detail page forms',
      icon: MessageSquare,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    {
      label: 'Contact Messages',
      value: stats.newContactMessagesCount,
      subtext: 'From /contact page',
      icon: Mail,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
    },
    {
      label: 'Testimonials',
      value: stats.totalTestimonials,
      subtext: 'In testimonials table',
      icon: MessageSquareQuote,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
            Portfolio Command Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time management for estates, inquiries, and authorized agent representations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/properties/new">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow">
              <PlusCircle className="h-4 w-4" />
              <span>Add New Property</span>
            </Button>
          </Link>
          <Link href="/properties" target="_blank">
            <Button variant="outline" className="border-zinc-300">
              <span>View Live Site ↗</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Empty Warning / Zero-Data Indicator */}
      {stats.totalProperties === 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Zero Properties in Database (Compliance Verified)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                As required, no fake or sample properties were generated. Click &quot;Add Property&quot; to publish your first real estate listing.
              </p>
            </div>
          </div>
          <Link href="/admin/properties/new">
            <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700 shrink-0">
              Create First Property
            </Button>
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-3xl font-bold text-zinc-950">{stat.value}</span>
                <p className="text-[11px] text-zinc-400 mt-1">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inquiries & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Property Inquiries */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-zinc-950">
                  Recent Property Inquiries
                </h3>
              </div>
              <Link href="/admin/inquiries" className="text-xs text-amber-700 hover:underline">
                View All ({inquiries.length})
              </Link>
            </div>

            {recentInquiries.length > 0 ? (
              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">{inq.name}</span>
                      <span className="text-zinc-400 text-[10px]">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {inq.property_title && (
                      <p className="text-amber-800 font-medium">
                        Property: {inq.property_title} (ID #{inq.property_id})
                      </p>
                    )}
                    <p className="text-zinc-600 line-clamp-2 italic">&ldquo;{inq.message}&rdquo;</p>
                    <div className="flex items-center gap-3 text-zinc-400 pt-1 text-[11px]">
                      <span>{inq.email}</span>
                      {inq.phone && <span>• {inq.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
                No property inquiries received yet. Inquiries submitted on property detail pages will appear here.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-4">
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-600">
                <span>Manage Inquiries Inbox</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Contact Messages */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-zinc-950">
                  Recent Contact Messages
                </h3>
              </div>
              <Link href="/admin/inquiries" className="text-xs text-amber-700 hover:underline">
                View All ({messages.length})
              </Link>
            </div>

            {recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">{msg.name}</span>
                      <span className="text-zinc-400 text-[10px]">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className="text-zinc-800 font-medium">Subject: {msg.subject}</p>
                    )}
                    <p className="text-zinc-600 line-clamp-2 italic">&ldquo;{msg.message}&rdquo;</p>
                    <div className="flex items-center gap-3 text-zinc-400 pt-1 text-[11px]">
                      <span>{msg.email}</span>
                      {msg.phone && <span>• {msg.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
                No contact messages received yet. Messages sent via the public /contact page will appear here.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-4">
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-600">
                <span>View Full Messages Archive</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
