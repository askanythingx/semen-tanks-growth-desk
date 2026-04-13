-- ================================================
-- GrowthDesk — Migration 003
-- Sprints table + tasks updates
-- Date: April 13, 2026
-- Run AFTER 001 and 002
-- ================================================

-- SPRINTS TABLE
create table if not exists sprints (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  sprint_number integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger sprints_updated_at
  before update on sprints
  for each row execute function update_updated_at();

-- Add sprint_id and not_required to tasks
alter table tasks
  add column if not exists sprint_id uuid references sprints(id),
  add column if not exists not_required boolean default false;

-- Update status check to include not_required as a status filter concept
-- (we store it as a boolean flag, not a status)

-- SEED: Sprint 1
insert into sprints (name, description, status, sprint_number) values
('Website Audit — Sprint 1', 'Full Shopify store audit — 29 issues across mobile UX, CRO, navigation, trust and performance', 'active', 1)
returning id;

-- Update all existing tasks to belong to Sprint 1
-- Run this after inserting sprint above — replace the UUID below with the actual sprint ID from the insert above
-- OR run this which auto-finds it:
update tasks
set sprint_id = (select id from sprints where sprint_number = 1 limit 1),
    not_required = false
where sprint_id is null;
