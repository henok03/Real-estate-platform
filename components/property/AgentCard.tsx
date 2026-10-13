import Image from 'next/image';
import { Mail, Phone, Award } from 'lucide-react';
import type { Agent } from '@/types';

interface AgentCardProps {
  agent: Agent;
}

// Validates whether the image_url is a relative path or absolute URL
const isValidImageUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  );
};

export function AgentCard({ agent }: AgentCardProps) {
  const hasValidImage = isValidImageUrl(agent.image_url);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-4">
        <Award className="h-4 w-4" />
        <span>Listing Representation</span>
      </div>

      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-100 border border-zinc-200">
          {hasValidImage ? (
            <Image
              src={agent.image_url!}
              alt={agent.name}
              fill
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-xl font-bold text-zinc-600 bg-amber-50">
              {agent.name?.charAt(0) || 'A'}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-lg font-bold text-zinc-950 truncate">
            {agent.name}
          </h4>
          <p className="text-xs text-zinc-500 font-medium">
            Licensed Senior Broker Associate
          </p>

          {agent.bio && (
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 line-clamp-3">
              {agent.bio}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4 text-xs">
        {agent.phone && (
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center gap-2.5 text-zinc-700 hover:text-amber-600 transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-amber-600" />
            <span>{agent.phone}</span>
          </a>
        )}
        {agent.email && (
          <a
            href={`mailto:${agent.email}`}
            className="flex items-center gap-2.5 text-zinc-700 hover:text-amber-600 transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-amber-600" />
            <span className="truncate">{agent.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}