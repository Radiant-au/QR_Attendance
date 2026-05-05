# Technologia — QR Attendance System API

> A production-ready REST API powering a QR-based attendance management platform. Built with Node.js, Express, TypeScript, and PostgreSQL — featuring HMAC-signed dynamic QR tokens, role-based access control, HTTP-only cookie auth, and a layered service architecture with zero sync calls.

---

## ✦ Architecture Overview

```
src/
├── config/
│   ├── data-source.ts     # TypeORM PostgreSQL connection (SSL-aware, pool-configured)
│   └── env.ts             # Startup-time env validation — crashes fast on misconfiguration
├── controllers/           # Thin HTTP handlers — zero business logic
├── services/              # All domain logic lives here (ActivityService, AttendanceService, …)
├── repositories/          # TypeORM repository access points (one per entity)
├── entities/              # TypeORM entity definitions with relationships
├── dto/                   # Validated input shapes (class-validator) + response interfaces
├── middlewares/
│   ├── AuthMiddleware.ts  # JWT extraction (cookie → header fallback) + role enforcement
│   ├── ValidationMiddleware.ts  # Generic class-validator DTO middleware
│   └── handler.ts         # asyncHandler wrapper + centralized error handler
├── routes/                # Express routers — one file per domain
├── migrations/            # TypeORM SQL migrations (no synchronize in production)
├── scripts/               # One-off scripts (admin seeding)
└── utils/
    ├── Signature.ts       # HMAC-SHA256 QR token generation + timing-safe verification
    ├── hash.ts            # bcrypt password hashing
    └── AppError.ts        # Typed operational error class
```

### Design Philosophy

This backend follows a strict **Controller → Service → Repository** separation:
- **Controllers** only read from `req` and write to `res` — no DB calls, no logic
- **Services** own all business rules, validation logic, and orchestration across repositories
- **Repositories** are thin TypeORM wrappers — no raw SQL except in migrations
- **Middlewares** are composable and reusable across any route

---

## ✦ Feature Highlights

### 🔐 Authentication & Authorization
- JWT signed with configurable expiry (`JWT_EXPIRE_MINUTES`) and stored as an **HTTP-only cookie** (XSS-proof)
- Token also returned in the response body for **mobile and API client compatibility**
- Dual token extraction: cookie takes priority, falls back to `Authorization: Bearer` header — no client-side changes needed to switch modes
- Two distinct middleware guards: `authenticateUserToken` (user or admin) and `authenticateAdminToken` (admin only) — role-checking is centralized in a single `authenticate()` function via DRY composition
- Startup-time environment validation via `validateEnv()` — missing secrets crash immediately with a clear error message rather than failing silently at runtime

### 🔏 HMAC-Signed Dynamic QR Tokens
- QR tokens are **not stored in the database** — they are base64-encoded JSON payloads signed with HMAC-SHA256 using the JWT secret
- Each token encodes `userId`, `timestamp`, and `expiresAt` (10-minute window)
- Verification uses `crypto.timingSafeEqual` to prevent **timing attacks** on the signature comparison
- Zero database lookup required to validate a QR scan — only the signature and expiry are checked
- Stateless QR design means the system scales horizontally without session coordination

### 📋 Activity Lifecycle Management
- Activities progress through a strict status machine: `upcoming → closed → ongoing → completed`
- Transitioning `upcoming → closed` **auto-initializes attendance records** for all registered users (batch insert via TypeORM)
- Transitioning `ongoing → completed` auto-stamps `endDateTime`
- Status changes are atomic — no partial state updates

### 📷 QR Scan Attendance Logic
- On scan: verifies token signature, checks expiry, confirms activity is `ongoing`, then upserts the attendance record
- **Registered users** are marked present on their pre-existing attendance record
- **Walk-in users** (no prior registration) get a new `walk-in` attendance record created on the spot
- Guards against duplicate scans (`isPresent` check) and leave requests (blocks scanning for users who submitted leave)
- All scan metadata is captured: `scannedAt`, `scannedById`, `scanMethod`

### 🛡️ Input Validation
- All mutating endpoints run requests through `validateBody<T>()` — a generic middleware using `class-transformer` + `class-validator`
- DTOs use decorators (`@IsString`, `@IsDate`, `@IsNotEmpty`, `@IsOptional`, etc.) — no hand-rolled validation
- Validation errors are aggregated and returned as a single 400 response with all constraint messages
- `@Type(() => Date)` on `startDateTime` / `endDateTime` handles ISO string → Date coercion automatically

### ⚠️ Error Handling
- `asyncHandler` wraps every controller method — no `try/catch` clutter in request handlers
- `AppError` carries `statusCode` and `isOperational` — distinguishing expected domain errors from unexpected crashes
- A single `errorHandler` middleware at the end of the Express chain handles all thrown errors uniformly
- `findOneByOrFail` used in services where a missing entity is always a programmer or client error — throws automatically

### 🌐 HTTP & Security
- `helmet` for security headers (CORS resource policy loosened for cross-origin assets)
- CORS configured from `CORS_ORIGINS` env variable (comma-separated list) — no hardcoded origins
- Optional HTTPS mode via self-signed cert + `mkcert` — toggled with `USE_HTTPS=true`
- `cookieParser` middleware for cookie extraction
- Graceful shutdown on `SIGTERM`: closes HTTP server, then destroys DB connection pool — no abrupt connection drops

### 🗄️ Database
- TypeORM with PostgreSQL, managed migrations only (`synchronize: false` in all environments)
- Connection pool configured: 30 active connections, 100 queued, `waitForConnections: true` — no dropped requests under load
- SSL support toggled via `DB_SSL=true` with `rejectUnauthorized: false` for managed cloud databases (Railway, Render, etc.)
- All relationships use `onDelete: 'CASCADE'` where appropriate — no orphaned records

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 20 + TypeScript |
| **Framework** | Express.js |
| **ORM** | TypeORM |
| **Database** | PostgreSQL |
| **Auth** | JSON Web Tokens (`jsonwebtoken`) |
| **QR Security** | Node.js `crypto` (HMAC-SHA256) |
| **Password Hashing** | `bcryptjs` (10 salt rounds) |
| **Validation** | `class-validator` + `class-transformer` |
| **Security Headers** | `helmet` |
| **Cookie Parsing** | `cookie-parser` |
| **Env Management** | `dotenv` with startup validation |
| **Build** | `ts-node` (dev) / `tsc` (prod) |
| **Path Aliases** | `tsconfig-paths` (`@services/`, `@entities/`, etc.) |

---

## ✦ API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/admin` | — | Admin login → sets cookie + returns token |
| `POST` | `/api/auth/user` | — | User login → sets cookie + returns token |
| `GET` | `/api/auth/me` | User/Admin | Returns current authenticated user |
| `POST` | `/api/auth/logout` | — | Clears auth cookie |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/user` | Admin | Create user (username + password + role) |
| `GET` | `/api/user` | Admin | List all users |
| `GET` | `/api/user/:id` | User/Admin | Get user profile with registrations + attendance history |
| `PUT` | `/api/user/:id` | User/Admin | Update profile (fullName, major, year) — auto-sets `isProfileCompleted` |
| `DELETE` | `/api/user/:id` | Admin | Hard delete user (cascades registrations + attendance) |
| `GET` | `/api/user/getQR/:id` | User/Admin | Generate fresh 10-min HMAC-signed QR token |

### Activities

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/activity` | Admin | Create activity |
| `GET` | `/api/activity` | User/Admin | List all activities |
| `PUT` | `/api/activity/:id` | Admin | Update activity details |
| `DELETE` | `/api/activity/:id` | Admin | Delete activity |
| `PATCH` | `/api/activity/status/change` | Admin | Advance activity status (triggers attendance init) |
| `GET` | `/api/activity/:id/attendance` | Admin | Get registration list + attendance records for an activity |

### Activity Registration

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/activity-registration` | User/Admin | Register user for activity (re-registers if previously cancelled) |
| `PUT` | `/api/activity-registration/cancel` | User/Admin | Cancel registration with reason |

### Attendance

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/attendance/mark` | Admin | Mark attendance via scanned QR token |
| `POST` | `/api/attendance/leave` | User/Admin | Submit leave request for an activity |

---

## ✦ Data Model

```
users ──────────────────────────────────────────────────┐
  id (uuid PK)                                          │
  username (unique)                                     │
  password (bcrypt)                                     │
  role: enum[user, admin]                               │
  fullName, major, year                                 │
  isProfileCompleted: boolean                           │
                                                        │
activity_registrations ───────────────────────────┐    │
  id (uuid PK)                                    │    │
  userId → users.id (CASCADE)                     │    │
  activityId → activities.id (CASCADE)            │    │
  status: enum[registered, cancelled]             │    │
  UNIQUE(userId, activityId)                      │    │
                                                  │    │
attendances ─────────────────────────────────────────── │
  id (uuid PK)                                         │
  userId → users.id (CASCADE)                          │
  activityId → activities.id (CASCADE)                 │
  registrationId → activity_registrations.id           │
  scannedById → users.id                               │
  attendanceType: enum[registered, walk-in, leave]     │
  isPresent: boolean                                   │
  scannedAt, scanMethod, notes                         │
  UNIQUE(userId, activityId)                           │
                                                       │
activities ─────────────────────────────────────────── ┘
  id (uuid PK)
  title, description, location
  startDateTime, endDateTime
  status: enum[upcoming, ongoing, completed, closed]
  createdById → users.id
```

---

## ✦ Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14

### Installation

```bash
git clone https://github.com/your-username/technologia-backend.git
cd technologia-backend
npm install
```

### Environment Variables

Create a `.env` file — the server **will not start** if any required variable is missing:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=technologia
DB_SSL=false

# Auth
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE_MINUTES=60

# Server
PORT=5000
ENV=development
USE_HTTPS=false

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Admin Seed
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpassword
```

### Database Setup

```bash
# Run migrations (never use synchronize in prod)
npm run migration:run

# Seed the first admin user
npm run seed:admin
```

### Development

```bash
npm run dev      # ts-node with hot reload
```

### Production

```bash
npm run build    # tsc → dist/
npm start        # node dist/index.js
```

### HTTPS (Local Development)

```bash
# Install mkcert and generate certs
mkdir certs
mkcert -key-file certs/key.pem -cert-file certs/cert.pem localhost 127.0.0.1

# Enable in .env
USE_HTTPS=true
```

---

## ✦ Key Implementation Decisions

**Why HMAC-signed QR tokens instead of DB-stored codes?**  
Storing one-time tokens in the database requires a write on generation and a read-then-delete on verification — adding two DB round trips per scan. HMAC signatures are verified purely with CPU: unpack the base64 payload, re-sign the data, compare with `timingSafeEqual`. No DB call, no state, infinitely scalable.

**Why `timingSafeEqual` for signature comparison?**  
A naive `===` string comparison short-circuits on the first mismatched character, leaking timing information an attacker can use to brute-force the expected signature byte by byte. `crypto.timingSafeEqual` always takes the same amount of time regardless of where the comparison fails, closing that side channel.

**Why env validation at startup instead of runtime?**  
A missing `JWT_SECRET` discovered during the first login attempt at 2 AM is worse than a crash at boot time. `validateEnv()` collects all missing vars and throws before the server binds to any port — fail fast, fail loudly.

**Why `asyncHandler` instead of try/catch in every controller?**  
Every Express route that `await`s something needs error forwarding to `next()` or the error silently hangs. `asyncHandler` is a one-line HOF that wraps any async handler and pipes rejections to `next` automatically — keeping controllers clean and ensuring no error is ever swallowed.

**Why batch insert in `initializeAttendance`?**  
When an activity transitions to `closed`, creating attendance records one-by-one for each registered user is O(n) DB round trips. `AttendanceRepository.save(attendances[])` lets TypeORM batch the inserts in a single transaction — dramatically faster for large registration lists.

**Why cookie + header dual extraction for JWT?**  
Browser apps benefit from HTTP-only cookies (inaccessible to JavaScript, no XSS risk). Mobile apps and API clients benefit from `Authorization: Bearer` headers (no cookie support needed). The `extractToken` function tries cookie first and falls back to the header — one codebase serves both use cases with zero client-side compromise.

---

## ✦ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with ts-node |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run migration:generate` | Generate a new migration from entity changes |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Roll back the last migration |
| `npm run seed:admin` | Create the initial admin user from env vars |

---

## ✦ Health Check

```
GET /health

{
  "status": "ok",
  "timestamp": "2025-07-21T10:00:00.000Z",
  "uptime": 3600.24,
  "https": "false"
}
```

---

## ✦ Roadmap

- [ ] Rate limiting per user/IP on auth and QR endpoints
- [ ] Refresh token rotation for long-lived sessions
- [ ] Attendance analytics endpoint (attendance rate per activity, per major, per year)
- [ ] Bulk user creation via CSV upload
- [ ] WebSocket support for real-time scan feedback on admin dashboard
- [ ] Redis-backed token denylist for instant logout invalidation

---

## ✦ Author

Built with precision by **[Your Name]**  
[Portfolio](https://your-portfolio.dev) · [LinkedIn](https://linkedin.com/in/yourhandle) · [GitHub](https://github.com/your-username)

---

<p align="center">
  <sub>Technologia QR Attendance System — Backend API</sub>
</p>
