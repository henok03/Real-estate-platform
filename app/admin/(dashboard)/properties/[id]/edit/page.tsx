import { notFound } from 'next/navigation';
import { getPropertyById, getAgents } from '@/lib/db';
import { PropertyForm } from '@/components/admin/PropertyForm';

export const dynamic = 'force-dynamic';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  if (!id) notFound();

  const property = await getPropertyById(id);
  if (!property) notFound();

  const agents = await getAgents();

  return <PropertyForm initialProperty={property} agents={agents} />;
}
