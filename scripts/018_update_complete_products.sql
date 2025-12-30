-- Actualizar productos existentes y agregar los 4 faltantes para completar 10 productos

-- Eliminar productos existentes para reemplazarlos con datos actualizados
DELETE FROM public.products WHERE id IN (
  'calm-core', 'shield-up', 'vital-fuel', 'focus-mind', 'oxycell', 'hormonix'
);

-- Insertar los 10 productos completos con las imágenes del carrusel
INSERT INTO public.products (id, name, slug, description, long_description, price, image, category, benefits, ingredients, stock, rating, reviews_count) VALUES

-- 1. CALM CORE (Relajación)
(
  'calm-core',
  'Calm Core',
  'calm-core',
  'Equilibrio emocional y reducción del estrés',
  'Suplemento natural en cápsulas formulado con extractos de plantas adaptógenas, minerales y aminoácidos que ayudan a reducir el estrés crónico, mejorar la respuesta al cortisol, promover calma mental y favorecer un sueño reparador.',
  899.00,
  '/images/carrusel-calm-core.png',
  'stress-anxiety',
  ARRAY['Disminución del estrés y la ansiedad', 'Mejora en la calidad del sueño', 'Regulación del cortisol', 'Soporte del estado de ánimo'],
  ARRAY['Rhodiola Rosea', 'Magnesio'],
  100,
  4.8,
  124
),

-- 2. MOODLIFT (Relajación)
(
  'moodlift',
  'MoodLift',
  'moodlift',
  'Mejora del estado de ánimo y bienestar emocional',
  'Suplemento natural formulado para mejorar el estado de ánimo, reducir la irritabilidad y la ansiedad. Combina aminoácidos, adaptógenos y minerales que apoyan el equilibrio emocional y la respuesta al estrés.',
  899.00,
  '/images/carrusel-moodlift.png',
  'stress-anxiety',
  ARRAY['Mejora del estado de ánimo y bienestar emocional', 'Reducción de la irritabilidad y la ansiedad', 'Apoyo en estados de agotamiento emocional', 'Aporte de magnesio y vitamina B6 para el sistema nervioso'],
  ARRAY['Rhodiola Rosea', 'Vitamina B6', 'Triptófano'],
  110,
  4.7,
  98
),

-- 3. DEEPZ (Relajación)
(
  'deepz',
  'DeepZ',
  'deepz',
  'Sueño profundo y reparador',
  'Suplemento formulado para promover un sueño profundo y reparador, reducir el insomnio y facilitar la relajación nocturna. Contiene triptófano, adaptógenos y minerales que apoyan el equilibrio del sistema nervioso antes de dormir.',
  949.00,
  '/images/carrusel-deepz.png',
  'stress-anxiety',
  ARRAY['Promueve un sueño profundo y reparador', 'Reducción del insomnio y ansiedad nocturna', 'Apoyo a la relajación del sistema nervioso', 'Fórmula sin efectos sedantes artificiales'],
  ARRAY['Ashwagandha', 'Magnesio', 'Triptófano'],
  95,
  4.9,
  156
),

-- 4. SHIELD UP (Defensa/Inmunidad)
(
  'shield-up',
  'Shield Up',
  'shield-up',
  'Fortalecimiento del sistema inmunológico',
  'Suplemento natural diseñado para fortalecer el sistema inmunológico y apoyar la respuesta del cuerpo frente a virus, bacterias y hongos. Formulado con extractos de hongos medicinales, vitamina C y zinc en su forma bisglicinato para mejorar la biodisponibilidad.',
  949.00,
  '/images/carrusel-shield-up.png',
  'immunity',
  ARRAY['Refuerzo del sistema inmunológico', 'Apoyo a la respuesta natural del cuerpo ante infecciones', 'Aporte antioxidante con vitamina C', 'Mejora de la biodisponibilidad de zinc'],
  ARRAY['Cola de Pavo', 'Reishi', 'Chaga'],
  85,
  4.7,
  89
),

-- 5. OXYCELL (Longevidad)
(
  'oxycell',
  'OxyCell',
  'oxycell',
  'Protección celular y longevidad',
  'Suplemento natural diseñado para proteger contra el daño oxidativo y apoyar la longevidad celular. Contiene hongos medicinales, antioxidantes y minerales esenciales para el equilibrio celular y el bienestar general.',
  999.00,
  '/images/carrusel-oxycell.png',
  'longevity',
  ARRAY['Protección contra el daño oxidativo', 'Apoyo a la longevidad y vitalidad celular', 'Aporte de antioxidantes naturales', 'Equilibrio mineral con magnesio y zinc'],
  ARRAY['Vitamina C', 'Reishi', 'Chaga'],
  75,
  4.8,
  67
),

-- 6. HORMONIX (Balance Hormonal)
(
  'hormonix',
  'Hormonix',
  'hormonix',
  'Balance hormonal natural',
  'Suplemento natural para promover el balance hormonal, aumentar la vitalidad física y emocional, y mejorar el estado físico y emocional. Formulado con plantas adaptógenas y minerales esenciales que apoyan la función endocrina.',
  949.00,
  '/images/carrusel-hormonix.png',
  'hormonal',
  ARRAY['Balance hormonal general', 'Aumento de la vitalidad física y emocional', 'Apoyo adaptógeno al sistema endocrino', 'Aporte de zinc y magnesio para funciones hormonales'],
  ARRAY['Ginseng', 'Ashwagandha', 'Maca'],
  110,
  4.7,
  98
),

-- 7. FOCUS MIND (Enfoque)
(
  'focus-mind',
  'Focus Mind',
  'focus-mind',
  'Claridad mental y concentración',
  'Suplemento diseñado para reducir la fatiga crónica y mejorar la energía celular. Formulado con adaptógenos, antioxidantes y vitaminas esenciales que apoyan la vitalidad y el metabolismo energético.',
  949.00,
  '/images/carrusel-focus-mind.png',
  'cognitive',
  ARRAY['Reducción de la fatiga crónica', 'Mejora de la energía celular', 'Aporte de antioxidantes y adaptógenos', 'Estimulación sin cafeína ni estimulantes artificiales'],
  ARRAY['Ginseng', 'Rhodiola Rosea', 'Melena de León'],
  95,
  4.9,
  203
),

-- 8. CELL RECHARGE (Energía)
(
  'cell-recharge',
  'Cell Recharge',
  'cell-recharge',
  'Energía celular y rendimiento',
  'Suplemento diseñado para reducir la fatiga crónica y mejorar la energía celular. Formulado con adaptógenos, antioxidantes y vitaminas esenciales que apoyan la vitalidad y el metabolismo energético.',
  899.00,
  '/images/carrusel-cell-recharge.png',
  'energy-performance',
  ARRAY['Reducción de la fatiga crónica', 'Mejora de la energía celular', 'Aporte de antioxidantes y adaptógenos', 'Apoyo al rendimiento físico y mental'],
  ARRAY['Rhodiola Rosea', 'Ashwagandha', 'Cordyceps'],
  120,
  4.6,
  156
),

-- 9. VITAL FUEL (Energía)
(
  'vital-fuel',
  'Vital Fuel',
  'vital-fuel',
  'Energía sostenida y rendimiento físico',
  'Suplemento natural formulado para aumentar la energía física y mental de forma sostenida, sin estimulantes artificiales. Contiene extractos de plantas adaptógenas y micronutrientes esenciales para el rendimiento diario.',
  899.00,
  '/images/carrusel-vital-fuel.png',
  'energy-performance',
  ARRAY['Aumento de energía física y mental', 'Apoyo al rendimiento durante la actividad física', 'Mejora de la vitalidad sin estimulantes artificiales', 'Reducción del cansancio y la fatiga'],
  ARRAY['Maca', 'Ginseng', 'Cordyceps'],
  120,
  4.6,
  156
),

-- 10. NEUROSHIELD (Enfoque)
(
  'neuroshield',
  'NeuroShield',
  'neuroshield',
  'Neuroprotección y rendimiento cognitivo',
  'Suplemento dual que combina ingredientes para el refuerzo del sistema inmunológico y la salud cerebral. Con hongos medicinales, antioxidantes y micronutrientes esenciales que apoyan tanto la defensa natural del cuerpo como el rendimiento cognitivo.',
  949.00,
  '/images/carrusel-neuroshield.png',
  'cognitive',
  ARRAY['Apoyo al sistema inmunológico', 'Mejora del rendimiento cognitivo y enfoque', 'Acción antioxidante y neuroprotectora', 'Estimulación suave sin cafeína'],
  ARRAY['Reishi', 'Melena de León', 'Cola de Pavo'],
  95,
  4.8,
  124
)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  benefits = EXCLUDED.benefits,
  ingredients = EXCLUDED.ingredients,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count;
