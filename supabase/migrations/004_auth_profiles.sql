-- ================================================
-- GrowthDesk — Migration 004
-- User profiles + permissions
-- Date: April 13, 2026
-- Run AFTER 001, 002, 003
-- ================================================

-- USER PROFILES TABLE
-- Links to Supabase Auth users
create table if not exists user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  can_see_dashboard boolean default true,
  can_see_sprints boolean default false,
  can_see_surveys boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger user_profiles_updated_at
  before update on user_profiles
  for each row execute function update_updated_at();

-- RLS: users can only read their own profile
-- Admins can read and write all profiles
alter table user_profiles enable row level security;

create policy "Users can read own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on user_profiles for select
  using (
    exists (
      select 1 from user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert profiles"
  on user_profiles for insert
  with check (
    exists (
      select 1 from user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update profiles"
  on user_profiles for update
  using (
    exists (
      select 1 from user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ================================================
-- STEP 1: Create admin user in Supabase Auth
-- Go to Supabase → Authentication → Users → Add User
-- Email: smit@sementanks.com
-- Password: GrowthDesk@2026
-- Copy the UUID of the created user
-- Then run STEP 2 below replacing YOUR_ADMIN_UUID
-- ================================================

-- STEP 2: Insert admin profile (replace YOUR_ADMIN_UUID with actual UUID from Auth)
-- insert into user_profiles (id, name, email, role, can_see_dashboard, can_see_sprints, can_see_surveys)
-- values ('YOUR_ADMIN_UUID', 'Smit', 'smit@sementanks.com', 'admin', true, true, true);

-- ================================================
-- Example: Adding Dhruvi after she is created in Auth
-- insert into user_profiles (id, name, email, role, can_see_dashboard, can_see_sprints, can_see_surveys)
-- values ('DHRUVI_UUID', 'Dhruvi Axit', 'dhruvi@sementanks.com', 'member', true, true, false);
-- ================================================
