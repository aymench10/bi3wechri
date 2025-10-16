-- ============================================
-- ACTIVATE ALL PENDING ADS
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check pending ads
SELECT id, title, status, created_at 
FROM ads 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- 2. Activate all pending ads
UPDATE ads 
SET status = 'active' 
WHERE status = 'pending';

-- 3. Verify - should show all active ads
SELECT id, title, status, created_at 
FROM ads 
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;

-- 4. Count by status
SELECT status, COUNT(*) as count
FROM ads
GROUP BY status;
