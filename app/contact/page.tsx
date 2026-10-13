'use client';

import { useState, useTransition } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitContactMessageAction } from '@/lib/actions';

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStatus(null);

    startTransition(async () => {
      const res = await submitContactMessageAction(undefined, formData);
      setStatus(res);
      if (res?.success) {
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-zinc-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Direct Inquiries
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 mt-2">
                Connect With Our Advisory
              </h1>
              <p className="mt-3 text-base text-zinc-600 leading-relaxed">
                Whether inquiring about a specific estate, requesting private acquisition advisory, or
                seeking confidential property disposition, our partners are at your service.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content Grid */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 5 Cols: Office Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-zinc-950 mb-6">
                  Private Office & Salons
                </h2>

                <div className="space-y-6 text-sm text-zinc-600">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-zinc-900 font-semibold mb-1">
                        Global Headquarters
                      </strong>
                      <p>450 Park Avenue, 28th Floor</p>
                      <p>New York, NY 10022</p>
                      <p className="text-xs text-zinc-400 mt-1">United States</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-zinc-900 font-semibold mb-1">
                        Private Telephone Line
                      </strong>
                      <a href="tel:+18005552872" className="hover:text-amber-600 transition-colors">
                        +1 (800) 555-AURA (2872)
                      </a>
                      <p className="text-xs text-zinc-400 mt-1">Direct broker routing available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-zinc-900 font-semibold mb-1">
                        Electronic Dispatch
                      </strong>
                      <a
                        href="mailto:concierge@auraestates.com"
                        className="hover:text-amber-600 transition-colors"
                      >
                        concierge@auraestates.com
                      </a>
                      <p className="text-xs text-zinc-400 mt-1">End-to-end PGP encrypted upon request</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block text-zinc-900 font-semibold mb-1">Office Hours</strong>
                      <p>Monday – Friday: 08:30 – 19:00 EST</p>
                      <p>Saturday: Private appointment only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map presentation card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-zinc-900 mb-2">
                  Manhattan Gallery Location
                </h3>
                <p className="text-xs text-zinc-500 mb-4">
                  Situated in the heart of Midtown Manhattan on Park Avenue.
                </p>
                <div className="aspect-[16/9] w-full rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center text-center p-4 text-zinc-500">
                  <MapPin className="h-8 w-8 text-amber-600 mb-1" />
                  <span className="text-xs font-semibold text-zinc-800">450 Park Avenue, NY 10022</span>
                  <span className="text-[11px] text-zinc-400">Lat: 40.7618° N, Long: 73.9712° W</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=450+Park+Avenue+New+York+NY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-amber-600 hover:underline font-semibold"
                  >
                    Open in Maps Application ↗
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right 7 Cols: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-zinc-950">Transmit a Message</h2>
                <p className="text-sm text-zinc-500 mt-1 mb-8">
                  Your communication is stored securely in our PostgreSQL database and routed immediately to
                  the managing director.
                </p>

                {status?.success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center"
                  >
                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
                    <h3 className="font-serif text-xl font-bold text-emerald-950">
                      Message Dispatched Successfully
                    </h3>
                    <p className="text-sm text-emerald-700 mt-2 max-w-md mx-auto">
                      Thank you for contacting Aura Estates. A senior advisor will review your correspondence
                      and respond within one business day.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStatus(null)}
                      className="mt-6 bg-white text-emerald-800 border-emerald-300"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status?.error && (
                      <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                        <span>{status.error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name" required>
                          Full Name
                        </Label>
                        <Input
                          id="contact-name"
                          name="name"
                          placeholder="e.g. Lord Charles Sterling"
                          required
                          disabled={isPending}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-email" required>
                          Email Address
                        </Label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          placeholder="charles@example.com"
                          required
                          disabled={isPending}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-phone">Telephone (Optional)</Label>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (212) 555-0188"
                          disabled={isPending}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-subject">Subject</Label>
                        <Input
                          id="contact-subject"
                          name="subject"
                          placeholder="e.g. Acquisition Brief / Private Portfolio Inquiry"
                          disabled={isPending}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact-message" required>
                        Detailed Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        placeholder="Please share details regarding your property criteria, geographic requirements, or specific estate representation needs..."
                        required
                        disabled={isPending}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-12 text-sm font-semibold gap-2 shadow transition-all active:scale-[0.99]"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Transmit Secure Correspondence</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
