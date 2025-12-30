-- Tabla de suscriptores al newsletter
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índice
create index if not exists newsletter_email_idx on public.newsletter_subscribers(email);

-- RLS: Solo lectura para verificar duplicados
alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_select_all"
  on public.newsletter_subscribers for select
  using (true);

create policy "newsletter_insert_all"
  on public.newsletter_subscribers for insert
  with check (true);
