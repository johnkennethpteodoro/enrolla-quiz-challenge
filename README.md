# Full-Stack Quiz Application

A production-ready quiz application built with Hono (backend) and Next.js (frontend), featuring real-time timer, state management with Valtio, and deployed on Cloudflare Workers + Vercel.

## 🔗 Live Demo

-   **Frontend**: https://your-app.vercel.app
-   **Backend API**: https://your-api.workers.dev

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000

### Backend (Hono API)

```bash
cd backend
npm install
npm run dev
```

Runs on http://localhost:8787

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
npm run deploy
```

## 🏗️ Architecture Decisions

### Runtime Choice: Edge Runtime (Cloudflare Workers)

**Backend**: Uses Cloudflare Workers (Edge runtime) for the Hono API

-   **Why**: Global distribution, sub-50ms response times, zero cold starts
-   **Trade-off**: Limited to 128MB memory (sufficient for mock data)
-   Deployed via Wrangler CLI

**Frontend**: Next.js App Router with default Node.js runtime

-   **Why**: No need for Edge runtime since backend is already globally distributed
-   **Trade-off**: Simpler setup, no Edge-specific constraints

### State Management: Valtio

**Why Valtio over alternatives:**

-   **Lightweight**: 2.3KB vs Zustand (3.5KB) or Redux (43KB)
-   **Proxy-based**: Direct mutations feel natural (`store.answers[id] = value`)
-   **Minimal boilerplate**: No actions, reducers, or dispatch
-   **Familiarity**: Used in my other projects; fast implementation

## ✅ Validation Approach

### Backend Validation (Hono API)

```javascript
// POST /api/grade
if (!body.answers || !Array.isArray(body.answers)) {
	return c.json({ error: "Invalid request: answers must be an array" }, 400);
}
```

**What's validated:**

-   ✅ Request body structure (must have `answers` array)
-   ✅ Question existence (checks if question ID exists)
-   ✅ Type coercion (converts user input to correct types)
-   ✅ Array sorting for checkbox answers (order-independent comparison)

**What's NOT validated** (conscious trade-off):

-   ❌ No schema validation library (Zod/Yup)
    -   **Why**: Keeping dependencies minimal for Cloudflare Workers
    -   **Risk**: Malformed payloads could cause runtime errors (mitigated by try-catch)
-   ❌ No deep type checking on answer values
    -   **Why**: TypeScript provides compile-time safety; runtime validation adds overhead
    -   **Mitigation**: Frontend ensures correct types before submission

### Frontend Validation

```typescript
// Pre-submission check
const unanswered = store.questions.filter((q) => !(q.id in store.answers));
if (unanswered.length > 0) {
	toast.error(`Please answer all questions. ${unanswered.length} remaining.`);
	return;
}
```

**What's validated:**

-   ✅ All questions answered before submission
-   ✅ Progress bar shows completion status
-   ✅ Submit button disabled until all answered
-   ✅ Input constraints (radio = single choice, checkbox = multiple)

**Error handling:**

-   Toast notifications for user feedback (via `sonner`)
-   Try-catch blocks wrap all async operations
-   Graceful degradation (retry button on fetch failure)

## 📚 Libraries & Rationale

### Frontend Dependencies

| Library           | Purpose             | Why This One?                                       |
| ----------------- | ------------------- | --------------------------------------------------- |
| **Next.js 16**    | React framework     | App Router for modern file-based routing            |
| **Valtio 2.2**    | State management    | Lightweight, proxy-based, minimal boilerplate       |
| **TailwindCSS 4** | Styling             | Utility-first, rapid development, small bundle      |
| **Sonner**        | Toast notifications | Beautiful, accessible, 3KB library                  |
| **Lucide React**  | Icons               | Tree-shakeable, modern icon set (Send icon only)    |
| **TypeScript 5**  | Type safety         | Strict mode enabled, catches errors at compile-time |

### Backend Dependencies

| Library          | Purpose        | Why This One?                            |
| ---------------- | -------------- | ---------------------------------------- |
| **Hono 4.10**    | Web framework  | Fastest edge framework, Express-like API |
| **Wrangler**     | Cloudflare CLI | Official deployment tool for Workers     |
| **TypeScript 5** | Type safety    | Strong typing for API contracts          |

**No database/ORM**: Per requirements, using in-memory mock data in `data/questions.ts`

## ⚖️ Trade-offs & Compromises

❌ **No schema validation library**: Manual validation instead of Zod

-   Saved ~30min setup, minor risk of unhandled edge cases
-   Trade-off accepted: TypeScript + try-catch provides adequate safety

❌ **Basic UI polish**: Functional but not highly animated

-   Focused on UX (loading, errors, progress) over visual flair
-   Could add transitions with Framer Motion given more time

❌ **No unit tests**: Per bonus options, chose timer + Valtio over tests

-   Would test grading logic with Vitest if more time available

## 🎯 Bonus Features Implemented

### 1. ⏱️ Timed Quiz (30 minutes)

-   Real-time countdown in MM:SS format
-   Red pulsing animation when < 30 seconds remaining
-   Auto-submit when timer expires
-   Accepts partial answers for graceful UX

### 2. 🏪 Custom State Management (Valtio)

-   Implemented global state with Valtio proxy instead of `useState` + Context
-   Simpler than Redux/Zustand for this use case
-   Direct mutations without dispatch
-   TypeScript-safe with IntelliSense
-   ~2KB overhead

## 🕐 Time Spent (Honest Breakdown)

**Backend (Hono API)**: ~3-4 hours

-   API routes: 1hr
-   Mock data creation: 0.5hr
-   Grading logic: 1hr
-   Cloudflare Workers deployment: 0.5-1hr

**Frontend (Next.js)**: ~6-9 hours

-   Component architecture: 2hr
-   Valtio integration: 1-1.5hr
-   Timer implementation: 1.5-2hr
-   UI/UX polish: 1.5-2hr
-   Error handling: 1hr
-   Vercel deployment: 0.5hr
-   Bug fixes & testing: 0.5-1hr

**README & Documentation**: ~1-2 hours

**Total: ~10-15 hours** across 2 days

## 🚢 Deployment

-   **Frontend**: Vercel (automatic via GitHub integration)
-   **Backend**: Cloudflare Workers via `wrangler deploy`

---

**Built for Enrolla Coding Challenge**  
**Author**: John Kenneth Teodoro  
**Submission Date**: December 7, 2024
