'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Mail, Phone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createAgentAction } from '@/lib/actions';
import type { Agent } from '@/types';

interface AdminAgentsManagerProps {
  initialAgents: Agent[];
}

export function AdminAgentsManager({ initialAgents }: AdminAgentsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await createAgentAction({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          bio: bio.trim() || undefined,
          image_url: imageUrl.trim() || undefined,
        });

        setSuccess('Agent successfully registered in the database.');
        setName('');
        setEmail('');
        setPhone('');
        setBio('');
        setImageUrl('');
        setShowModal(false);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to register agent.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
            Licensed Agent Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Associate licensed broker representatives with property listings in PostgreSQL.
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Agent</span>
        </Button>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {initialAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialAgents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-100 border border-zinc-200">
                    {agent.image_url ? (
                      <Image
                        src={agent.image_url}
                        alt={agent.name}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-serif text-xl font-bold text-zinc-600 bg-amber-50">
                        {agent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-zinc-900">{agent.name}</h3>
                    <span className="text-xs text-zinc-400">ID #{agent.id}</span>
                  </div>
                </div>

                {agent.bio && (
                  <p className="mt-4 text-xs leading-relaxed text-zinc-600 line-clamp-3">
                    {agent.bio}
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-4 space-y-2 text-xs text-zinc-600">
                {agent.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{agent.email}</span>
                  </div>
                )}
                {agent.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{agent.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-3">
            <Users className="h-7 w-7 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-zinc-900">
            No agents registered yet.
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">
            The agents table is initially empty. Click below to add an authorized agent to represent your properties.
          </p>
          <div className="mt-5">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register First Agent</span>
            </Button>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-zinc-900 mb-1">Register Estate Agent</h2>
            <p className="text-xs text-zinc-500 mb-6">
              Create an agent record in the <code className="text-amber-700">agents</code> PostgreSQL table.
            </p>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="reg-agent-name" required>
                  Full Legal Name
                </Label>
                <Input
                  id="reg-agent-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Victoria Sterling"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-agent-email">Email Address</Label>
                  <Input
                    id="reg-agent-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="victoria@auraestates.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="reg-agent-phone">Direct Phone</Label>
                  <Input
                    id="reg-agent-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (212) 555-0199"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reg-agent-image">Profile Photo URL</Label>
                <Input
                  id="reg-agent-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="reg-agent-bio">Professional Biography</Label>
                <Textarea
                  id="reg-agent-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Senior broker associate specializing in Manhattan pre-war cooperatives and waterfront villas..."
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
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
                    'Register Agent'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
