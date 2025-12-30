-- Tabla de reseñas de productos
create table if not exists public.reviews (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  comment text not null,
  helpful_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index if not exists reviews_product_id_idx on public.reviews(product_id);
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

-- RLS: Las reseñas son públicas
alter table public.reviews enable row level security;

create policy "reviews_select_all"
  on public.reviews for select
  using (true);

create policy "reviews_insert_all"
  on public.reviews for insert
  with check (true);

create policy "reviews_update_all"
  on public.reviews for update
  using (true);
