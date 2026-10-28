'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Building2, ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle, Info } from 'lucide-react';
import { loginAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center mb-8"
      >
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            Aura <span className="text-amber-400">Estates</span>
          </span>
        </Link>
        <h1 className="mt-6 font-serif text-2xl font-bold tracking-tight text-white">
          Executive Admin Portal
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Secure, server-side authentication for verified estate administrators
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl"
      >
        {state?.error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-950/50 border border-rose-800/80 p-3.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <Label htmlFor="admin-email" className="text-zinc-200">
              Admin Email Address
            </Label>
            <div className="relative mt-1">
              <Input
                id="admin-email"
                name="email"
                type="email"
                placeholder="example@auraestates.com"
               
                required
                disabled={isPending}
                className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500 pl-10"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-password" className="text-zinc-200">
                Master Password
              </Label>
            </div>
            <div className="relative mt-1">
              <Input
                id="admin-password"
                name="password"
                type="password"
               placeholder="Enter your master password"
                required
                disabled={isPending}
                className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500 pl-10"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-500 text-zinc-950 hover:bg-amber-400 h-11 font-semibold gap-2 shadow-lg shadow-amber-500/10 cursor-pointer active:scale-[0.99] transition-transform"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </Button>
        </form>

        {/* First time credentials notice */}
     

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Return to Public Website</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
