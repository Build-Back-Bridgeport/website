# Build Back Bridgeport

Multilingual public website for [Build Back Bridgeport](https://buildbackbridgeport.com) — community plans, petition signatures, volunteer outreach, and contact.

**Repository:** [github.com/Build-Back-Bridgeport/website](https://github.com/Build-Back-Bridgeport/website)

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) with React 19
- [next-intl](https://next-intl.dev/) — English, Spanish, Portuguese, and Haitian Creole (`en`, `es`, `pt`, `ht`)
- [Prisma](https://www.prisma.io/) + PostgreSQL (petition signatures and plan content)
- [Tailwind CSS](https://tailwindcss.com/) + Radix / Base UI components

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (22 LTS recommended)
- [pnpm](https://pnpm.io/)
- A PostgreSQL database (e.g. [Supabase](https://supabase.com/))

## Local development

```bash
git clone https://github.com/Build-Back-Bridgeport/website.git
cd website
pnpm install
cp .env.example .env
# Edit .env with your values, then:
pnpm db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Routes are locale-prefixed (e.g. `/en`, `/es/plans`).

### Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (pooled URL for the app) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO and Open Graph |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Address autocomplete on petition/pledge forms |
| `PETITION_SIGNATURE_BASE` | Display offset added to the live signature count |

For `pnpm db:migrate`, use a **direct** database URL (port 5432) if your provider requires it for migrations; see comments in `.env.example`.

### Database scripts

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:migrate` | Apply migrations in development |
| `pnpm db:push` | Push schema without migration files |
| `pnpm db:seed-plans` | Load plan markdown from `data/plans/` into the database |

### Other scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |

## Project layout

```
app/[lang]/          # Locale-scoped pages (site, petition, pledge, plans)
components/          # UI and layout components
data/plans/          # Plan markdown per language (source for db:seed-plans)
i18n/                # next-intl routing and navigation
lib/                 # Data access, SEO, site config, Prisma client
messages/            # UI copy (en.json, es.json, pt.json, ht.json)
prisma/              # Schema and migrations
scripts/             # One-off maintenance scripts
```

---

## Contributing

Thank you for helping improve the site. Contributions are welcome via issues and pull requests.

### Before you start

1. Check [open issues](https://github.com/Build-Back-Bridgeport/website/issues) or open one to discuss larger changes.
2. Fork the repo and work on a branch off `main`.
3. Set up local development (see above) and confirm `pnpm lint` and `pnpm build` pass before opening a PR.

### Branch naming

Use short, descriptive branch names:

- `fix/contact-form-validation`
- `feat/plan-category-filter`
- `docs/readme-env-vars`

### Pull request process

1. Keep PRs focused — one feature or fix per PR when possible.
2. Fill in the PR description: what changed, why, and how you tested it.
3. Link related issues (`Fixes #123` or `Relates to #456`).
4. Ensure CI checks pass (lint and build).
5. Request review from a maintainer. Address feedback with additional commits on the same branch.

Maintainers will squash-merge or merge depending on project preference; keep commit messages clear either way.

### Code guidelines

- **TypeScript** — Prefer explicit types at module boundaries; avoid `any`.
- **React** — Use Server Components by default; add `"use client"` only when needed (hooks, browser APIs, interactivity).
- **Styling** — Use Tailwind utility classes; match existing spacing, typography, and component patterns in `components/`.
- **Imports** — Use the `@/` path alias (e.g. `@/components/header`).
- **i18n** — Never hardcode user-facing strings in components. Add keys to **all four** locale files under `messages/` (`en.json`, `es.json`, `pt.json`, `ht.json`). Use `useTranslations()` in client components and the server APIs from `next-intl` on the server.
- **Locales** — Supported languages are defined in `lib/site.ts` (`SUPPORTED_LANGS`). Changing locales requires updates to routing, messages, and any locale-specific content.
- **Plans** — Long-form plan content lives in `data/plans/{lang}/*.md`. After editing markdown, run `pnpm db:seed-plans` locally to sync the database (or document in the PR if a maintainer should run it in production).
- **Database** — Schema changes go through Prisma: edit `prisma/schema.prisma`, run `pnpm db:migrate`, and commit the generated migration under `prisma/migrations/`.
- **Secrets** — Do not commit `.env`, API keys, or signature data. `.env` and `data/signatures.json` are gitignored.

### Commit messages

Write concise, imperative subject lines:

- `Add volunteer page share button`
- `Fix petition count on mobile`
- `Update Spanish translations for contact page`

Optional body: brief context and testing notes.

### Accessibility and UX

- Use semantic HTML and accessible labels on forms and interactive controls.
- Test keyboard navigation and screen reader basics for UI changes.
- Verify layouts on mobile and desktop.

### Reporting bugs

Include steps to reproduce, expected vs actual behavior, browser/device if relevant, and screenshots when helpful. Do not paste real user emails or petition data in public issues.

### Questions

Open a [GitHub issue](https://github.com/Build-Back-Bridgeport/website/issues) with the `question` label or reach the team at [info@buildbackbridgeport.com](mailto:info@buildbackbridgeport.com).

## License

This project is private (`"private": true` in `package.json`). Contact the Build Back Bridgeport maintainers for permission to use or redistribute the code.
