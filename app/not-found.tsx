import Link from 'next/link';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-6">
        <Building2 className="h-8 w-8" />
      </div>
      <h1 className="font-serif text-4xl font-bold tracking-tight">Residence Not Found</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-400">
        The architectural estate or page you are seeking does not exist or may have been transitioned off-market.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link href="/">
          <Button variant="outline" className="border-zinc-800 text-zinc-200 hover:bg-zinc-900 gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio Home</span>
          </Button>
        </Link>
        <Link href="/properties">
          <Button className="bg-amber-600 text-white hover:bg-amber-700">
            Browse Residences
          </Button>
        </Link>
      </div>
    </div>
  );
}
