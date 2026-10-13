'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Edit,
  Archive,
  Trash2,
  ExternalLink,
  PlusCircle,
  Search,
  AlertTriangle,
  Building,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPropertyType } from '@/components/property/PropertyCard';
import { archivePropertyAction, deletePropertyAction } from '@/lib/actions';
import type { Property, PropertyType, PropertyStatus } from '@/types';

interface AdminPropertyListProps {
  initialProperties: Property[];
}

export function AdminPropertyList({ initialProperties }: AdminPropertyListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Confirmation dialog states
  const [itemToArchive, setItemToArchive] = useState<Property | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Property | null>(null);

  // Filtered properties
  const filtered = initialProperties.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (typeFilter !== 'all' && p.property_type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      const matchAddress = p.address?.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchAddress) return false;
    }
    return true;
  });

  const handleArchiveConfirm = () => {
    if (!itemToArchive) return;
    startTransition(async () => {
      await archivePropertyAction(itemToArchive.id);
      setItemToArchive(null);
      router.refresh();
    });
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    startTransition(async () => {
      await deletePropertyAction(itemToDelete.id);
      setItemToDelete(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
            Property Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Browse, inspect, modify, and manage publishing states for all residences.
          </p>
        </div>

        <Link href="/admin/properties/new">
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow">
            <PlusCircle className="h-4 w-4" />
            <span>Add Residence</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Input
              placeholder="Search title, city, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900"
            >
              <option value="all">All Types</option>
              <option value="single_family">Single Family</option>
              <option value="villa">Villa</option>
              <option value="condo">Condo</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / Card List */}
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Residence</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {filtered.map((property) => (
                  <tr key={property.id} className="hover:bg-zinc-50/60 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                          {property.primary_image ? (
                            <Image
                              src={property.primary_image}
                              alt={property.title}
                              fill
                              referrerPolicy="no-referrer"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                              <Building className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[200px] sm:max-w-xs">
                          <Link
                            href={`/properties/${property.id}`}
                            target="_blank"
                            className="font-medium text-zinc-900 hover:text-amber-700 truncate block"
                          >
                            {property.title}
                          </Link>
                          <span className="text-[11px] text-zinc-400">ID #{property.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-semibold text-zinc-900">
                      {formatCurrency(property.price)}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-zinc-600">
                      {[property.city, property.state].filter(Boolean).join(', ') || '—'}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                        {formatPropertyType(property.property_type)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {property.status === 'published' && (
                        <Badge variant="success">Published</Badge>
                      )}
                      {property.status === 'draft' && (
                        <Badge variant="warning">Draft</Badge>
                      )}
                      {property.status === 'archived' && (
                        <Badge variant="muted">Archived</Badge>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-zinc-400">
                      {new Date(property.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/properties/${property.id}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
                            title="View Public Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-600 hover:text-zinc-900"
                            title="Edit Property"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        {property.status !== 'archived' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setItemToArchive(property)}
                            className="h-8 w-8 text-amber-600 hover:text-amber-800"
                            title="Archive Property"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setItemToDelete(property)}
                          className="h-8 w-8 text-rose-500 hover:text-rose-700"
                          title="Delete Property"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-3">
            <Building className="h-7 w-7 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-zinc-900">
            {initialProperties.length === 0
              ? 'No properties created yet.'
              : 'No properties match the selected filters.'}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">
            {initialProperties.length === 0
              ? 'Your PostgreSQL property database is currently pristine and empty. Click below to add your first real estate listing.'
              : 'Try clearing the search term or resetting the status and type filters.'}
          </p>
          <div className="mt-5">
            <Link href="/admin/properties/new">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add First Residence</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      {itemToArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <Archive className="h-6 w-6" />
              <h3 className="font-serif text-lg font-bold text-zinc-900">Archive Property?</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to archive <strong>{itemToArchive.title}</strong>? It will no longer
              appear publicly on the website, but its historical records and inquiries remain safely preserved.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItemToArchive(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleArchiveConfirm}
                disabled={isPending}
                className="bg-amber-600 text-white hover:bg-amber-700"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Archive'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-serif text-lg font-bold text-zinc-900">Permanently Delete?</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              This action cannot be undone. Are you certain you want to permanently delete{' '}
              <strong>{itemToDelete.title}</strong> and its associated images from PostgreSQL?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItemToDelete(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Permanently Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
