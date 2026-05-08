-- =====================================================================
-- Eat In — 0004 : Seed data
--
-- Categories are the only data we ship with the schema. Everything
-- else (hotels, listings) is created through the product flows.
-- =====================================================================

insert into public.categories (slug, name_tr, icon, sort_order) values
  ('breakfast', 'Kahvaltı',         'coffee',            10),
  ('lunch',     'Öğle Yemeği',      'utensils',          20),
  ('dinner',    'Akşam Yemeği',     'utensils-crossed',  30),
  ('bakery',    'Fırın & Pastane',  'croissant',         40),
  ('dessert',   'Tatlılar',         'cake',              50),
  ('salad',     'Salatalar',        'salad',             60),
  ('vegan',     'Vegan',            'leaf',              70),
  ('mixed',     'Karışık Paket',    'package',           80)
on conflict (slug) do nothing;