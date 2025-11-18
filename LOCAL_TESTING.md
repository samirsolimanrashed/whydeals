# Local Testing Guide

## ✅ What's Ready

- **Database**: SQLite set up with `.env` → `dev.db`
- **Schema**: Prisma schema synced (User, Deal, Purchase models)
- **Auth**: Password hashing (bcryptjs) + NextAuth configured
- **APIs**: 
  - `/api/auth/signup` - Create users with hashed passwords
  - `/api/auth/[...nextauth]` - Login with credentials
  - `/api/deals/[id]` - Fetch deal data from DB
  - `/api/stripe/create-checkout` - Ready (Stripe keys needed later)
  - `/api/stripe/webhook` - Ready (Stripe webhook secret needed later)
- **UI**: Checkout page now fetches real deal data from API
- **Types**: All TypeScript checks pass ✓

## 🚀 Quick Start (No Stripe/Firebase Yet)

Run locally with mock Stripe/Firebase to test auth and basic flows:

```bash
# 1. Install dependencies (already done, but good to verify)
npm install

# 2. The `.env` file already has mock values for testing without Stripe/Firebase
#    It uses: DATABASE_URL="file:./dev.db" (created ✓)

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 📋 What You Can Test Now (No Secrets Needed)

### 1. **Signup** (Password Hashing)
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

Expected: `{"id":"...", "email":"test@example.com"}`

### 2. **Login** (Credentials + JWT)
- Navigate to `/auth/signin` (or create a signin page)
- Sign in with credentials from signup
- Check that NextAuth session is created (JWT in cookies)

### 3. **Fetch Deal** (API)
```bash
curl http://localhost:3000/api/deals/1
```

Expected: Deal data from Prisma (will fail if no deals in DB yet)

### 4. **Prisma Studio** (DB Viewer)
```bash
npm run db:studio
```
Opens `http://localhost:5555` to browse and manage DB records.

## 📝 Next Steps (When Ready with Secrets)

Once you get **Stripe** and **Firebase** credentials:

1. Update `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=...
   ```

2. Test Stripe webhook locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Run full checkout flow in browser with test card `4242 4242 4242 4242`

## 🗂️ Key Files

- **Database**: `prisma/schema.prisma` (User, Deal, Purchase)
- **Signup**: `app/api/auth/signup/route.ts` (bcrypt hashing)
- **NextAuth**: `app/api/auth/[...nextauth]/route.ts` (credentials strategy)
- **Deals API**: `app/api/deals/[id]/route.ts`
- **Checkout UI**: `app/customer/checkout/page.tsx` (fetches real data)
- **Environment**: `.env` (already set for local dev)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `DATABASE_URL not found` | `.env` file missing or not loaded. Check it exists in project root. |
| `TypeScript errors` | Run `npm run db:generate` to regenerate Prisma types. |
| `Port 3000 in use` | Kill the process: `lsof -ti:3000 | xargs kill -9` |
| `Stripe errors (expected)` | Stripe keys are mocks in `.env`. Won't work until you add real keys. |

## 📦 Ready to Deploy?

When you're ready for production with all secrets:
1. Add real Stripe/Firebase credentials to your hosting platform (Vercel, Netlify, etc.)
2. Update `prisma/schema.prisma` datasource to PostgreSQL (for production)
3. Deploy with `git push` to your main branch

---

**Status**: ✅ All local infrastructure ready. Sign up, login, and browse deals work without Stripe/Firebase.

When you have the credentials, reply and I can help with the remaining setup!
