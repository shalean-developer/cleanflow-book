-- Check what's actually in the applications
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at,
    jsonb_typeof(skills) as skills_type,
    jsonb_typeof(areas) as areas_type,
    jsonb_typeof(available_days) as available_days_type,
    jsonb_typeof(languages) as languages_type,
    skills,
    areas,
    available_days,
    languages
FROM cleaner_applications
ORDER BY created_at DESC;

