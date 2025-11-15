# Migration Notes - Schema Simplification

## Schema Changes

The schema has been simplified to a core structure:

### Removed Models
- `ProviderProfile` - Deals now directly linked to User
- `Favorite` - Favorites feature removed
- `Rating` - Ratings feature removed
- `Notification` - Notifications feature removed
- `Category` - Categories are now just strings

### Simplified Models

#### User
- Removed: `password`, `updatedAt`, relations to removed models
- Kept: `id`, `email`, `name`, `role`, `createdAt`
- Added: Direct relation to `Deal[]` as provider

#### Deal
- Simplified fields:
  - `price` (instead of `discountPrice`)
  - `original` (instead of `originalPrice`)
  - `image` (instead of `imageUrl`)
  - `inventory` (instead of `maxPurchases`)
  - `sold` (instead of `currentPurchases`)
  - `startAt` (instead of `startDate`)
  - `endAt` (instead of `endDate`)
- Removed: `discountPercent`, `isActive`, `isSponsored`, `views`, `clicks`, `shares`, `commissionRate`, `updatedAt`
- Changed: Direct relation to `User` (provider) instead of `ProviderProfile`

#### Purchase
- Simplified fields:
  - `amount` (instead of `totalPrice`)
  - `stripeId` (instead of `paymentId`)
- Removed: `quantity`, `commissionAmount`, `paymentMethod`, `updatedAt`
- Changed: `status` enum values (`PENDING`, `PAID`, `REFUNDED` instead of `PENDING`, `COMPLETED`, `CANCELLED`, `REFUNDED`)

### Enum Changes
- `UserRole` → `Role` (same values)
- `PurchaseStatus` → `PaymentStatus` (different values: `PAID` instead of `COMPLETED`, removed `CANCELLED`)

## Migration Steps

1. **Backup existing data** (if any):
   ```bash
   cp prisma/dev.db prisma/dev.db.backup
   ```

2. **Reset database** (this will delete all data):
   ```bash
   rm prisma/dev.db
   rm prisma/dev.db-journal
   ```

3. **Create migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

## Code Updates Required

The following files need to be updated to match the new schema:

### API Routes
- `app/api/deals/route.ts` - Update field names
- `app/api/deals/[id]/route.ts` - Update field names
- `app/api/checkout/route.ts` - Update Purchase creation
- `app/api/stripe/create-checkout/route.ts` - Update field names
- `app/api/stripe/webhook/route.ts` - Update status values

### Components
- `components/DealCard.tsx` - Update field names
- `app/customer/deals/[id]/page.tsx` - Update field names
- `app/provider/deals/create/page.tsx` - Update form fields

### Mock Data
- `lib/mockData.ts` - Update to match new schema structure

### Pages
- `app/page.tsx` - Update field references
- `app/provider/dashboard/page.tsx` - Update field names
- `app/provider/analytics/page.tsx` - Update field names

## Field Name Mapping

| Old Field Name | New Field Name |
|---------------|---------------|
| `discountPrice` | `price` |
| `originalPrice` | `original` |
| `imageUrl` | `image` |
| `maxPurchases` | `inventory` |
| `currentPurchases` | `sold` |
| `startDate` | `startAt` |
| `endDate` | `endAt` |
| `totalPrice` | `amount` |
| `paymentId` | `stripeId` |
| `COMPLETED` | `PAID` |

## Calculated Fields

Some fields that were stored are now calculated:
- `discountPercent` = `((original - price) / original) * 100`
- `isActive` = `endAt > now() && sold < inventory`

## Breaking Changes

1. **Provider Profile**: No longer exists. Provider info should be stored in User model or as separate fields on Deal
2. **Favorites**: Feature removed - need to implement differently if needed
3. **Ratings**: Feature removed - need to implement differently if needed
4. **Notifications**: Feature removed - need to implement differently if needed
5. **Quantity in Purchase**: Removed - each purchase is for 1 item (create multiple purchases for quantity > 1)

## Next Steps

After running the migration:

1. Update all API routes to use new field names
2. Update all components to use new field names
3. Update mock data structure
4. Test all functionality
5. Update TypeScript types if needed

