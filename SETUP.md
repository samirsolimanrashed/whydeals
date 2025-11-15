# Why Deals - Setup Guide

This guide will help you set up the Why Deals platform with all required services.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_CLIENT_EMAIL=your_firebase_client_email_here
FIREBASE_PRIVATE_KEY=your_firebase_private_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

## Step 3: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication (Email/Password)
4. Go to Project Settings → Service Accounts
5. Generate a new private key (JSON file)
6. Extract the following from the JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (replace `\n` with actual newlines or use base64)
7. Go to Project Settings → General
8. Copy the Web API Key → `NEXT_PUBLIC_FIREBASE_API_KEY`

**Note:** For `FIREBASE_PRIVATE_KEY`, if you're having issues with newlines, you can base64 encode the key:
```bash
cat serviceAccountKey.json | base64
```
Then decode it in your code.

## Step 4: Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Go to Developers → API Keys
4. Copy the **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Copy the **Secret key** → `STRIPE_SECRET_KEY`
6. For webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `http://localhost:3000/api/stripe/webhook` (or your production URL)
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## Step 5: Database Setup

1. Generate Prisma Client:
```bash
npm run db:generate
```

2. Push schema to database:
```bash
npm run db:push
```

This will create the SQLite database file (`dev.db`) in your project root.

## Step 6: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 7: Testing the Setup

### Test Database
- Open Prisma Studio: `npm run db:studio`
- Verify tables are created

### Test Authentication
- Navigate to `/auth/signin`
- Try creating an account (requires auth implementation)

### Test Stripe
- Go to a deal page
- Click "Buy Now"
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date, any CVC

## Production Deployment

### Environment Variables
Make sure to set all environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other platforms: Follow their documentation

### Database
For production, consider migrating from SQLite to PostgreSQL:
1. Update `prisma/schema.prisma` datasource to `postgresql`
2. Update `DATABASE_URL` to your PostgreSQL connection string
3. Run migrations: `npx prisma migrate deploy`

### Stripe Webhooks
Update your webhook endpoint URL in Stripe Dashboard to your production URL:
- Production: `https://yourdomain.com/api/stripe/webhook`

### Firebase
Ensure Firebase Admin SDK credentials are properly set in production environment.

## Troubleshooting

### Firebase Private Key Issues
If you're getting errors with the private key:
- Make sure newlines are properly escaped
- Try base64 encoding/decoding
- Verify the key is not truncated

### Stripe Webhook Issues
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Verify webhook secret matches
- Check webhook event logs in Stripe Dashboard

### Database Issues
- Delete `dev.db` and run `npm run db:push` again
- Check Prisma logs for schema errors
- Verify `DATABASE_URL` is correct

## Next Steps

1. Implement password hashing (bcrypt) for user authentication
2. Set up email service for notifications
3. Configure image upload to Firebase Storage
4. Set up production database (PostgreSQL recommended)
5. Configure custom domain and SSL
6. Set up monitoring and error tracking

