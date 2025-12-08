#!/bin/bash

# This script reads your .env.local and shows you how to add each var to Vercel

echo "📋 Your environment variables ready for Vercel:"
echo "================================================"
echo ""
echo "Copy these commands and run them one by one:"
echo ""

while IFS='=' read -r key value; do
  # Skip comments and empty lines
  if [[ ! $key =~ ^# ]] && [[ -n $key ]]; then
    # Remove quotes if present
    value="${value%\"}"
    value="${value#\"}"
    echo "vercel env add $key production"
    echo "  → Paste: $value"
    echo ""
  fi
done < .env.local

echo "================================================"
echo "✅ Run these commands in your terminal to add all vars to Vercel"
