# Wang Jingjing — technical portfolio drop-in

A modular Next.js implementation of the V4 portfolio direction. The cinematic intro is driven by normalized scroll progress and a declarative reveal timeline rather than one-off reveal events.

## Run

```bash
npm install
npm run dev
```

For a production check:

```bash
npm test
npm run lint
npm run build
```

Deploy the repo directly to Vercel. No server-side services or environment variables are required.

## Edit copy in one place

Almost all site copy lives in:

`src/content/portfolio.ts`

That file contains:

- navigation labels
- NUS education details
- Morgan Stanley overview, technical write-up and metrics
- About copy
- all three project descriptions, metrics, diagrams and links
- contact details
- cinematic intro copy

You should not need to touch JSX to update normal portfolio content.

## Tune the cinematic intro

The reveal order, timing and desktop positions are separated from the copy:

`src/config/introTimeline.ts`

Each intro node has:

- `at`: normalized reveal threshold, 0 to 1
- `duration`: reveal window
- `position`: desktop spatial coordinates and width
- optional `variant` for statement/project typography
- optional `fromY`
- optional `fromScale`

The reusable reveal math is in:

`src/lib/timeline.ts`

The scroll observer is in:

`src/hooks/useScrollProgress.ts`

The key property is that the UI is a pure function of current scroll progress. There is no remembered "step" state to get skipped when the wheel/trackpad moves quickly.

## Reposition intro objects

Desktop positions live beside the reveal thresholds in `src/config/introTimeline.ts`. Change the `left` / `right` / `top` / `bottom` values there. No component edits are needed.

Mobile automatically switches to a vertical reading sequence at 960px and below.

## Orpheus Pro

The repo does not include a commercial font file. The CSS already prefers `Orpheus Pro` when it is installed locally.

If your licence permits self-hosting, add your own file at:

`public/fonts/OrpheusPro-Regular.woff2`

Then uncomment the `@font-face` block near the top of `src/app/globals.css`. It uses `font-display: optional` to reduce late font swapping and layout shift.

## Links to replace before publishing

In `src/content/portfolio.ts`:

- replace `replace-me@example.com`
- add LinkedIn
- replace placeholder Live Demo / Benchmarks / Documentation links
- replace private/on-request placeholders if public artifacts become available

## Why this intro is more reliable than V4

V4 tied node legibility mostly to opacity while the camera transform changed continuously. The new version defines every reveal independently with a fixed threshold and motion window. Fast scrolling simply samples a later point on the same timeline; it cannot skip a persistent state transition because there is no persistent transition state to skip.

Resize is also remeasured through `ResizeObserver`, desktop/mobile behavior is explicitly separated, and reduced-motion users receive the same content as a static sequence.
