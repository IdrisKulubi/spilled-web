import { MetadataRoute } from 'next'
import { metaData } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: metaData.title,
    short_name: 'Spilled',
    description: metaData.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F9',
    theme_color: '#D96BA0',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['safety', 'social', 'lifestyle'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ]
  }
}