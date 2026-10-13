import { getPropertyInquiries, getContactMessages } from '@/lib/db';
import { MessageSquare, Mail, Phone, Calendar, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const inquiries = await getPropertyInquiries();
  const contactMessages = await getContactMessages();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
          Client Inquiries & Dispatches
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Review incoming leads from property detail pages and general contact inquiries.
        </p>
      </div>

      {/* Property Inquiries Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          <h2 className="font-serif text-xl font-bold text-zinc-900">
            Residence Inquiries ({inquiries.length})
          </h2>
        </div>

        {inquiries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-2">
                  <div>
                    <h3 className="font-serif font-bold text-zinc-900 text-base">{inq.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(inq.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  {inq.property_id && (
                    <Link
                      href={`/properties/${inq.property_id}`}
                      target="_blank"
                      className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      Property #{inq.property_id} ↗
                    </Link>
                  )}
                </div>

                {inq.property_title && (
                  <p className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{inq.property_title}</span>
                  </p>
                )}

                <div className="rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700 italic border border-zinc-100">
                  &ldquo;{inq.message}&rdquo;
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-zinc-600">
                  <a
                    href={`mailto:${inq.email}`}
                    className="flex items-center gap-1.5 hover:text-amber-700 font-medium"
                  >
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{inq.email}</span>
                  </a>
                  {inq.phone && (
                    <a
                      href={`tel:${inq.phone}`}
                      className="flex items-center gap-1.5 hover:text-amber-700 font-medium"
                    >
                      <Phone className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{inq.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-xs text-zinc-400">
            No residence inquiries submitted yet.
          </div>
        )}
      </div>

      {/* General Contact Messages Section */}
      <div className="space-y-4 pt-6 border-t border-zinc-200">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-amber-600" />
          <h2 className="font-serif text-xl font-bold text-zinc-900">
            General Contact Dispatches ({contactMessages.length})
          </h2>
        </div>

        {contactMessages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-2">
                  <div>
                    <h3 className="font-serif font-bold text-zinc-900 text-base">{msg.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {msg.subject && (
                  <p className="text-xs font-semibold text-zinc-800">
                    Subject: <span className="text-zinc-600 font-normal">{msg.subject}</span>
                  </p>
                )}

                <div className="rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700 italic border border-zinc-100">
                  &ldquo;{msg.message}&rdquo;
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-zinc-600">
                  <a
                    href={`mailto:${msg.email}`}
                    className="flex items-center gap-1.5 hover:text-amber-700 font-medium"
                  >
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{msg.email}</span>
                  </a>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="flex items-center gap-1.5 hover:text-amber-700 font-medium"
                    >
                      <Phone className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{msg.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-xs text-zinc-400">
            No general contact messages received yet.
          </div>
        )}
      </div>
    </div>
  );
}
