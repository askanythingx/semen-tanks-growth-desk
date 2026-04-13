-- ================================================
-- GrowthDesk — Migration 002
-- Keywords table for persistent status tracking
-- Date: April 13, 2026
-- Run this AFTER 001_initial_schema.sql
-- ================================================

create table if not exists keywords (
  id uuid default gen_random_uuid() primary key,
  campaign text not null check (campaign in ('xc20', 'vapor')),
  keyword text not null,
  match_type text not null,
  angle text not null,
  intent text not null,
  monthly_volume text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger keywords_updated_at
  before update on keywords
  for each row execute function update_updated_at();

-- SEED: XC 20 Keywords
insert into keywords (campaign, keyword, match_type, angle, intent, monthly_volume, status) values
('xc20', 'cattle semen tank', 'Phrase', 'Animal', 'Very High', '590/mo', 'pending'),
('xc20', 'bull semen storage tank', 'Phrase', 'Animal', 'Very High', '320/mo', 'pending'),
('xc20', 'liquid nitrogen tank for cattle', 'Phrase', 'Animal', 'High', '260/mo', 'pending'),
('xc20', 'equine semen storage tank', 'Phrase', 'Animal', 'High', '90/mo', 'pending'),
('xc20', 'semen tank for cattle breeding', 'Phrase', 'Animal', 'Very High', '140/mo', 'pending'),
('xc20', 'liquid nitrogen tank artificial insemination', 'Phrase', 'Job', 'Very High', '210/mo', 'pending'),
('xc20', 'semen storage for AI breeding', 'Phrase', 'Job', 'High', '170/mo', 'pending'),
('xc20', 'how to store frozen bull semen', 'Broad', 'Job', 'Medium', '390/mo', 'pending'),
('xc20', 'cryogenic tank for livestock semen', 'Phrase', 'Job', 'High', '110/mo', 'pending'),
('xc20', 'semen tank for sale', 'Phrase', 'Buying Signal', 'Very High', '880/mo', 'pending'),
('xc20', 'MVE semen tank for sale', 'Phrase', 'Buying Signal', 'Very High', '210/mo', 'pending'),
('xc20', 'buy liquid nitrogen semen tank', 'Phrase', 'Buying Signal', 'Very High', '140/mo', 'pending'),
('xc20', 'semen tank best price', 'Phrase', 'Buying Signal', 'Very High', '90/mo', 'pending'),
('xc20', 'best semen tank for beginners', 'Phrase', 'Situation', 'High', '170/mo', 'pending'),
('xc20', 'starter semen tank for cattle', 'Phrase', 'Situation', 'High', '90/mo', 'pending'),
('xc20', 'replace old liquid nitrogen tank', 'Broad', 'Situation', 'High', '110/mo', 'pending'),
('xc20', 'best liquid nitrogen semen tank', 'Phrase', 'Competitor', 'Very High', '260/mo', 'pending'),
('xc20', 'MVE semen tank dealer', 'Phrase', 'Competitor', 'Very High', '110/mo', 'pending'),
('xc20', 'top rated semen storage tank', 'Phrase', 'Competitor', 'High', '90/mo', 'pending'),
('xc20', 'MVE tank distributor USA', 'Phrase', 'Geography', 'High', '90/mo', 'pending'),
('xc20', 'semen tank free shipping USA', 'Phrase', 'Geography', 'High', '70/mo', 'pending'),
('xc20', 'liquid nitrogen tank made in USA', 'Phrase', 'Geography', 'Medium', '140/mo', 'pending'),
('xc20', 'MVE XC 20 signature', 'Exact', 'Ecosystem', 'Very High', '90/mo', 'approved'),
('xc20', 'mve xc 20', 'Exact', 'Ecosystem', 'Very High', '70/mo', 'approved'),
('xc20', 'semen tank canes goblets', 'Phrase', 'Ecosystem', 'High', '110/mo', 'pending'),
('xc20', 'XC 20 tank accessories', 'Phrase', 'Ecosystem', 'High', '70/mo', 'pending'),
('xc20', 'semen tank spring breeding season', 'Broad', 'Season', 'Very High', '140/mo', 'pending'),
('xc20', 'AI breeding supplies 2026', 'Broad', 'Season', 'High', '90/mo', 'pending'),
('xc20', 'semen tank fast shipping in stock', 'Phrase', 'Season', 'Very High', '110/mo', 'pending'),
('xc20', 'cryoshipper xc', 'Phrase', 'Ecosystem', 'Low', '10/mo', 'rejected'),
('xc20', 'mve xc 20 3v', 'Phrase', 'Ecosystem', 'Low', '10/mo', 'rejected'),
('xc20', 'termo mve xc 20 signature', 'Phrase', 'Ecosystem', 'Low', '10/mo', 'rejected'),

-- SEED: Vapor 4/2V Keywords
('vapor', 'equine semen transport container', 'Phrase', 'Animal', 'Very High', '260/mo', 'pending'),
('vapor', 'horse semen shipping tank', 'Phrase', 'Animal', 'Very High', '320/mo', 'pending'),
('vapor', 'cattle semen shipping container', 'Phrase', 'Animal', 'High', '170/mo', 'pending'),
('vapor', 'canine semen transport container', 'Phrase', 'Animal', 'High', '90/mo', 'pending'),
('vapor', 'frozen semen transport livestock', 'Phrase', 'Animal', 'High', '140/mo', 'pending'),
('vapor', 'ship frozen semen safely', 'Phrase', 'Job', 'Very High', '210/mo', 'pending'),
('vapor', 'transport bull semen liquid nitrogen', 'Phrase', 'Job', 'Very High', '170/mo', 'pending'),
('vapor', 'vapor shipper frozen semen', 'Phrase', 'Job', 'Very High', '260/mo', 'pending'),
('vapor', 'dry shipper for semen transport', 'Phrase', 'Job', 'High', '140/mo', 'pending'),
('vapor', 'how to ship frozen horse semen', 'Broad', 'Job', 'High', '390/mo', 'pending'),
('vapor', 'vapor shipper for sale', 'Phrase', 'Buying Signal', 'Very High', '590/mo', 'pending'),
('vapor', 'dry shipper semen for sale', 'Phrase', 'Buying Signal', 'Very High', '210/mo', 'pending'),
('vapor', 'buy vapor shipper for semen', 'Phrase', 'Buying Signal', 'Very High', '140/mo', 'pending'),
('vapor', 'MVE vapor shipper price', 'Phrase', 'Buying Signal', 'Very High', '110/mo', 'pending'),
('vapor', 'semen shipping equipment starter', 'Phrase', 'Situation', 'High', '110/mo', 'pending'),
('vapor', 'how to ship semen to vet', 'Broad', 'Situation', 'High', '260/mo', 'pending'),
('vapor', 'vapor shipper with mushroom cover', 'Phrase', 'Situation', 'Very High', '90/mo', 'pending'),
('vapor', 'best vapor shipper for semen', 'Phrase', 'Competitor', 'Very High', '210/mo', 'pending'),
('vapor', 'MVE vapor shipper review', 'Phrase', 'Competitor', 'High', '90/mo', 'pending'),
('vapor', 'compare semen vapor shippers', 'Phrase', 'Competitor', 'High', '70/mo', 'pending'),
('vapor', 'vapor shipper semen USA supplier', 'Phrase', 'Geography', 'High', '90/mo', 'pending'),
('vapor', 'liquid nitrogen dry shipper free shipping', 'Phrase', 'Geography', 'High', '110/mo', 'pending'),
('vapor', 'MVE sc 4 2v', 'Exact', 'Ecosystem', 'Very High', '30/mo', 'approved'),
('vapor', 'mve sc4 2v next generation', 'Exact', 'Ecosystem', 'Very High', '30/mo', 'approved'),
('vapor', 'vapor shipper semen canes', 'Phrase', 'Ecosystem', 'High', '90/mo', 'pending'),
('vapor', 'semen dry shipper accessories', 'Phrase', 'Ecosystem', 'High', '70/mo', 'pending'),
('vapor', 'equine breeding season semen shipper', 'Broad', 'Season', 'Very High', '140/mo', 'pending'),
('vapor', 'spring AI breeding shipping container', 'Broad', 'Season', 'High', '110/mo', 'pending'),
('vapor', 'frozen semen transport fast delivery', 'Phrase', 'Season', 'Very High', '170/mo', 'pending');
