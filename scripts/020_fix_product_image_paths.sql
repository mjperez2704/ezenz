-- Actualizar las rutas de imagen de productos para que coincidan con los nombres de archivo reales en /public/productos/
-- Los archivos tienen espacios en sus nombres, no guiones bajos

UPDATE products SET image = '/productos/CALMCORE.png' WHERE name = 'CALM CORE';
UPDATE products SET image = '/productos/MOODLIFT.png' WHERE name = 'MOODLIFT';
UPDATE products SET image = '/productos/DEEPZ.png' WHERE name = 'DEEPZ';
UPDATE products SET image = '/productos/SHIELDUP.png' WHERE name = 'SHIELD UP';
UPDATE products SET image = '/productos/OXYCELL.png' WHERE name = 'OXYCELL';
UPDATE products SET image = '/productos/HORMONIX.png' WHERE name = 'HORMONIX';
UPDATE products SET image = '/productos/FOCUS MIND.png' WHERE name = 'FOCUS MIND';
UPDATE products SET image = '/productos/CELLRECHARGE.png' WHERE name = 'CELL RECHARGE';
UPDATE products SET image = '/productos/VITALFUEL.png' WHERE name = 'VITAL FUEL';
UPDATE products SET image = '/productos/NEUROSHIELD.png' WHERE name = 'NEUROSHIELD';
