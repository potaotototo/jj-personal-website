# Drop-in migration notes

## If you are starting from the V4 HTML prototype

Use this folder as the new project root. The V4 single-file prototype has been split into Next.js components and data/config files.

1. Run `npm install`.
2. Run `npm run dev`.
3. Edit `src/content/portfolio.ts` first.
4. Tune reveal thresholds and desktop positions in `src/config/introTimeline.ts`.
5. Replace the email and placeholder project links before publishing.
6. Deploy the repository root to Vercel.

## If you already have a Next.js App Router repo

Copy these folders into your existing `src/` directory:

- `components/`
- `config/`
- `content/`
- `hooks/`
- `lib/`

Then merge:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/opengraph-image.tsx`
- `src/app/icon.svg`

Add Vitest only if you want to keep the included timeline tests.

## The two files you will edit most

`src/content/portfolio.ts`

All normal copy, links, metrics, project details, Experience text and About text.

`src/config/introTimeline.ts`

Reveal sequence, reveal duration, camera scale and desktop positions.
