# Sistema de Categorías - Documentación

## Resumen

Se ha implementado un sistema completo de gestión de categorías para los productos de STARDUST, incluyendo base de datos, APIs, interfaz de administración y filtros en la tienda.

## Características Implementadas

### 1. Base de Datos

**Script:** `scripts/023_create_categories_table.sql`

- Tabla `categories` con campos: id, name, slug, description, display_order, is_active
- 6 categorías predefinidas: Relajación, Enfoque, Energía, Defensa, Longevidad, Balance Hormonal
- Políticas RLS configuradas (lectura pública, escritura autenticada)
- Índices para optimización de búsquedas

### 2. APIs REST

**Endpoints creados:**

- `GET /api/admin/categories` - Listar todas las categorías
- `POST /api/admin/categories` - Crear nueva categoría
- `PUT /api/admin/categories/[id]` - Actualizar categoría
- `DELETE /api/admin/categories/[id]` - Eliminar categoría
- `GET /api/products/[id]` - Obtener detalles completos de producto

### 3. Panel de Administración

**Ruta:** `/admin/categorias`

**Funcionalidades:**
- Tabla con todas las categorías ordenadas por `display_order`
- Estadísticas: total de categorías y categorías activas
- Búsqueda en tiempo real
- Crear, editar y eliminar categorías
- Toggle de estado activo/inactivo
- Generación automática de slug desde el nombre

**Componentes:**
- `components/admin/categories-table.tsx` - Tabla de categorías
- `components/admin/category-dialog.tsx` - Formulario de categoría

### 4. Gestión de Productos con Categorías

**Actualización:** `components/admin/product-dialog.tsx`

- Select dropdown con categorías dinámicas cargadas desde BD
- Campo de descripción larga para el modal "Ver Más"
- Validación de categoría requerida

### 5. Página de Productos Pública

**Mejoras en:** `app/productos/page.tsx`

- Grid responsivo: 2 columnas en móvil, 3 en escritorio
- Filtros funcionales por categoría y precio
- Ordenamiento múltiple (precio, nombre, destacados)
- Contador de resultados filtrados
- Botón "Limpiar filtros"

### 6. Tarjetas de Producto

**Actualización:** `components/product-card.tsx`

**Características:**
- Fondo con gradiente igual a la sección de inicio
- Precio visible
- Botón "Agregar al Carrito" funcional
- Botón "Ver Más" que abre modal
- Modal con:
  - Imagen grande del producto
  - Descripción completa (long_description)
  - Lista de beneficios
  - Precio destacado
  - Botón para agregar al carrito
  - Botón de cerrar

### 7. Filtros Dinámicos

**Actualización:** `components/product-filters.tsx`

- Carga de categorías desde base de datos
- Fallback a categorías predefinidas si falla la carga
- Filtros por categoría (múltiple selección)
- Filtros por rango de precio
- Ordenamiento por precio y nombre
- Indicador visual de filtros activos

## Flujo de Trabajo

### Para Administradores:

1. **Gestionar Categorías:**
   - Ir a `/admin/categorias`
   - Crear, editar o eliminar categorías
   - Establecer orden de visualización
   - Activar/desactivar categorías

2. **Gestionar Productos:**
   - Ir a `/admin/productos`
   - Al crear/editar producto, seleccionar categoría del dropdown
   - Llenar descripción corta y descripción larga
   - La descripción larga se muestra en el modal "Ver Más"

### Para Clientes:

1. **Navegar Productos:**
   - Ir a `/productos`
   - Ver grid de 2 columnas en móvil, 3 en escritorio
   - Usar filtros de categoría y precio
   - Ordenar productos según preferencia

2. **Ver Detalles:**
   - Click en "Ver Más" abre modal con información completa
   - Ver descripción detallada y beneficios
   - Agregar al carrito desde el modal o desde la tarjeta

## Estructura de Datos

### Tabla Categories
\`\`\`sql
categories {
  id: UUID PRIMARY KEY
  name: TEXT NOT NULL UNIQUE
  slug: TEXT NOT NULL UNIQUE
  description: TEXT
  display_order: INTEGER DEFAULT 0
  is_active: BOOLEAN DEFAULT true
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
\`\`\`

### Relación con Products
\`\`\`
products.category (TEXT) -> categories.name
\`\`\`

## Próximas Mejoras Sugeridas

1. Migrar `products.category` de TEXT a UUID con foreign key a `categories.id`
2. Agregar imágenes a las categorías
3. Implementar páginas de categoría individuales (`/productos/categoria/[slug]`)
4. Analytics de categorías más populares
5. Filtros por múltiples criterios simultáneos
6. Búsqueda por texto en productos

## Notas Técnicas

- Las categorías inactivas no aparecen en los filtros públicos
- El slug se genera automáticamente del nombre sin acentos
- Los filtros mantienen el estado durante la sesión
- El modal de producto se cierra al agregar al carrito
- Todos los cambios son en tiempo real sin necesidad de recargar
