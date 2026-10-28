
import { ImageResponse } from 'next/og';
import fs from 'node:fs/promises';
import path from 'node:path';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
  const logoPath = path.join(
    process.cwd(),
    'public',
    'images',
    'logo.png'
  );

  const logoBuffer = await fs.readFile(logoPath);
  const logoBase64 = logoBuffer.toString('base64');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
  src={`data:image/png;base64,${logoBase64}`}
  alt=""
  width="32"
  height="32"
  style={{ objectFit: 'contain' }}
/>
      </div>
    ),
    {
      ...size,
    }
  );
}
