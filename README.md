# eDMS Landing Page

The marketing site for **eDMS**, a self-hosted document management system for office networks. eDMS covers versioning, an approval workflow, an append-only audit log, and access based on roles and departments.

Built by [QUINAS](https://quinas-official.vercel.app/).

## Tech stack

- [SvelteKit 2](https://svelte.dev/docs/kit) with Svelte 5 (runes)
- [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [Vite 8](https://vite.dev/)
- TypeScript
- [Lucide](https://lucide.dev/) icons (`@lucide/svelte`)
- [sharp](https://sharp.pixelplumbing.com/) for generating icons

The site is fully prerendered (`export const prerender = true` in `src/routes/+layout.ts`), so it builds to static HTML.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Scripts

| Command               | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `npm run dev`         | Start the Vite dev server                                     |
| `npm run build`       | Build the site for production                                 |
| `npm run preview`     | Preview the production build locally                          |
| `npm run check`       | Type-check the project with `svelte-check`                    |
| `npm run check:watch` | Type-check in watch mode                                      |
| `npm run icons`       | Regenerate favicons, touch icons and wordmarks from the logo  |

## Project structure

```
src/
├── app.css              Global styles and Tailwind setup
├── app.html             HTML shell (fonts, theme bootstrapping)
├── lib/
│   ├── actions/         Svelte actions (scroll reveal)
│   ├── components/      Page sections and UI components
│   ├── brand.ts         Brand constants
│   ├── diff.ts          Word diff used by the version history demo
│   └── theme.svelte.ts  Light/dark theme state
└── routes/
    ├── +layout.svelte
    ├── +layout.ts       Enables prerendering
    └── +page.svelte     Landing page (assembles the sections)
scripts/
└── generate-icons.mjs   Exports PNG/ICO icons from static/logo.svg
static/                  Logos, favicons and the web manifest
```

### Page sections

The landing page (`src/routes/+page.svelte`) is made of these sections, in order:

1. **Hero**: headline and app mockup
2. **Features**
3. **Version History**: word-level diff between document versions
4. **Workflow**: draft → review → approved
5. **Architecture**: two apps with one central server
6. **Security**: role- and department-based access
7. **Get Started**: setup for development and production (LAN server)
8. **Roadmap**

## Theming

The site supports light and dark modes. A small inline script in `src/app.html` applies the saved theme (or the system preference) before first paint to avoid a flash, and `ThemeToggle.svelte` lets visitors switch.

## Brand assets

`static/logo.svg` is the source for every icon. After editing it, run:

```bash
npm run icons
```

This regenerates:

- `static/favicon.ico`, `static/favicon-32.png`
- `static/apple-touch-icon.png`, `static/icon-192.png`, `static/icon-512.png`
- `static/brand/logo-256.png`, `static/brand/logo-1024.png`
- `static/brand/logo-wordmark(.svg|.png)` and `logo-wordmark-white(.svg|.png)`

## Deployment

The project uses `@sveltejs/adapter-auto`, which detects supported hosts (Vercel, Netlify, Cloudflare Pages and others) automatically. To deploy anywhere that serves static files, switch to [`@sveltejs/adapter-static`](https://svelte.dev/docs/kit/adapter-static) in `svelte.config.js`.
