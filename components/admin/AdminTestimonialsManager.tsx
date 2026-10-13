'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquareQuote,
  PlusCircle,
  Star,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  createTestimonialAction,
  toggleTestimonialPublishedAction,
  deleteTestimonialAction,
} from '@/lib/actions';
import type { Testimonial } from '@/types';

interface AdminTestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export function AdminTestimonialsManager({ initialTestimonials }: AdminTestimonialsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientTitle, setClientTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Delete modal
  const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);

  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !content.trim()) {
      setError('Client name and review content are required.');
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await createTestimonialAction({
          client_name: clientName.trim(),
          client_title: clientTitle.trim() || undefined,
          content: content.trim(),
          rating,
          is_published: isPublished,
        });

        setSuccess('Testimonial record successfully written to PostgreSQL.');
        setClientName('');
        setClientTitle('');
        setContent('');
        setRating(5);
        setIsPublished(true);
        setShowAddModal(false);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to save testimonial');
      }
    });
  };

  const handleTogglePublish = (id: string, currentPublished: boolean) => {
    startTransition(async () => {
      await toggleTestimonialPublishedAction(id, !currentPublished);
      router.refresh();
    });
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    startTransition(async () => {
      await deleteTestimonialAction(itemToDelete.id);
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
            Client Testimonials Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage authenticated testimonials stored in the <code className="text-amber-700 font-mono">testimonials</code> database table.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Testimonials List */}
      {initialTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialTestimonials.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border p-6 bg-white shadow-sm flex flex-col justify-between transition-all ${
                t.is_published ? 'border-zinc-200' : 'border-zinc-200 bg-zinc-50/70 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3 mb-3">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  {t.is_published ? (
                    <Badge variant="success">Published</Badge>
                  ) : (
                    <Badge variant="muted">Hidden</Badge>
                  )}
                </div>

                <p className="text-xs sm:text-sm italic leading-relaxed text-zinc-700">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-zinc-900 text-sm">{t.client_name}</h4>
                    {t.client_title && (
                      <p className="text-[11px] text-zinc-500">{t.client_title}</p>
                    )}
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(t.id, t.is_published)}
                      disabled={isPending}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                      title={t.is_published ? 'Unpublish from public homepage' : 'Publish to public homepage'}
                    >
                      {t.is_published ? (
                        <EyeOff className="h-4 w-4 text-amber-700" />
                      ) : (
                        <Eye className="h-4 w-4 text-emerald-700" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setItemToDelete(t)}
                      disabled={isPending}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete testimonial"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-3">
            <MessageSquareQuote className="h-7 w-7 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-zinc-900">
            No testimonials recorded yet.
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">
            In compliance with our zero fake data policy, the <code className="font-mono">testimonials</code> database table starts empty. Click below to add an authentic client review.
          </p>
          <div className="mt-5">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add First Testimonial</span>
            </Button>
          </div>
        </div>
      )}

      {/* Add Testimonial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-zinc-900 mb-1">
              Add Verified Testimonial
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Inserts into table <code className="text-amber-700 font-mono">testimonials</code>.
            </p>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateTestimonial} className="space-y-4">
              <div>
                <Label htmlFor="t-client-name" required>
                  Client Name
                </Label>
                <Input
                  id="t-client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Alistair & Genevieve Thorne"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="t-client-title">
                  Client Title / Distinction (Optional)
                </Label>
                <Input
                  id="t-client-title"
                  value={clientTitle}
                  onChange={(e) => setClientTitle(e.target.value)}
                  placeholder="e.g. Architectural Collector, London & Zurich"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="t-rating">Rating (1 to 5 Stars)</Label>
                <select
                  id="t-rating"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  className="mt-1 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Highly Recommended)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Satisfactory)</option>
                  <option value={2}>★★☆☆☆ (2 Stars)</option>
                  <option value={1}>★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="t-content" required>
                  Testimonial Content
                </Label>
                <Textarea
                  id="t-content"
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Aura Estates handled the acquisition of our Manhattan penthouse with absolute discretion and precision..."
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="t-published"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950"
                />
                <Label htmlFor="t-published" className="cursor-pointer font-normal text-xs text-zinc-700">
                  Publish immediately to public website homepage
                </Label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Add Testimonial'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-zinc-900 mb-2">Delete Testimonial?</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to permanently delete the review from{' '}
              <strong>{itemToDelete.client_name}</strong>?
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
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Review'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
