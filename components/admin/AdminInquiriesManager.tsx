'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Loader2 ,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { togglePropertyInquiryReadAction, toggleContactMessageReadAction ,deletePropertyInquiryAction, deleteContactMessageAction,} from '@/lib/actions';

interface Inquiry {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  created_at: string | Date;
  property_id?: string | number | null;
  property_title?: string | null;
  is_read?: boolean;
}

interface ContactMessage {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  created_at: string | Date;
  is_read?: boolean;
}

interface AdminInquiriesManagerProps {
  inquiries: Inquiry[];
  contactMessages: ContactMessage[];
}

export function AdminInquiriesManager({ inquiries, contactMessages }: AdminInquiriesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'unread' | 'read' | 'all'>('unread');
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
const [deleteTarget, setDeleteTarget] = useState<{
  id: string | number;
  type: 'inquiry' | 'contact';
} | null>(null);
  // Filter items based on active tab
  const filteredInquiries = inquiries.filter((inq) => {
    if (activeTab === 'unread') return !inq.is_read;
    if (activeTab === 'read') return inq.is_read;
    return true;
  });

const handleDeleteInquiry = (id: string | number) => {
  setDeleteTarget({ id, type: 'inquiry' });
};

const handleDeleteContactMessage = (id: string | number) => {
  setDeleteTarget({ id, type: 'contact' });
};

const confirmDelete = () => {
  if (!deleteTarget) return;

  const target = deleteTarget;

  startTransition(async () => {
    try {
      if (target.type === 'inquiry') {
        await deletePropertyInquiryAction(String(target.id));
      } else {
        await deleteContactMessageAction(String(target.id));
      }

      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert('Could not delete. Please try again.');
    }
  });
};

  const filteredContactMessages = contactMessages.filter((msg) => {
    if (activeTab === 'unread') return !msg.is_read;
    if (activeTab === 'read') return msg.is_read;
    return true;
  });

  const handleToggleInquiryRead = (id: string | number, currentReadStatus: boolean) => {
    setLoadingId(`inq-${id}`);
    startTransition(async () => {
      try {
        await togglePropertyInquiryReadAction(id, !currentReadStatus);
        router.refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingId(null);
      }
    });
  };

  const handleToggleContactRead = (id: string | number, currentReadStatus: boolean) => {
    setLoadingId(`msg-${id}`);
    startTransition(async () => {
      try {
        await toggleContactMessageReadAction(id, !currentReadStatus);
        router.refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingId(null);
      }
    });
  };

const unreadInquiriesCount = inquiries.filter((i) => !i.is_read).length;
  const unreadMessagesCount = contactMessages.filter((m) => !m.is_read).length;
  const totalUnread = unreadInquiriesCount + unreadMessagesCount;

  return (
    <div className="space-y-8">
      {/* Header and Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
            Client Inquiries & Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Review incoming leads from property detail pages and general contact inquiries.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'unread'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <span>Unanswered / Unread</span>
            {totalUnread > 0 && (
              <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] text-white font-bold">
                {totalUnread}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('read')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'read'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Seen / Answered
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            All Messages
          </button>
        </div>
      </div>

      {/* Property Inquiries Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          <h2 className="font-serif text-xl font-bold text-zinc-900">
            Residence Inquiries ({filteredInquiries.length})
          </h2>
        </div>

        {filteredInquiries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className={`rounded-2xl border p-5 shadow-sm space-y-3 transition-colors ${
                  inq.is_read ? 'bg-zinc-50/60 border-zinc-200' : 'bg-white border-amber-200 ring-1 ring-amber-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-zinc-900 text-base">{inq.name}</h3>
                      {!inq.is_read && (
                        <span className="rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(inq.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {inq.property_id && (
                      <Link
                        href={`/properties/${inq.property_id}`}
                        target="_blank"
                        className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                      >
                        Property #{inq.property_id} ↗
                      </Link>
                    )}

                   

<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => handleToggleInquiryRead(inq.id, !!inq.is_read)}
  disabled={isPending && loadingId === `inq-${inq.id}`}
  className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 font-medium ${
    inq.is_read
      ? "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
      : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
  }`}
>
  {loadingId === `inq-${inq.id}` ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : inq.is_read ? (
    <EyeOff className="h-4 w-4" />
  ) : (
    <Eye className="h-4 w-4" />
  )}

  {inq.is_read ? "Mark as Unread" : "Mark as Seen"}
</Button>
<Button
  type="button"
  variant="ghost"
  size="icon"
  title="Delete inquiry"
  disabled={isPending}
  onClick={() => handleDeleteInquiry(inq.id)}
  className="h-9 w-9border-red-600border border-red-200 bg-white text-red-600
             hover:bg-red-50 hover:text-red-700"
>
  <Trash2 className="h-4 w-4" />
</Button>
                  </div>
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

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1 text-zinc-600">
                  <div className="flex items-center gap-4">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-xs text-zinc-400">
            No residence inquiries in this section.
          </div>
        )}
      </div>

      {/* General Contact Messages Section */}
      <div className="space-y-4 pt-6 border-t border-zinc-200">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-amber-600" />
          <h2 className="font-serif text-xl font-bold text-zinc-900">
            General Contact Dispatches ({filteredContactMessages.length})
          </h2>
        </div>

        {filteredContactMessages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContactMessages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-2xl border p-5 shadow-sm space-y-3 transition-colors ${
                  msg.is_read ? 'bg-zinc-50/60 border-zinc-200' : 'bg-white border-amber-200 ring-1 ring-amber-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-zinc-900 text-base">{msg.name}</h3>
                      {!msg.is_read && (
                        <span className="rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                 
                  
<div className="flex items-center gap-2">
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={() => handleToggleContactRead(msg.id, !!msg.is_read)}
    disabled={isPending && loadingId === `msg-${msg.id}`}
    className="h-8 w-8 text-zinc-400 hover:text-amber-700"
    title={msg.is_read ? 'Mark as Unread' : 'Mark as Seen'}
  >
    {loadingId === `msg-${msg.id}` ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : msg.is_read ? (
      <EyeOff className="h-4 w-4 text-zinc-400" />
    ) : (
      <Eye className="h-4 w-4 text-amber-600" />
    )}
  </Button>

  <Button
    type="button"
    variant="ghost"
    size="icon"
    title="Delete contact message"
    disabled={isPending}
    onClick={() => handleDeleteContactMessage(msg.id)}
   className="h-8 w-8 border border-zinc-800 bg-zinc-900 text-white
           hover:bg-red-600 hover:text-white"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
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
            No general contact messages in this section.
          </div>
        )}
      </div>
      {deleteTarget && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>

      <h2 className="mt-4 text-lg font-bold text-zinc-900">
        Confirm deletion
      </h2>

      <p className="mt-2 text-sm text-zinc-600">
        Are you sure you want to delete this message permanently?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="ghost"
          disabled={isPending}
          onClick={() => setDeleteTarget(null)}
          className=' text-white bg-zinc-900 hover:bg-zinc-950 '
        >
          Cancel
        </Button>

        <Button
          disabled={isPending}
          onClick={confirmDelete}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}