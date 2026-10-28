
'use client';

import dynamic from 'next/dynamic';

const PropertyDetailsMap = dynamic(
  () => import('./PropertyDetailsMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500">
        Loading interactive map...
      </div>
    ),
  }
);

interface PropertyDetailsMapLoaderProps {
  latitude: number | string | null;
  longitude: number | string | null;
  title: string;
  address?: string | null;
}

export default function PropertyDetailsMapLoader(
  props: PropertyDetailsMapLoaderProps
) {
  return <PropertyDetailsMap {...props} />;
}
