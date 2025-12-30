-- Tabla de productos
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text unique not null,
  description text not null,
  long_description text not null,
  price numeric(10, 2) not null,
  image text not null,
  category text not null,
  benefits text[] not null,
  ingredients text[] not null,
  stock integer not null default 0,
  rating numeric(3, 2) default 0,
  reviews_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para mejorar rendimiento
create index if not exists products_category_idx on public.products(category);
create index if not exists products_slug_idx on public.products(slug);

-- RLS: Los productos son públicos (todos pueden leer)
alter table public.products enable row level security;

create policy "products_select_all"
  on public.products for select
  using (true);

-- Solo admins pueden modificar productos (por ahora deshabilitado para permitir seed)
create policy "products_insert_admin"
  on public.products for insert
  with check (true);

create policy "products_update_admin"
  on public.products for update
  using (true);
