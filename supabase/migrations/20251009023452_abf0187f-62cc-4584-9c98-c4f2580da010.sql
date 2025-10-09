-- Insert Cape Town service areas
INSERT INTO public.service_areas (name, active) VALUES
-- City Bowl
('City Centre', true),
('Gardens', true),
('Tamboerskloof', true),
('Oranjezicht', true),
('Vredehoek', true),
('Higgovale', true),
('Bo-Kaap', true),
('Woodstock', true),
('Salt River', true),
('Observatory', true),
('Mowbray', true),
('Rondebosch', true),
('Newlands', true),
('Claremont', true),
('Wynberg', true),
('Kenilworth', true),
('Plumstead', true),
('Constantia', true),
('Bishopscourt', true),

-- Atlantic Seaboard
('Green Point', true),
('Sea Point', true),
('Bantry Bay', true),
('Clifton', true),
('Camps Bay', true),
('Bakoven', true),
('Llandudno', true),
('Hout Bay', true),

-- Southern Suburbs
('Bergvliet', true),
('Tokai', true),
('Steenberg', true),
('Retreat', true),
('Muizenberg', true),
('St James', true),
('Kalk Bay', true),
('Fish Hoek', true),
('Glencairn', true),
('Simons Town', true),

-- Northern Suburbs
('Goodwood', true),
('Parow', true),
('Bellville', true),
('Durbanville', true),
('Brackenfell', true),
('Kuils River', true),
('Blue Downs', true),
('Kraaifontein', true),

-- West Coast
('Bloubergstrand', true),
('Table View', true),
('Milnerton', true),
('Parklands', true),
('Sunset Beach', true),
('Big Bay', true),

-- Southern Peninsula
('Kommetjie', true),
('Scarborough', true),
('Noordhoek', true),
('Sunnydale', true),
('Ocean View', true),
('Masiphumelele', true),

-- Helderberg
('Somerset West', true),
('Strand', true),
('Gordon''s Bay', true),

-- Cape Flats
('Mitchell''s Plain', true),
('Khayelitsha', true),
('Gugulethu', true),
('Nyanga', true),
('Athlone', true),
('Manenberg', true),
('Hanover Park', true)

ON CONFLICT DO NOTHING;