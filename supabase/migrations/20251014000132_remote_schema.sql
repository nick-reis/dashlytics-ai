create extension if not exists "citext" with schema "public" version '1.6';

revoke delete on table "public"."products" from "anon";

revoke insert on table "public"."products" from "anon";

revoke references on table "public"."products" from "anon";

revoke select on table "public"."products" from "anon";

revoke trigger on table "public"."products" from "anon";

revoke truncate on table "public"."products" from "anon";

revoke update on table "public"."products" from "anon";

revoke delete on table "public"."products" from "authenticated";

revoke insert on table "public"."products" from "authenticated";

revoke references on table "public"."products" from "authenticated";

revoke select on table "public"."products" from "authenticated";

revoke trigger on table "public"."products" from "authenticated";

revoke truncate on table "public"."products" from "authenticated";

revoke update on table "public"."products" from "authenticated";

revoke delete on table "public"."products" from "service_role";

revoke insert on table "public"."products" from "service_role";

revoke references on table "public"."products" from "service_role";

revoke select on table "public"."products" from "service_role";

revoke trigger on table "public"."products" from "service_role";

revoke truncate on table "public"."products" from "service_role";

revoke update on table "public"."products" from "service_role";

create table "public"."customers" (
    "id" uuid not null default gen_random_uuid(),
    "email" citext,
    "phone" text,
    "first_name" text,
    "last_name" text,
    "full_name" text generated always as (TRIM(BOTH FROM ((COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text)))) stored,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "last_activity_at" timestamp with time zone,
    "orders_count" integer not null default 0,
    "total_spent" numeric(12,2) not null default 0,
    "shipping_address" jsonb
);


alter table "public"."customers" enable row level security;

create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "customer_id" uuid not null,
    "product_ids" uuid[] not null,
    "total_amount" numeric(12,2) not null,
    "status" text default 'open'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."orders" enable row level security;

CREATE INDEX customers_email_idx ON public.customers USING btree (email);

CREATE UNIQUE INDEX customers_email_key ON public.customers USING btree (email);

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

CREATE INDEX orders_created_at_idx ON public.orders USING btree (created_at DESC);

CREATE INDEX orders_customer_idx ON public.orders USING btree (customer_id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE INDEX orders_status_idx ON public.orders USING btree (status);

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."customers" add constraint "customers_email_key" UNIQUE using index "customers_email_key";

alter table "public"."orders" add constraint "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id) not valid;

alter table "public"."orders" validate constraint "orders_customer_id_fkey";

alter table "public"."orders" add constraint "orders_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'paid'::text, 'fulfilled'::text, 'cancelled'::text]))) not valid;

alter table "public"."orders" validate constraint "orders_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.orders_rollup_after()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  affected uuid[];
begin
  if (tg_op = 'INSERT') then
    affected := array[NEW.customer_id];
  elsif (tg_op = 'UPDATE') then
    affected := array[
      coalesce(OLD.customer_id, NEW.customer_id),
      NEW.customer_id
    ];
  elsif (tg_op = 'DELETE') then
    affected := array[OLD.customer_id];
  end if;

  -- dedupe just in case
  with x as (select distinct unnest(affected) as id)
  select coalesce(array_agg(id), array[]::uuid[]) into affected from x;

  perform public.update_customer_rollups(affected);
  return null;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at := now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_customer_rollups(_customer_ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  with s as (
    select
      o.customer_id,
      count(*)::int                           as orders_count,
      coalesce(sum(o.total_amount), 0)::numeric(12,2) as total_spent,
      max(o.created_at)                      as last_activity_at
    from public.orders o
    where o.customer_id = any (_customer_ids)
    group by o.customer_id
  )
  update public.customers c
  set
    orders_count     = s.orders_count,
    total_spent      = s.total_spent,
    last_activity_at = s.last_activity_at,
    updated_at       = now()
  from s
  where c.id = s.customer_id;

  update public.customers c
  set
    orders_count     = 0,
    total_spent      = 0,
    last_activity_at = null,
    updated_at       = now()
  where c.id = any (_customer_ids)
    and not exists (select 1 from public.orders o where o.customer_id = c.id);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.execute_sql(query text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    result jsonb;
begin
    -- Safety check: only allow SELECT
    if left(upper(query), 6) != 'SELECT' then
        raise exception 'Only SELECT statements are allowed';
    end if;

    execute format('SELECT json_agg(t) FROM (%s) t', query) into result;
    return coalesce(result, '[]'::jsonb);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER trg_customers_set_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_after_delete_rollup AFTER DELETE ON public.orders FOR EACH ROW EXECUTE FUNCTION orders_rollup_after();

CREATE TRIGGER trg_orders_after_insert_rollup AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION orders_rollup_after();

CREATE TRIGGER trg_orders_after_update_rollup AFTER UPDATE OF customer_id, total_amount, created_at, status ON public.orders FOR EACH ROW EXECUTE FUNCTION orders_rollup_after();

CREATE TRIGGER trg_orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();



