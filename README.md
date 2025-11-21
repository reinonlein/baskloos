# Baskloos - Foto Gallery

Een moderne foto gallery website gebouwd met Next.js, Sanity CMS, en Tailwind CSS.

## Features

- 🖼️ Responsive image gallery met blur placeholders
- 📱 Volledig responsive design
- ⚡ Geoptimaliseerd voor performance (AVIF/WebP support, compressie, caching)
- 🎨 Modern UI met smooth animaties
- 📸 Sanity CMS integratie voor content management

## Tech Stack

- **Next.js 16** - React framework met SSR/SSG
- **Sanity CMS** - Headless CMS voor content management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TypeScript** - Type safety

## Setup

### 1. Clone de repository

```bash
git clone <repository-url>
cd baskloos
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Configureer environment variables

Maak een `.env.local` bestand:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Sanity Studio

De Sanity Studio draait apart van de Next.js app:

```bash
# Lokale ontwikkeling
npm run studio

# Deploy naar Sanity
npm run deploy-studio
```

Zie [DEPLOY_STUDIO.md](./DEPLOY_STUDIO.md) voor meer informatie.

## Deploy naar Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push je code naar GitHub
2. Import het project in Vercel
3. Voeg environment variables toe:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
4. Deploy!

## Project Structuur

```
├── components/          # React components
├── pages/              # Next.js pages
├── public/             # Static assets
├── schemaTypes/        # Sanity schema definities
├── styles/             # Global styles
├── utils/              # Utility functions
└── sanity.config.ts    # Sanity configuratie
```

## Optimalisaties

- ✅ Image optimization met Next.js Image component
- ✅ AVIF/WebP format support
- ✅ Blur placeholders voor betere UX
- ✅ Static generation voor snelle laadtijden
- ✅ Compressie en caching geconfigureerd
- ✅ SWC minification

## License

MIT
