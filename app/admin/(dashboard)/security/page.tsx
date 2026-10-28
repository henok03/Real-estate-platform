
'use client';

import { useActionState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  AtSign,
} from 'lucide-react';
import {
  changePasswordAction,
  changeAdminEmailAction,
} from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSecurityPage() {
  const [passwordState, passwordFormAction, isPasswordPending] =
    useActionState(changePasswordAction, undefined);

  const [emailState, emailFormAction, isEmailPending] =
    useActionState(changeAdminEmailAction, undefined);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
          Security & Account Management
        </h1>
        <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
          Manage your administrator email and password securely.
        </p>
      </div>

      {/* Change Email */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-zinc-900">
              Change Administrator Email
            </h2>
            <p className="text-xs text-zinc-500">
              Confirm your current password before changing your email.
            </p>
          </div>
        </div>

        {emailState?.success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <strong className="block font-semibold">
                Email Successfully Updated
              </strong>
              <span>Your administrator email has been updated.</span>
            </div>
          </div>
        )}

        {emailState?.error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>{emailState.error}</span>
          </div>
        )}

        <form action={emailFormAction} className="space-y-5">
          <div>
            <Label htmlFor="currentPasswordEmail" required>
              Current Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="currentPasswordEmail"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                placeholder="Confirm your current password"
                required
                disabled={isEmailPending}
                className="pl-9"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="newEmail" required>
              New Email Address
            </Label>
            <div className="relative mt-1">
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={isEmailPending}
                className="pl-9"
              />
              <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmEmail" required>
              Confirm New Email
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                placeholder="Enter the new email again"
                required
                disabled={isEmailPending}
                className="pl-9"
              />
              <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isEmailPending}
              className="gap-2 bg-zinc-900 text-white shadow hover:bg-zinc-800"
            >
              {isEmailPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating Email...</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Update Email</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-zinc-900">
              Change Master Password
            </h2>
            <p className="text-xs text-zinc-500">
              Your password is hashed with bcrypt before being stored.
            </p>
          </div>
        </div>

        {passwordState?.success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <strong className="block font-semibold">
                Password Successfully Updated
              </strong>
              <span>Your new administrator password has been saved.</span>
            </div>
          </div>
        )}

        {passwordState?.error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>{passwordState.error}</span>
          </div>
        )}

        <form action={passwordFormAction} className="space-y-5">
          <div>
            <Label htmlFor="currentPassword" required>
              Current Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                placeholder="Enter existing password"
                required
                disabled={isPasswordPending}
                className="pl-9"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="newPassword" required>
                New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  required
                  disabled={isPasswordPending}
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
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  required
                  disabled={isPasswordPending}
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
              disabled={isPasswordPending}
              className="gap-2 bg-zinc-900 text-white shadow hover:bg-zinc-800"
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Password...</span>
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
      </section>
    </div>
  );
}
