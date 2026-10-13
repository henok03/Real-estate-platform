import { getAgents } from '@/lib/db';
import { PropertyForm } from '@/components/admin/PropertyForm';

export const dynamic = 'force-dynamic';

export default async function AddPropertyPage() {
  const agents = await getAgents();

  return <PropertyForm agents={agents} />;
}
