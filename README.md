# Bhavy Kumbhani - Modern Developer Portfolio & CMS

A premium, production-ready, dark-mode-first developer portfolio and content management dashboard built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Features

- **Dynamic Identity**: Personal info, skills, projects, certifications, work experiences, and timelines are fully dynamic, eliminating the need to modify source code when your career evolves.
- **Private CMS Console (`/admin`)**: A secure administrative console containing forms to add, edit, or delete items. Changes write directly to local storage.
- **Local Git-CMS Workflow**: In local development, CMS saves write directly back into the local JSON files (`src/data/*.json`). This writes changes straight to your workspace, allowing you to track content changes in git!
- **Edge Security**: Dashboard routes are protected with Next.js Edge Middleware verifying a signed JWT cookie (`jose` based). No passwords are stored in source code.
- **Advanced Projects Showcases**: Deep-dive project detail pages (`/projects/[slug]`) demonstrating problems, solutions, custom checklists, challenges, and learnings.
- **Fluid Visual Design**: Elegant charcoal backdrop, vivid emerald accent highlights, sticky navigation blurring, neon glow boxes, terminal visual elements, and smooth responsive views.

---

## 1. Installation

Install project dependencies:

```bash
npm install
```

## 2. Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site, and [http://localhost:3000/admin](http://localhost:3000/admin) to access the administrative dashboard console.

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local` to configure authentication credentials:

```bash
cp .env.example .env.local
```

Modify the variables:
- `JWT_SECRET`: A secure key used for signing session cookies. Make this at least 32 characters long.
- `ADMIN_USERNAME`: Username required to log into the `/admin` console.
- `ADMIN_PASSWORD`: Password required to log into the `/admin` console.

*Note: In local development, fallback defaults (`admin` / `admin123`) are provided to allow immediate out-of-the-box operations.*

---

## 4. central Content Files

All content is structured inside `src/data/`:
- `profile.json`: Name, titles, locations, social links, bios.
- `skills.json`: Categorized list of technical skills and current expertise states.
- `projects.json`: Core featured projects, challenges, screenshots, and URLs.
- `experience.json`: Work history, companies, and roles (initially empty).
- `journey.json`: Career timeline logs.
- `education.json`: Academic degrees.
- `certifications.json`: Professional credentials.

---

## 5. Vercel Deployment

1. Push your local repository to a **private** GitHub repository (to protect `.env.local` contents and keep dashboard operations confidential).
2. Connect your repository to **Vercel** via the Vercel Dashboard.
3. In the Vercel project settings, add the following **Environment Variables**:
   - `JWT_SECRET` (A strong, unique 32+ character random string)
   - `ADMIN_USERNAME` (Your private username)
   - `ADMIN_PASSWORD` (Your private password)
4. Trigger a deployment. Vercel automatically builds and optimizes your static routes.

---

## 6. Future Expansion Roadmap

### Database Integration (Phase 2)
To scale this website to support multiple administrative authors or real-time persistence in production (since Vercel serverless filesystems are read-only):
1. Provision a PostgreSQL instance (e.g. Supabase, Vercel Postgres, or Neon).
2. Install Prisma or direct drivers:
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```
3. Update `src/lib/data-service.ts` data access functions (e.g., `getProjects()`, `saveProjects()`) to perform Prisma model queries (e.g., `prisma.project.findMany()`) instead of reading/writing JSON files. Because UI components consume data from this single service layer, **no frontend components will need refactoring!**

### Auth0 / NextAuth / Clerk Integration
To implement enterprise-grade user sign-ins:
1. Install NextAuth or Clerk:
   ```bash
   npm install next-auth
   ```
2. Replace credentials check in `/api/auth/login` and Edge Middleware validation in `src/middleware.ts` with Clerk/NextAuth route handlers.
