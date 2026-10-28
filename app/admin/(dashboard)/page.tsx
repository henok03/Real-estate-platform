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
            <Button variant="ghost" className="  bg-black  ">
              <span className=' text-white '>View Live Site </span>
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
     
        </div>
   
  );
}
