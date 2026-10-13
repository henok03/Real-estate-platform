import { getAllTestimonials } from '@/lib/db';
import { AdminTestimonialsManager } from '@/components/admin/AdminTestimonialsManager';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return <AdminTestimonialsManager initialTestimonials={testimonials} />;
}
