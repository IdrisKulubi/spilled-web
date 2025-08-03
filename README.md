# Spilled Web

The companion web platform for Spilled - a Next.js application providing landing pages, legal information, and web-based access to the dating safety community platform.

## Overview

Spilled Web serves as the web presence for the TeaKE ecosystem, offering:

- **Landing pages** with product information and app download links
- **Legal pages** including privacy policy, terms of service, and about information
- **Contact forms** for user support and inquiries
- **Responsive design** optimized for all devices
- **Modern UI** built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Turbopack for fast development

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd spilled-web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Project Structure

```
spilled-web/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── about/       # About page
│   │   ├── contact/     # Contact form and page
│   │   ├── privacy/     # Privacy policy
│   │   ├── terms/       # Terms of service
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Homepage
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui base components
│   │   ├── landing/    # Landing page components
│   │   └── layout/     # Header, footer, navigation
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utilities and configurations
├── public/             # Static assets
└── components.json     # shadcn/ui configuration
```

## Key Features

### Design System
- Consistent color scheme with TeaKE mobile app
- Primary color: #D96BA0 (Muted Rose)
- Background: #FFF8F9 (Light Blush White)
- Responsive design with mobile-first approach

### Components
- Reusable UI components built with Radix UI
- Form components with validation
- Layout components for consistent structure
- Landing page sections for product showcase

### Pages
- **Homepage**: Product introduction and app download
- **About**: Information about the platform and mission
- **Contact**: Support form and contact information
- **Privacy**: Privacy policy and data handling
- **Terms**: Terms of service and usage guidelines

## Development Guidelines

### File Naming
- Components: PascalCase (e.g., `HeroSection.tsx`)
- Pages: lowercase with hyphens (e.g., `about/page.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)

### Import Aliases
- `@/*` maps to `src/*`
- Use absolute imports: `import { Button } from '@/components/ui/Button'`

### Styling
- Tailwind CSS v4 with custom configuration
- shadcn/ui components for consistent design
- CSS variables for theming
- Mobile-first responsive design

## Related Projects

This web application is part of the TeaKE ecosystem:
- **TeaKE Mobile App**: React Native app for dating safety community
- **Shared Design System**: Consistent branding and user experience

## Contributing

1. Follow the established file structure and naming conventions
2. Use TypeScript with strict mode
3. Implement responsive design for all components
4. Test forms and user interactions thoroughly
5. Maintain consistency with the overall TeaKE brand

## Deployment

The application is optimized for deployment on Vercel:

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

For other platforms, use the standard Next.js build output in the `.next` directory.

## Support

For questions or issues related to the web platform, use the contact form or reach out through the established support channels.
