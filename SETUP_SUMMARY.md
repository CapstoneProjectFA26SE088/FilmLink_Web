# Architecture Setup & Usage Summary

This document summarizes the core foundational setups added to the project, adhering strictly to **Next.js 16 App Router**, **Vercel Best Practices**, and **shadcn** standards.

---

## 1. Directory & File Placement Structure

Following the `nextjs-architecture-rules` skill:

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout (Font, Global ToastProvider)
│   ├── page.tsx          # Home page
│   ├── login/            # Login route
│   │   └── page.tsx      # Server Component
│   └── api/              # Route Handlers
│       └── health/
│           └── route.ts  # Health check GET endpoint
├── components/           # React Components
│   ├── login/            # Domain-specific feature components
│   │   ├── login-form.tsx          # Client Component ("use client")
│   │   └── social-auth-buttons.tsx # SVG Icon buttons
│   ├── providers/        # Global context & UI providers
│   │   └── toast-provider.tsx      # React-Toastify container provider
│   └── ui/               # Reusable Atomic Shadcn primitives
├── lib/                  # Shared Business Logic & Infrastructure
│   ├── api-client.ts     # Typed HTTP fetch client
│   ├── api-response.ts   # Route Handler JSON response builders
│   ├── env.ts            # Type-safe environment variables
│   ├── notify.ts         # React-Toastify trigger helper
│   └── utils.ts          # Tailwind cn utility
├── types/                # Global TypeScript contracts
│   └── api.ts            # API Response & Session types
└── proxy.ts              # Next.js 16 Request Interceptor (Auth & Security)
```

---

## 2. Notification System (`react-toastify` + `src/lib/notify.ts`)

### Concept
A clean wrapper around `react-toastify` configured globally in `src/app/layout.tsx` via `ToastProvider`.

### Usage Example
```tsx
"use client"
import { notify } from "@/lib/notify"

// Usage anywhere in client components:
notify.success("Profile updated successfully!")
notify.error("Network connection lost.")
notify.warning("Please check your form inputs.")
notify.info("New update available.")
```

---

## 3. Typed API Client (`src/lib/api-client.ts`)

### Concept
A typed fetch wrapper preventing common network bugs:
- Automatic JSON serialization & deserialization.
- Query parameters appending (`params`).
- Timeout control with `AbortController` (defaults to 15s).
- Normalized return shape: `Promise<ApiResponse<T>>` with `{ data, error, status, success }`.

### Usage Example
```ts
import { api } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
}

// GET with query params
const res = await api.get<User[]>("/users", {
  params: { role: "admin", page: 1 }
})

if (res.success && res.data) {
  console.log(res.data)
} else {
  console.error(res.error)
}

// POST with JSON body
const createRes = await api.post<User>("/users", {
  name: "John Doe",
  email: "john@example.com"
})
```

---

## 4. Next.js 16 Proxy / Middleware (`src/proxy.ts`)

### Concept
In Next.js 16, `middleware.ts` has been deprecated and replaced by `proxy.ts`:
- Intercepts requests on Edge/Node before rendering.
- Authentication route guards (redirects unauthenticated requests away from protected routes like `/dashboard` to `/login`).
- Automatic security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

---

## 5. Route Handler Helpers (`src/lib/api-response.ts`)

### Usage in Route Handlers (`src/app/api/.../route.ts`)
```ts
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const data = { id: 1, name: "Sample" }
    return successResponse(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error"
    return errorResponse(message, 500)
  }
}
```
