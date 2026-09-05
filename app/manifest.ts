import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FarmPlug AI Farmer',
    short_name: 'FarmPlug',
    description: 'Farmer-first farm-to-market intelligence and order tracking.',
    start_url: '/?app=farmer',
    display: 'standalone',
    background_color: '#f7fbf7',
    theme_color: '#166534',
    orientation: 'portrait',
    categories: ['agriculture', 'business', 'productivity'],
  };
}
