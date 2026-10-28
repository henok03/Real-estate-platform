
import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
  const logoUrl = new URL(
    '/images/logo.png',
    'http://localhost:3000'
  );

  const response = await fetch(logoUrl);

  if (!response.ok) {
    throw new Error('Could not load /images/logo.png');
  }

  const logoBuffer = await response.arrayBuffer();

  return new ImageResponse(
    (
      <img
        src={`data:image/png;base64,${Buffer.from(logoBuffer).toString('base64')}`}
        width="32"
        height="32"
        style={{ objectFit: 'contain' }}
      />
    ),
    { ...size }
  );
}
