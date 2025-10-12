-- Check what statuses the applications actually have
SELECT 
    status,
    COUNT(*) as count
FROM cleaner_applications
GROUP BY status
ORDER BY count DESC;
