'use client';

import { useState, useTransition } from 'react';
import { submitPropertyInquiryAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PropertyInquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function PropertyInquiryForm({ propertyId, propertyTitle }: PropertyInquiryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('propertyId', String(propertyId));

    setStatus(null);
    startTransition(async () => {
      const res = await submitPropertyInquiryAction(undefined, formData);
      setStatus(res);
      if (res?.success) {
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-serif text-lg font-bold text-zinc-950">Inquire About This Residence</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Direct private briefing for <span className="font-semibold text-zinc-700">{propertyTitle}</span>
        </p>
      </div>

      {status?.success ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
          <h4 className="text-sm font-bold text-emerald-900">Inquiry Received</h4>
          <p className="text-xs text-emerald-700 mt-1">
            Our luxury advisory team has received your message and will arrange a private consultation shortly.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus(null)}
            className="mt-4 text-xs bg-white text-emerald-800 border-emerald-300"
          >
            Send Another Inquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status?.error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{status.error}</span>
            </div>
          )}

          <div>
            <Label htmlFor="inq-name" required>
              Your Full Name
            </Label>
            <Input
              id="inq-name"
              name="name"
              placeholder="e.g. Eleanor Vance"
              required
              disabled={isPending}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="inq-email" required>
                Email Address
              </Label>
              <Input
                id="inq-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={isPending}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="inq-phone">Phone Number</Label>
              <Input
                id="inq-phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                disabled={isPending}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="inq-message" required>
              Confidential Message
            </Label>
            <Textarea
              id="inq-message"
              name="message"
              rows={4}
              defaultValue={`I am interested in scheduling a private viewing or requesting the offering prospectus for ${propertyTitle}.`}
              required
              disabled={isPending}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting Inquiry...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Confidential Inquiry</span>
              </>
            )}
          </Button>

          <p className="text-[11px] text-zinc-400 text-center">
            Your inquiry is transmitted confidentially to our licensed private estate advisors.
          </p>
        </form>
      )}
    </div>
  );
}
