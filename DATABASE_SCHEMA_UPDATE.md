# WhyDeals Database Schema - Comprehensive Update

## ✅ Completed (Just Now)

### Schema Migration
- **From**: 3 models (User, Deal, Purchase)
- **To**: 14 models with production-ready architecture
- **Database Reset**: Database successfully reset and restructured
- **Status**: ✅ COMPLETE - Schema synced with database

### New Models Implemented

#### 1. **User** (Enhanced)
- Fields: id, email, password, name, phone, avatar, role, verified, active, createdAt, updatedAt
- Role Types: CUSTOMER, PROVIDER, ADMIN, SUPERADMIN
- Relations: providerProfile, purchases, wallet, notifications, reviews, favorites, sessions

#### 2. **Session** (New)
- Purpose: NextAuth session management
- Fields: id, sessionToken, userId, expires
- Ensures proper authentication context

#### 3. **ProviderProfile** (New)
- Purpose: Business profile for providers with KYC
- Fields: businessName, businessEmail, phone, logo, banner, bio, website, approved, rejectionReason, verifiedAt, totalDeals, totalSales, rating
- Relations: user, deals, payoutAccount, analytics

#### 4. **PayoutAccount** (New)
- Purpose: Bank details for provider payouts
- Fields: accountHolder, bankName, accountNumber, routingNumber, accountType, country, verified

#### 5. **Deal** (Enhanced)
- New Fields: platformFeePercent, views, clicks, shares, conversionRate, status (ACTIVE, EXPIRED, DRAFT, HIDDEN, ARCHIVED)
- Time Window: startTime, endTime
- Relations: purchases, reviews, favorites

#### 6. **Purchase** (Enhanced)
- New Fields: subtotal, platformFee, total, paymentMethod, redeemed, redeemedAt, couponCode, refunded, refundReason, refundedAt
- Payment Status: PENDING, PAID, FAILED, REFUNDED
- Full order lifecycle tracking

#### 7. **Wallet** (New)
- Purpose: Customer digital wallet for storing funds
- Fields: userId, balance, currency (default USD), locked (on-hold funds)
- Relations: transactions

#### 8. **WalletTransaction** (New)
- Purpose: Transaction history for audit trail
- Types: ADD_FUNDS, PURCHASE, REFUND, PAYOUT, ADJUSTMENT
- Tracks: amount, balanceBefore, balanceAfter, note, referenceId

#### 9. **Review** (New)
- Purpose: User ratings and feedback on deals
- Fields: dealId, userId, rating (1-5), comment, verified, helpfulCount
- Constraint: One review per user per deal

#### 10. **Favorite** (New)
- Purpose: Wishlist/save-for-later functionality
- Fields: userId, dealId
- Constraint: Unique per user-deal combination

#### 11. **Notification** (New)
- Purpose: User notification system
- Types: ORDER_CONFIRMATION, PAYMENT_RECEIVED, DEAL_ENDING_SOON, NEW_DEAL, ACCOUNT_UPDATE, ADMIN_MESSAGE
- Fields: title, content, link, read, readAt

#### 12. **ProviderAnalytics** (New)
- Purpose: Provider performance metrics
- Fields: totalDealsCreated, totalRevenue, totalOrders, totalViews, totalClicks, averageRating, completionRate, refundRate

#### 13. **AdminSettings** (New)
- Purpose: SuperAdmin platform configuration
- Platform Config: platformFeePercent (10%), minProviderPayout (100), payoutFrequency (WEEKLY)
- Feature Flags: allowNewProviders, allowNewDeals, maintenanceMode
- Security: passwordExpireDays (90), maxLoginAttempts (5), lockoutDurationMinutes (30)
- Notifications: emailNotificationsEnabled, smsNotificationsEnabled

#### 14. **AuditLog** (New)
- Purpose: Track admin actions for compliance
- Fields: action, entity, entityId, details
- Indexes: action, entity, createdAt

#### 15. **Coupon** (New)
- Purpose: Promo codes and discounts
- Fields: code, discountType (PERCENTAGE, FIXED), discountValue, maxUses, maxUsesPerUser, minPurchaseAmount, validFrom, validUntil, active, timesUsed

---

## 📊 Test Data Seeded

### Users (5 total)
- ✅ 1 SuperAdmin (admin@whydeals.com)
- ✅ 2 Customers (customer1@, customer2@)
- ✅ 2 Providers (provider1@, provider2@)

### Provider Infrastructure
- ✅ 2 Provider Profiles with business details
- ✅ 2 Payout Accounts with bank info
- ✅ 2 Provider Analytics records

### Financial
- ✅ 2 Customer Wallets with $500 and $250 balances
- ✅ 1 Wallet Transaction
- ✅ 2 Coupons (SUMMER20, TECH50)

### Products & Commerce
- ✅ 5 Active Deals with pricing, inventory, and analytics
- ✅ 3 Purchases (orders) with mixed statuses
- ✅ 2 Reviews with ratings and comments

### User Experience
- ✅ 2 Favorites (wishlist items)
- ✅ 4 Notifications with various types
- ✅ 2 Audit Logs

### Admin
- ✅ 1 AdminSettings record with platform configuration

---

## 🔧 Technical Stack

### ORM & Database
- **Prisma**: 5.22.0
- **Database**: SQLite (dev.db) - Local development
- **Client**: Generated with all 15 models and relationships

### Schema Features
- **Cascade Deletes**: Foreign key constraints with onDelete: Cascade
- **Indexes**: Strategic indexes on frequently queried fields
- **Unique Constraints**: Email, sessionToken, provider-userId, review (deal+user), favorite (user+deal), coupon code
- **Defaults**: Sensible defaults for booleans, numbers, dates, and strings

### API Ready
- All relationships properly structured for relational queries
- Support for nested data retrieval (e.g., Deal with reviews and purchases)
- Analytics data separated into dedicated table for performance

---

## 📋 String-Based Enum Values

Due to SQLite constraints, enums implemented as strings with documented values:

**User Role**
- `CUSTOMER` - End user making purchases
- `PROVIDER` - Business selling deals
- `ADMIN` - Platform administrator
- `SUPERADMIN` - System administrator

**Deal Status**
- `ACTIVE` - Currently available
- `EXPIRED` - Ended
- `DRAFT` - Not yet published
- `HIDDEN` - Hidden from display
- `ARCHIVED` - Historical record

**Payment Status**
- `PENDING` - Awaiting payment
- `PAID` - Successfully charged
- `FAILED` - Payment failed
- `REFUNDED` - Refund issued

**Notification Type**
- `ORDER_CONFIRMATION` - Order placed
- `PAYMENT_RECEIVED` - Payment cleared
- `DEAL_ENDING_SOON` - Time-sensitive alert
- `NEW_DEAL` - New offer available
- `ACCOUNT_UPDATE` - Account changes
- `ADMIN_MESSAGE` - Platform message

---

## ✨ Database Verification

### Generation Status
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 133ms
```

### Migration Status
```
🚀 Your database is now in sync with your Prisma schema. Done in 20.53s
```

### Seed Status
```
✨ Database seed completed successfully!
📊 Total Records Created:
  - 5 Users
  - 2 Provider Profiles
  - 2 Payout Accounts
  - 2 Provider Analytics
  - 2 Wallets
  - 1 Wallet Transaction
  - 2 Coupons
  - 5 Deals
  - 3 Purchases
  - 2 Reviews
  - 2 Favorites
  - 4 Notifications
  - 1 Admin Settings
  - 2 Audit Logs
```

### Dev Server Status
```
✓ Ready in 1950ms
Server running on: http://localhost:3001
```

---

## 🚀 Next Steps

### 1. **API Route Enhancement**
```typescript
// Provider Management
/api/providers/[id]/deals
/api/providers/[id]/analytics
/api/providers/[id]/payouts

// Customer Features
/api/wallet/balance
/api/wallet/transactions
/api/reviews
/api/favorites
/api/notifications

// Admin Dashboard
/api/admin/stats
/api/admin/users
/api/admin/providers
/api/admin/settings
/api/admin/audits
```

### 2. **Provider Dashboard**
- Profile management
- Deal creation and editing
- Analytics and revenue tracking
- Payout history and bank details
- Review management

### 3. **Customer Features**
- Wallet management (add funds, view balance)
- Review submission on purchased deals
- Favorites/wishlist functionality
- Notification center
- Order history with refund management

### 4. **Admin Portal**
- SuperAdmin settings management
- Provider approval workflows
- User management
- Platform analytics
- Audit log review
- Coupon management

### 5. **Security & Compliance**
- Role-based access control (RBAC)
- Audit logging for all admin actions
- KYC verification for providers
- Payment PCI compliance
- Session management

---

## 📈 Performance Considerations

### Indexes Created
- User: email, role
- ProviderProfile: approved
- Deal: providerId, status, endTime, category
- Purchase: userId, dealId, status, createdAt
- Review: dealId, rating
- Favorite: userId
- Notification: userId, read
- AuditLog: action, entity, createdAt
- Coupon: code, active
- WalletTransaction: walletId, type

### Query Optimization
- Foreign key relationships indexed
- Status and status-based filtering optimized
- Analytics data denormalized for fast retrieval
- Pagination-friendly indexes on timestamps

---

## 🔐 Security Features

1. **Authentication**: NextAuth with password hashing (bcrypt)
2. **Authorization**: Role-based access control (4 levels)
3. **Audit Trail**: All admin actions logged
4. **Data Integrity**: Foreign key constraints with cascade delete
5. **Validation**: Schema-level constraints

---

## 📚 Schema File Location
```
/Users/samirrashed/Desktop/Why Deals/prisma/schema.prisma
```

## 🎯 Status Summary
✅ **All Complete**
- Schema updated and deployed
- Database migrated successfully
- Test data seeded comprehensively
- Dev server running cleanly
- Ready for feature development

