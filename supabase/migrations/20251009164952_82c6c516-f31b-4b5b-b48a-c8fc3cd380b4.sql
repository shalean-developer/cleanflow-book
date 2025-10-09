-- Update cleaners service areas to Cape Town neighborhoods
UPDATE cleaners SET service_areas = ARRAY['Sea Point', 'Green Point', 'Waterfront'] WHERE name = 'Sarah Johnson';
UPDATE cleaners SET service_areas = ARRAY['Camps Bay', 'Clifton', 'Bantry Bay'] WHERE name = 'Michael Williams';
UPDATE cleaners SET service_areas = ARRAY['Observatory', 'Woodstock', 'Salt River'] WHERE name = 'Emily Davis';
UPDATE cleaners SET service_areas = ARRAY['Rondebosch', 'Claremont', 'Newlands'] WHERE name = 'Jessica Brown';
UPDATE cleaners SET service_areas = ARRAY['Constantia', 'Hout Bay', 'Camps Bay'] WHERE name = 'Christopher Lee';
UPDATE cleaners SET service_areas = ARRAY['Muizenberg', 'Fish Hoek', 'Simons Town'] WHERE name = 'David Martinez';