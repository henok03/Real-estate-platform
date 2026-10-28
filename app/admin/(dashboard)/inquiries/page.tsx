import { getPropertyInquiries, getContactMessages } from '@/lib/db';
import { AdminInquiriesManager } from '@/components/admin/AdminInquiriesManager';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const inquiries = await getPropertyInquiries();
  const contactMessages = await getContactMessages();

  return (
    <AdminInquiriesManager
      inquiries={inquiries}
      contactMessages={contactMessages}
    />
  );
}