# 💸 Personal Finance Tracker

A modern, high-performance personal finance management web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Prisma 7**, **Neon Serverless Postgres**, and **Better Auth**.

Track income and expenses, monitor category budgets with visual progress indicators, analyze cash flows with interactive SVG charts, and export financial data with ease.

---

## ✨ Features

### 📊 Interactive Dashboard (`/`)
- **Key Financial Metrics**: Live stat cards displaying Total Balance, Monthly Income, Monthly Expenses, and Savings Rate with trend badges.
- **Wallet Balance Area Chart**: Interactive SVG time-series visualization with dynamic range switching (`7D`, `1M`, `3M`, `6M`, `1Y`, `ALL`) and hover tooltips.
- **Expense Breakdown Donut Chart**: Proportional category spending visualization with percentage breakdowns.
- **Recent Transactions Feed**: Quick glance at the latest transactions with category icons, relative timestamps, and one-click navigation.

### 💳 Transaction Management (`/transactions`)
- **Search & Filter**: Search transactions by keyword in descriptions or categories; filter by type (`All`, `Income`, `Expense`).
- **Data Pagination**: Smooth paginated transaction list with items-per-page controls.
- **CSV Export**: Instantly export filtered or complete transaction history to a `.csv` file.
- **Inline Actions**: Delete transactions directly from the table with instant optimistic updates and toast confirmations.

### ➕ Quick Transaction Entry (`/inputs`)
- Quick toggle between **Income** and **Expense**.
- Precision decimal amount input (`step="any"`, `min="0.01"`).
- Intuitive category selector with custom category fallback.
- Date picker and optional notes/descriptions.
- Client-side validation with responsive alert boxes and toast notifications.

### 🎯 Budgets & Spend Caps (`/budgets`)
- **Monthly Overall Cap**: Set an overall monthly spending limit and monitor burn rate and remaining balance.
- **Category-Level Budgets**: User-specific budget thresholds persisted in PostgreSQL (`CategoryBudget` model).
- **Progress Tracking**: Color-coded progress bars indicating normal, warning (80%+), and over-limit states.
- **Cash Flow Comparison**: Side-by-side In vs. Out bar comparison for the active month.

### 📈 Financial Reports (`/reports`)
- Comprehensive monthly financial statements detailing income, expenses, and net savings.

### 🔐 Authentication & Security (`/login`, `/signup`)
- Powered by **Better Auth** with `@better-auth/prisma-adapter`.
- Session persistence via secure, HTTP-only cookies (`nextCookies`).
- Password hashing, credentials auth, and automatic sign-in upon registration.
- User-isolated data: Every transaction and budget row is tied to the authenticated user ID.

### 🎨 Design & Feedback System
- **Collapsible Sidebar**: Easily toggle between expanded (`w-64`) and compact icon-only (`w-20`) navigation via the hamburger button beside the logo.
- **Notification Dropdown**: Real-time alerts in the top bar highlighting any category exceeding its budget limit.
- **Complete Feedback System**:
  - Global reactive toast notifications (`useToast` / `ToastProvider`).
  - Skeleton loaders and spinner states (`app/loading.tsx`, `LoadingSpinner`, `Skeleton`).
  - Graceful empty states (`EmptyState`).
  - Resilient client error boundaries (`app/error.tsx`, `ErrorState`, `ErrorAlert`).

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16.3.0](https://nextjs.org/) | App Router, Server Actions, Route Handlers, Turbopack |
| **Library** | [React 19.2.8](https://react.dev/) | Latest React concurrent features and hooks |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across frontend and API |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS variable tokens, fast `@tailwindcss/postcss` engine |
| **Database** | [Neon Postgres](https://neon.tech/) | Serverless PostgreSQL via `@neondatabase/serverless` |
| **ORM** | [Prisma 7.9.1](https://www.prisma.io/) | Prisma ORM with `@prisma/adapter-neon` adapter |
| **Authentication**| [Better Auth 1.6.27](https://www.better-auth.com/) | Type-safe authentication with Prisma adapter |
| **Data Viz** | Pure SVG Charts | Custom, lightweight, dependency-free interactive Area and Donut charts |
| **Package Manager**| [pnpm 11.20](https://pnpm.io/) | Fast, disk-efficient package management |

---

## 📁 Project Structure

```text
personal-finance-tracker/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/      # Better Auth API handler
│   │   ├── budgets/            # Category budget limits API (GET, POST)
│   │   └── transactions/       # Transaction CRUD API (GET, POST, DELETE)
│   ├── budgets/                # Monthly budgets & spending limits page
│   ├── components/             # Reusable UI components
│   │   ├── charts/             # Pure SVG charts (Area, Donut, Sparkline)
│   │   ├── app-shell.tsx       # Root layout shell with Sidebar, Topbar & ToastProvider
│   │   ├── empty-state.tsx     # Reusable empty data states
│   │   ├── error-state.tsx     # Error cards and alert banners
│   │   ├── icons.tsx           # Category and navigation SVG icons
│   │   ├── loading-state.tsx   # Loading spinners and card skeletons
│   │   ├── sidebar.tsx         # Collapsible navigation drawer
│   │   ├── stat-card.tsx       # Metric cards with trend indicators
│   │   ├── toast.tsx           # Context-based Toast notification system
│   │   └── topbar.tsx          # Header with user profile and budget alerts
│   ├── help/                   # Help & support documentation page
│   ├── inputs/                 # Add transaction entry form page
│   ├── login/                  # Login page
│   ├── reports/                # Financial reports & monthly statement page
│   ├── settings/               # Account & preferences settings page
│   ├── signup/                 # Registration page
│   ├── transactions/           # Full transactions table page (search, filter, CSV export)
│   ├── error.tsx               # Next.js global client error boundary
│   ├── globals.css             # Tailwind CSS v4 design tokens and theme rules
│   ├── layout.tsx              # Root HTML layout and font imports
│   ├── loading.tsx             # Root Suspense loading placeholder
│   └── page.tsx                # Overview dashboard page
├── lib/
│   ├── auth.ts                 # Better Auth server configuration & Prisma adapter
│   ├── auth-client.ts          # Better Auth client-side hooks & methods
│   ├── format.ts               # Currency, number, and date formatters
│   ├── hooks.ts                # Client hooks (useAuthSession, etc.)
│   ├── prisma.ts               # Singleton PrismaClient with Neon driver adapter
│   └── types.ts                # Shared TypeScript definitions
├── prisma/
│   └── schema.prisma           # Prisma database schema definition
├── .env.example                # Template for environment variables
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- [pnpm](https://pnpm.io/installation) (v10 or v11)
- A hosted [Neon PostgreSQL](https://neon.tech/) database (or local PostgreSQL instance)

---

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Open `.env` and fill in your database credentials and secret key:

```env
# Neon PostgreSQL database connection string
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-generated-secret-key-here"
BETTER_AUTH_URL="http://localhost:3100"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3100"
```

> **Tip**: You can generate a secure random string for `BETTER_AUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

### Step 4: Synchronize Database Schema

Push the Prisma schema to your Neon database and generate the Prisma Client:

```bash
pnpm exec prisma db push
```

*(Optional)* If you wish to inspect and browse your database records visually:

```bash
pnpm exec prisma studio
```

### Step 5: Start the Development Server

```bash
pnpm dev
```
testing just do wahagt i awnt
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application will start on **[http://localhost:3100](http://localhost:3100)** with Turbopack enabled.

---

## 📜 Available Scripts

| Script | Command | Purpose |
|---|---|---|
| **Development** | `pnpm dev` | Starts the Next.js development server on port `3100` |
| **Build** | `pnpm build` | Generates the Prisma client and creates an optimized production build |
| **Start** | `pnpm start` | Runs the compiled production server |
| **Lint** | `pnpm lint` | Runs ESLint to inspect code quality |
| **Prisma Push** | `pnpm exec prisma db push` | Pushes the schema state to the database without generating migrations |
| **Prisma Generate** | `pnpm exec prisma generate` | Regenerates Prisma Client types into `lib/generated/prisma` |
| **Prisma Studio** | `pnpm exec prisma studio` | Opens an interactive web GUI to view and edit database rows |

---

## 🗄️ Database Schema Overview

The database schema is defined in [`prisma/schema.prisma`](file:///Users/asuna/Documents/eKYC/personal-finance-tracker/prisma/schema.prisma):

- **`User`**: Core user record storing identity, email, and timestamps.
- **`Session`**: Active login sessions managed by Better Auth.
- **`Account`**: Provider and hashed password credentials for authentication.
- **`Verification`**: Security tokens for email or account verification.
- **`Transaction`**: Records individual financial transactions (`income` or `expense`) with decimal amounts, categories, dates, and descriptions, indexed by `userId`.
- **`CategoryBudget`**: Stores per-user, per-category monthly budget allowances with a unique constraint on `[userId, category]`.

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
