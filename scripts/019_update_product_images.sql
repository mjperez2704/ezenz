-- Script para actualizar las rutas de imágenes de productos
-- Este script asocia cada producto con su imagen correspondiente en /public/productos/

-- Actualizar CALM CORE
UPDATE products 
SET image = '/productos/CALM CORE.png'
WHERE id = 'calm-core';

-- Actualizar MOODLIFT
UPDATE products 
SET image = '/productos/MOODLIFT.png'
WHERE id = 'moodlift';

-- Actualizar DEEPZ
UPDATE products 
SET image = '/productos/DEEPZ.png'
WHERE id = 'deepz';

-- Actualizar SHIELD UP
UPDATE products 
SET image = '/productos/SHIELD UP.png'
WHERE id = 'shield-up';

-- Actualizar OXYCELL
UPDATE products 
SET image = '/productos/OXYCELL.png'
WHERE id = 'oxycell';

-- Actualizar HORMONIX
UPDATE products 
SET image = '/productos/HORMONIX.png'
WHERE id = 'hormonix';

-- Actualizar FOCUS MIND
UPDATE products 
SET image = '/productos/FOCUS MIND.png'
WHERE id = 'focus-mind';

-- Actualizar CELL RECHARGE
UPDATE products 
SET image = '/productos/CELL_RECHARGE.png'
WHERE id = 'cell-recharge';

-- Actualizar VITAL FUEL
UPDATE products 
SET image = '/productos/VITAL FUEL.png'
WHERE id = 'vital-fuel';

-- Actualizar NEUROSHIELD
UPDATE products 
SET image = '/productos/NEUROSHIELD.png'
WHERE id = 'neuroshield';
