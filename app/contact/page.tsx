
'use client';

import { useState, useTransition } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitContactMessageAction } from '@/lib/actions';

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    success?: boolean;
    error?: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus(null);

    startTransition(async () => {
      try {
        const result = await submitContactMessageAction(
          undefined,
          formData
        );

        setStatus(result);

        if (result?.success) {
          form.reset();
        }
      } catch {
        setStatus({
          error: 'Something went wrong. Please try again.',
        });
      }
    });
  };

  const contactItems = [
    {
      icon: MapPin,
      title: 'Our Office',
      description: (
        <>
          <p>Addis Ababa, Ethiopia</p>
          <p className="mt-1 text-xs text-zinc-400">
            Office address: add your actual address
          </p>
        </>
      ),
    },
    {
      icon: Phone,
      title: 'Call Our Team',
      description: (
        <>
          <a
            href="tel:+251911000000"
            className="font-medium text-zinc-800 transition-colors hover:text-amber-600"
          >
            +251 91 100 0000
          </a>
          <p className="mt-1 text-xs text-zinc-400">
            Replace with your actual business number
          </p>
        </>
      ),
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: (
        <>
          <a
            href="mailto:info@auraestates.com"
            className="break-all font-medium text-zinc-800 transition-colors hover:text-amber-600"
          >
            info@auraestates.com
          </a>
          <p className="mt-1 text-xs text-zinc-400">
            Replace with your actual business email
          </p>
        </>
      ),
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      description: (
        <>
          <p>Monday – Friday: 8:30 AM – 5:30 PM</p>
          <p>Saturday: 9:00 AM – 1:00 PM</p>
          <p className="mt-1 text-xs text-zinc-400">
            East Africa Time (EAT, UTC+3)
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f6f3] text-zinc-900">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Your Ethiopian Property Partner
              </div>

              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                Let&apos;s Find Your
                <span className="block text-amber-700">
                  Next Property.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8">
                Looking to buy, sell, or invest in real estate
                in Ethiopia? Contact Aura Estates for help
                exploring properties and your next opportunity.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-zinc-600 sm:text-sm">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  Personal guidance
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-700" />
                  Property inquiries
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-7">
            <motion.aside
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-1 space-y-5 lg:col-span-4"
            >
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
                    Get In Touch
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
                    Contact Details
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Reach out to discuss properties and real
                    estate opportunities in Ethiopia.
                  </p>
                </div>

                <div className="divide-y divide-zinc-100">
                  {contactItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex gap-3.5 py-4 first:pt-0 last:pb-0 sm:gap-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
                          <Icon className="h-[18px] w-[18px]" />
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <h3 className="mb-1.5 text-sm font-bold text-zinc-900">
                            {item.title}
                          </h3>

                          <div className="space-y-0.5 text-xs leading-5 text-zinc-600 sm:text-[13px]">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.aside>

            <motion.section
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 min-w-0 lg:col-span-8"
            >
              <div className="h-full rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-8 lg:p-9">
                <div className="mb-7 border-b border-zinc-100 pb-6 sm:mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
                    Send An Inquiry
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
                    How Can We Help You?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                    Tell us what you are looking for, and send
                    your inquiry to our team.
                  </p>
                </div>

                {status?.success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-10 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-9 w-9 text-emerald-700" />
                    </div>

                    <h3 className="mt-5 font-serif text-2xl font-bold text-emerald-950">
                      Message Sent Successfully
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-emerald-800">
                      Thank you for contacting Aura Estates.
                      Your inquiry has been submitted.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStatus(null)}
                      className="mt-6 border-emerald-300 bg-emerald-800 text-white hover:bg-emerald-900"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status?.error && (
                      <div
                        role="alert"
                        className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                      >
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                        <p>{status.error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="min-w-0">
                        <Label htmlFor="contact-name" required>
                          Full Name
                        </Label>
                        <Input
                          id="contact-name"
                          name="name"
                          placeholder="Enter your full name"
                          autoComplete="name"
                          required
                          disabled={isPending}
                          className="mt-2 h-11 rounded-xl border-zinc-200 bg-zinc-50/60 focus-visible:bg-white"
                        />
                      </div>

                      <div className="min-w-0">
                        <Label htmlFor="contact-email" required>
                          Email Address
                        </Label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                          disabled={isPending}
                          className="mt-2 h-11 rounded-xl border-zinc-200 bg-zinc-50/60 focus-visible:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="min-w-0">
                        <Label htmlFor="contact-phone">
                          Phone Number (Optional)
                        </Label>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          placeholder="+251 9X XXX XXXX"
                          autoComplete="tel"
                          disabled={isPending}
                          className="mt-2 h-11 rounded-xl border-zinc-200 bg-zinc-50/60 focus-visible:bg-white"
                        />
                      </div>

                      <div className="min-w-0">
                        <Label htmlFor="contact-subject">
                          Subject
                        </Label>
                        <Input
                          id="contact-subject"
                          name="subject"
                          placeholder="Buying, selling, renting..."
                          disabled={isPending}
                          className="mt-2 h-11 rounded-xl border-zinc-200 bg-zinc-50/60 focus-visible:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact-message" required>
                        Your Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        placeholder="Tell us the property type, preferred location, budget, or service you need..."
                        required
                        disabled={isPending}
                        className="mt-2 min-h-36 resize-y rounded-xl border-zinc-200 bg-zinc-50/60 leading-6 focus-visible:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-4 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-center gap-2 text-xs leading-5 text-zinc-500">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-amber-700" />
                        Your information is handled with care.
                      </p>

                      <Button
                        type="submit"
                        disabled={isPending}
                        className="h-12 w-full gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:min-w-48"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Your Message
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.section>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="order-3 mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:mt-8"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
                  Find Us
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
                  Explore Addis Ababa
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Addis Ababa, Ethiopia
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Addis+Ababa%2C+Ethiopia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 sm:self-center"
              >
                Get Directions
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="border-t border-zinc-100 p-3 pt-0 sm:p-5 sm:pt-0">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 sm:aspect-[16/6] lg:aspect-[21/6]">
                <iframe
                  title="Addis Ababa, Ethiopia map"
                  src="https://maps.google.com/maps?q=Addis%20Ababa%2C%20Ethiopia&z=12&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2 text-xs text-zinc-500 sm:text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-amber-700" />
                <span>Addis Ababa, Ethiopia</span>
              </div>

              <span className="text-xs font-medium text-zinc-400">
                Aura Estates
              </span>
            </div>
          </motion.section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
