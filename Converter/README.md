This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## SEO and Structured Data Guidelines

This project is configured for strong SEO signals and structured data across calculator pages.

- Canonical site URL is defined in `src/lib/seo.ts` (`siteUrl`) and used by `robots.ts` and `sitemap.ts`.
- Global indexing headers are enabled in `next.config.ts` via `X-Robots-Tag: index, follow`.
- Each calculator route defines per-page metadata via `buildMetadata()` in its `layout.tsx`.
- Structured data is injected using the `StructuredData` component with helpers from `src/lib/seo.ts`.

### Per-page Metadata

Use `buildMetadata()` in `src/app/<route>/layout.tsx`:

```ts
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'FD Calculator',
  description: 'Calculate Fixed Deposit maturity and interest...',
  keywords: ['fd calculator', 'fixed deposit', 'compound interest'],
  path: '/fd-calculator'
})
```

### Structured Data

- WebPage JSON-LD:
  - Use `getWebPageJsonLd({ name, description, url, breadcrumb })`.
  - Optional `breadcrumbItems` allows precise control over labels/hrefs.
- WebApplication JSON-LD:
  - Use `getWebAppJsonLd({ name, description, url, applicationCategory })`.
  - For calculators, set `applicationCategory: 'Finance'`.

Example in `page.tsx`:

```tsx
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'

const jsonLd = useMemo(() => getWebPageJsonLd({
  name: 'FD Calculator – Fixed Deposit',
  description: 'Calculate FD maturity and interest with flexible compounding.',
  url: `${siteUrl}/fd-calculator`,
  breadcrumb: ['ToolSynth', 'Calculators', 'FD Calculator']
}), [])

const webAppJsonLd = useMemo(() => getWebAppJsonLd({
  name: 'FD Calculator',
  description: 'Web-based FD calculator for maturity and interest computation.',
  url: `${siteUrl}/fd-calculator`,
  applicationCategory: 'Finance'
}), [])

return (
  <>
    <StructuredData data={jsonLd} />
    <StructuredData data={webAppJsonLd} />
    {/* rest of page */}
  </>
)
```

### Robots and Sitemap

- `src/app/robots.ts` dynamically references `siteUrl` for the sitemap link.
- `src/app/sitemap.ts` includes all calculator routes and uses `siteUrl` to avoid hardcoding.

### Core Web Vitals Checklist

- LCP
  - Use `next/image` with width/height and `priority` for above-the-fold images.
  - Preload critical fonts, limit large background images, and reduce render-blocking CSS.
- INP/TBT
  - Avoid heavy sync JS on interaction paths, use dynamic imports and memoization.
  - Virtualize long lists, debounce inputs, and keep computations off the main thread when possible.
- CLS
  - Always specify dimensions for images/media, avoid injecting content above the fold.
  - Use font-display and reserve space for asynchronous UI.

### QA and Validation Process

For each calculator page:
- Verify unique, descriptive metadata in `layout.tsx` (title, description, keywords, path).
- Confirm both WebPage and WebApplication JSON-LD are present via `view-source:` or DevTools Elements.
- Ensure breadcrumb labels match the navigation category and page title.
- Confirm `robots.txt` includes the correct sitemap URL and that all calculators appear in `sitemap.xml`.
- Run Lighthouse SEO checks locally and on production.

## How to Run Validators

- Google Rich Results Test
  - https://search.google.com/test/rich-results
  - Use a public URL (e.g., `https://techsynth.net/fd-calculator`). For local pages, copy the JSON-LD from `view-source:` and use the code snippet option.

- Schema Markup Validator (schema.org)
  - https://validator.schema.org/
  - Paste the page URL or the JSON-LD to validate types like `WebPage` and `WebApplication`.

- Structured Data Linter (alternative)
  - https://www.structured-data-linter.com/
  - Useful for cross-checking JSON-LD output.

- Lighthouse SEO
  - In Chrome DevTools: Open the page, go to the Lighthouse panel, choose the SEO category, and run the audit.
  - CLI (global):
    ```bash
    npm i -g lighthouse
    lighthouse https://techsynth.net/fd-calculator --only-categories=seo --view
    ```
  - Local dev: `npm run dev` then open `http://localhost:3000/<route>` and run the DevTools Lighthouse audit.

- Quick local verification of JSON-LD (Windows PowerShell):
  ```powershell
  # Start dev server first: npm run dev
  Invoke-WebRequest http://localhost:3000/fd-calculator | Select-String "application/ld\+json"
  ```

### Adding a New Calculator Page (SEO steps)

- Create the route under `src/app/<new-calculator>/`.
- Add `layout.tsx` using `buildMetadata()` with title, description, keywords, and path.
- In `page.tsx`, inject `StructuredData` with both `getWebPageJsonLd()` and `getWebAppJsonLd()`.
- Update `src/app/sitemap.ts` to include the new route.
- If applicable, add to `src/app/generateStaticParams.ts` for pre-rendering.

Following these guidelines will help ensure strong discoverability, eligibility for rich results, and consistent indexing across all calculator pages.
