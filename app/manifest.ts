import type { MetadataRoute } from 'next';

// Official mobile architecture: Next.js Farmer PWA.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/?app=farmer',
    name: 'FarmPlug AI Farmer',
    short_name: 'FarmPlug',
    description: 'Farmer-first farm-to-market intelligence and order tracking.',
    start_url: '/?app=farmer',
    scope: '/',
    display: 'standalone',
    background_color: '#f7fbf7',
    theme_color: '#166534',
    orientation: 'portrait',
    categories: ['agriculture', 'business', 'productivity'],
    icons: [
      {
        src: '/icons/farmplug-icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/farmplug-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
