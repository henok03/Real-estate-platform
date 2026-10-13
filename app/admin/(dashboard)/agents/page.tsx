import { getAgents } from '@/lib/db';
import { AdminAgentsManager } from '@/components/admin/AdminAgentsManager';

export const dynamic = 'force-dynamic';

export default async function AdminAgentsPage() {
  const agents = await getAgents();

  return <AdminAgentsManager initialAgents={agents} />;
}
