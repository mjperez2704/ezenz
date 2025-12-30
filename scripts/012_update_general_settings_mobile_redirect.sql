-- Add mobileRedirectEnabled field to general settings
UPDATE site_settings
SET value = jsonb_set(
  value,
  '{mobileRedirectEnabled}',
  'false'::jsonb,
  true
)
WHERE key = 'general'
AND NOT (value ? 'mobileRedirectEnabled');
