# Why Deals - MVP Platform

A three-sided marketplace platform connecting customers, providers, and administrators for deals and promotions.

## Project Structure

```
Why Deals/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── checkout/             # Purchase processing
│   │   ├── deals/                # Deal CRUD operations
│   │   └── providers/            # Provider management
│   ├── admin/                    # Admin pages
│   │   └── dashboard/
│   ├── customer/                 # Customer pages
│   │   ├── account/
│   │   └── deals/[id]/
│   ├── provider/                 # Provider pages
│   │   ├── analytics/
│   │   ├── dashboard/
│   │   └── deals/create/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage (deals feed)
├── components/                   # Reusable components
│   ├── CountdownTimer.tsx
│   ├── DealCard.tsx
│   ├── Footer.tsx
│   └── Navbar.tsx
├── lib/                          # Utilities
│   ├── mockData.ts               # Mock deal data
│   └── prisma.ts                 # Prisma client
├── prisma/
│   └── schema.prisma             # Database schema
└── package.json
```

## Features

### Customer Side
- **Homepage**: Browse deals feed with filtering
- **Deal Details**: View detailed deal information with countdown timer
- **Account Page**: Manage profile and view purchase history

### Provider Side
- **Dashboard**: Overview of deals, stats, and management
- **Create Deal**: Form to create new deals
- **Analytics**: Performance metrics and insights

### Admin Side
- **Dashboard**: Platform-wide statistics and management

## Components

- **Navbar**: Navigation bar with links to different sections
- **Footer**: Site footer with links and contact info
- **DealCard**: Card component displaying deal information
- **CountdownTimer**: Real-time countdown to deal expiration

## API Routes

- `GET/POST /api/deals` - List and create deals
- `GET/PATCH/DELETE /api/deals/[id]` - Deal operations
- `GET/POST /api/providers` - Provider management
- `POST /api/checkout` - Process purchases
- `POST /api/auth` - Authentication (login/register)

## Database Schema

- **User**: User accounts with roles (CUSTOMER, PROVIDER, ADMIN)
- **ProviderProfile**: Business information for providers
- **Deal**: Deal information with pricing and availability
- **Purchase**: Purchase records linking users to deals

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file (see `.env.example`):
   ```env
   DATABASE_URL="file:./dev.db"
   # ... other variables (see .env.example)
   ```

3. **Set up Database**
   ```bash
   # Create migration
   npx prisma migrate dev --name init
   
   # Generate Prisma Client
   npx prisma generate
   ```
   
   Or use the migration script:
   ```bash
   ./scripts/migrate.sh
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The schema has been simplified to core models:

- **User**: Customers, Providers, and Admins
- **Deal**: Deals created by providers
- **Purchase**: Purchase records

See `MIGRATION_NOTES.md` for details on schema changes and field name mappings.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **Tailwind CSS** - Utility-first CSS framework
- **PostgreSQL** - Database (configure in DATABASE_URL)

## Notes

- Currently using mock data for deals. Replace API route implementations with actual Prisma queries when database is set up.
- Authentication is mocked. Implement proper JWT/bcrypt authentication for production.
- Countdown timer updates in real-time and shows expiration status.

## Next Steps

1. Set up database connection
2. Implement proper authentication
3. Connect API routes to database
4. Add form validation
5. Implement payment processing
6. Add image upload functionality
7. Add search and filtering
8. Implement email notifications

