# Prompt for Lovable - Database Migration

Copy and paste this prompt to Lovable:

---

I need to add pricing columns to the `services` table in my Supabase database. Please create and run a migration that does the following:

**Add these 3 new columns to the `services` table:**

1. `bedroom_price` - decimal(10, 2), NOT NULL, default 50.00
2. `bathroom_price` - decimal(10, 2), NOT NULL, default 40.00  
3. `service_fee_rate` - decimal(5, 4), NOT NULL, default 0.10

**Requirements:**
- Set default values first, then make columns NOT NULL
- Add check constraint: `bedroom_price >= 0`
- Add check constraint: `bathroom_price >= 0`
- Add check constraint: `service_fee_rate >= 0 AND service_fee_rate <= 1`
- Update all existing services with the default values (50.00, 40.00, 0.10)
- Add helpful column comments:
  - bedroom_price: "Price per bedroom in ZAR"
  - bathroom_price: "Price per bathroom in ZAR"
  - service_fee_rate: "Service fee as decimal (0.10 = 10%)"

**Context:**
Currently, bedroom and bathroom prices are hard-coded in the application. This migration moves them to the database so each service can have its own pricing without code changes.

Please create the migration file and apply it to the database.

---

