import { getProperties } from '@/lib/db';
import { AdminPropertyList } from '@/components/admin/AdminPropertyList';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  // Fetch all properties (any status)
  const properties = await getProperties();

  return <AdminPropertyList initialProperties={properties} />;
}
