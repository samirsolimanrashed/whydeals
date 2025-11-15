#!/bin/bash

# Migration script for Why Deals
# This script will reset the database and create a new migration

echo "🔄 Starting database migration..."

# Check if database exists and backup
if [ -f "prisma/dev.db" ]; then
    echo "📦 Backing up existing database..."
    cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
fi

# Remove existing database
echo "🗑️  Removing existing database..."
rm -f prisma/dev.db
rm -f prisma/dev.db-journal

# Create migration
echo "📝 Creating migration..."
npx prisma migrate dev --name init

# Generate Prisma Client
echo "⚙️  Generating Prisma Client..."
npx prisma generate

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Update your code to use the new schema field names"
echo "2. See MIGRATION_NOTES.md for field name mappings"
echo "3. Test your application"

