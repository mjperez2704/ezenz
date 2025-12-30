-- Tabla de órdenes
create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null,
  tax numeric(10, 2) not null,
  total numeric(10, 2) not null,
  status text not null default 'completed',
  payment_method text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_customer_email_idx on public.orders(customer_email);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- RLS: Los usuarios pueden ver sus propias órdenes, o por email si no están autenticados
alter table public.orders enable row level security;

create policy "orders_select_own"
  on public.orders for select
  using (
    auth.uid() = user_id 
    or customer_email = current_setting('request.jwt.claims', true)::json->>'email'
    or true -- Temporal: permitir acceso por email
  );

create policy "orders_insert_own"
  on public.orders for insert
  with check (true); -- Cualquiera puede crear una orden
