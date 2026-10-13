'use client';

import { useActionState, useState } from 'react';
import { KeyRound, ShieldCheck, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { changePasswordAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSecurityPage() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, undefined);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
          Security & Password Management
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Update the administrator credential for database authentication and session keys.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-zinc-900">Change Master Password</h2>
            <p className="text-xs text-zinc-500">
              Passwords are salted and cryptographically hashed with bcrypt before being written to PostgreSQL.
            </p>
          </div>
        </div>

        {state?.success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <strong className="block font-semibold">Password Successfully Updated</strong>
              <span>Your new administrative password has been securely hashed and stored.</span>
            </div>
          </div>
        )}

        {state?.error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <Label htmlFor="currentPassword" required>
              Current Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter existing password"
                required
                disabled={isPending}
                className="pl-9"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Default password if unchanged: <code className="text-zinc-600 font-mono">AdminPassword123!</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword" required>
                New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Min. 8 characters"
                  required
                  disabled={isPending}
                  className="pl-9"
                  minLength={8}
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" required>
                Confirm New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  required
                  disabled={isPending}
                  className="pl-9"
                  minLength={8}
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Hashing & Saving...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Update Password</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
