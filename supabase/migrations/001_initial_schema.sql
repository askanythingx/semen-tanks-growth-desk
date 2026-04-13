-- ================================================
-- GrowthDesk — Initial Schema Migration
-- Run this in Supabase SQL Editor
-- Date: April 13, 2026
-- ================================================

-- TASKS TABLE
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  issue_number integer not null,
  title text not null,
  description text,
  priority text not null check (priority in ('critical','high','medium','quick_win')),
  status text not null default 'todo' check (status in ('todo','in_progress','done','blocked')),
  assignee text not null check (assignee in ('Dhruvi','Deepak','Janey','Smit')),
  phase integer not null,
  phase_label text not null,
  category text not null,
  is_mobile boolean default false,
  dev_effort text,
  fix_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- QUIZ RESULTS TABLE
create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  submitted_by text not null,
  angle_1_pct integer default 0,
  angle_2_pct integer default 0,
  angle_3_pct integer default 0,
  angle_4_pct integer default 0,
  angle_5_pct integer default 0,
  angle_6_pct integer default 0,
  angle_7_pct integer default 0,
  angle_8_pct integer default 0,
  angle_1_note text default '',
  angle_2_note text default '',
  angle_3_note text default '',
  angle_4_note text default '',
  angle_5_note text default '',
  angle_6_note text default '',
  angle_7_note text default '',
  angle_8_note text default '',
  submitted_at timestamptz default now()
);

-- AUTO-UPDATE updated_at on tasks
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

-- SEED: 28 Website Audit Tasks (Dhruvi's Sprint)
insert into tasks (issue_number, title, description, priority, status, assignee, phase, phase_label, category, is_mobile, dev_effort, fix_summary) values

-- PHASE 1 — Critical (Week 1)
(1, 'Mobile price visibility — tap to view pricing banner', 'Add mobile-only banner on collection pages explaining how to view pricing per MVE guidelines', 'critical', 'todo', 'Dhruvi', 1, 'Week 1 — Critical', 'Mobile UX', true, '2-4 hours', 'CSS media query banner on collection pages for mobile only'),
(2, 'Homepage hero — full value proposition redesign', 'Replace "Welcome to SemenTanks.com" with strong headline, sub-headline, dual CTAs and trust icon bar', 'critical', 'todo', 'Dhruvi', 1, 'Week 1 — Critical', 'Conversion', true, '4-8 hours', 'New hero section with H1, CTAs, and 5-icon trust bar below fold'),
(3, 'Navigation consolidation — single mega menu + mobile bottom nav', 'Merge two duplicate mega menus into one. Add mobile bottom nav bar with 4 tabs', 'critical', 'todo', 'Dhruvi', 1, 'Week 1 — Critical', 'Navigation', true, '8-16 hours', 'Shopify nav restructure + custom Liquid for mobile bottom nav bar'),
(4, 'Sticky Add-to-Cart button on all PDPs', 'Floating ATC bar visible at all times on mobile when scrolling product pages', 'critical', 'todo', 'Dhruvi', 1, 'Week 1 — Critical', 'Conversion', true, '2-4 hours (app) / 6-10 hours (custom)', 'Install Sticky ATC Booster Pro or build custom sticky bar'),
(5, 'Homepage — remove duplicate products across sections', 'Each homepage section must feature different products. No product should appear twice', 'critical', 'todo', 'Dhruvi', 1, 'Week 1 — Critical', 'Mobile UX', true, '6-12 hours', 'Shopify section restructure — unique products per section'),
(6, 'Install live chat — Tidio or Gorgias', 'Install chat widget with bot flows for common pre-purchase questions', 'critical', 'todo', 'Dhruvi', 1, 'Week 1 — Critical', 'Conversion', false, '2-4 hours', 'Tidio install + 4 chatbot flows configured'),
(7, 'Email capture — Klaviyo + exit intent popup', 'Install Klaviyo, create exit-intent popup with Tank Selection Guide lead magnet', 'critical', 'todo', 'Dhruvi', 1, 'Week 1 — Critical', 'Conversion', false, '6-12 hours', 'Klaviyo install + popup + 3-email welcome flow'),

-- PHASE 2 — High Priority (Week 2)
(8, 'Trust badges bar — add below hero section', 'Add 5-icon trust bar directly below hero: 30 Yrs | Made in USA | Warranty | Shipping | Support', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Trust', true, '3-5 hours', 'New Shopify section with SVG icons below hero'),
(9, 'PDP descriptions — full content restructure', 'Add who-is-this-for section, FAQ accordion, specs table, accessories cross-sell to top 10 PDPs', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Product Pages', false, '12-20 hours', 'PDP template update across top 10 products'),
(10, 'Collection page filters — straw capacity, hold time, series, animal type', 'Enable Shopify native collection filtering with key filter dimensions', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Navigation', true, '6-10 hours', 'Shopify native filters + mobile slide-in filter drawer'),
(11, 'Urgency and scarcity — countdown timers + low stock badges', 'Add countdown to sale products and show low stock warnings when inventory under 5 units', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Conversion', false, '2-4 hours (app)', 'Urgency Bear app + Shopify inventory threshold display'),
(12, 'Cross-sell and upsell — PDP and cart drawer', 'Add Frequently Bought Together on PDPs. Add Complete Your Setup section in cart drawer', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Revenue', false, '6-12 hours', 'FBT app + cart drawer upsell section'),
(13, 'Reviews on PDPs — install Judge.me and migrate reviews', 'Install Judge.me, migrate existing reviews to product level, show stars on PDPs', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Trust', true, '4-8 hours', 'Judge.me install + review migration + Google Shopping stars'),
(14, 'Tank selector quiz — add Find My Tank CTA to homepage and collections', 'Add prominent Find My Tank CTA on hero and collection pages. Convert Quick Pick Guide to interactive quiz', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Conversion', true, '10-16 hours', 'CTA placement + Octane AI quiz integration'),
(15, 'Product title rename — fix naming convention across all products', 'Rename all products from underscore/ALL CAPS format to clean: Brand Model — Spec — Spec', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'SEO', false, '3-5 hours', 'Bulk CSV export/edit/import + 301 redirects for handle changes'),
(16, 'Breadcrumb navigation — enable on all pages', 'Enable breadcrumbs in theme settings. Format: Home > Collection > Product', 'high', 'todo', 'Dhruvi', 2, 'Week 2 — High Priority', 'Navigation', true, '30 mins — 4 hours', 'Theme settings toggle or custom Liquid snippet'),

-- PHASE 3 — Medium (Month 1)
(17, 'Recently viewed products + You May Also Like', 'Enable recently viewed widget and related products on all PDPs', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'Engagement', true, '1-3 hours', 'Theme settings toggle or LimeSpot app'),
(18, 'Cart page — add trust elements and savings callout', 'Add savings callout, trust icon bar, and call Mark link above checkout button', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'Conversion', false, '4-8 hours', 'cart.liquid template edits'),
(19, 'Footer — remove agency credit, add Est. 1995 tagline', 'Remove Arham web works credit. Add Select Genetics established line', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'Brand', false, '30 mins', 'Footer template edit'),
(20, 'Image optimisation — compress and serve correct sizes for mobile', 'Install TinyIMG or Crush.pics. Ensure srcset is correct. Target 1200px max for mobile', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'Performance', true, '2-4 hours setup', 'TinyIMG install + verify srcset in theme'),
(21, 'Remove Fun Stuff from primary navigation', 'Move Fun Stuff to footer only. Free nav slot for higher-converting category', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'Navigation', false, '15 mins', 'Shopify Navigation settings change'),
(22, 'Tank comparison page — dedicated page with sticky mobile column', 'Create /pages/compare-tanks with full table. Mobile: sticky first column', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'Product Pages', true, '4-8 hours', 'New Shopify page + responsive sticky column CSS'),
(23, 'Schema markup — add Product, Review, Organization, BreadcrumbList', 'Install JSON-LD for SEO app. Validate with Google Rich Results Test', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'SEO', false, '2-4 hours', 'JSON-LD for SEO app install + validation'),
(24, 'Back-to-top button on long mobile pages', 'Add floating back-to-top button that appears after 400px scroll on mobile', 'medium', 'todo', 'Dhruvi', 3, 'Month 1 — Medium', 'Mobile UX', true, '1-2 hours', 'Theme settings toggle or 10-line custom JS/CSS snippet'),

-- PHASE 4 — Quick Wins (Immediate)
(25, 'Announcement bar — replace instruction text with rotating offers', 'Replace hover instruction with 3 rotating messages: shipping, sale, 30 years', 'quick_win', 'todo', 'Dhruvi', 4, 'Quick Wins — Under 1hr', 'Brand', false, '30 mins', 'Shopify announcement bar setting with 3 rotating messages'),
(26, 'Review count — update from round 1000 to actual number', 'Change "1000 reviews" to exact real count for credibility', 'quick_win', 'todo', 'Dhruvi', 4, 'Quick Wins — Under 1hr', 'Trust', false, '15 mins', 'Theme text update — auto-solved when Judge.me installed'),
(27, 'Fix nav typo — MVE Customer Tanks 4 Sale', 'Change "4" to "For" in navigation item. Rename to Used MVE Tanks For Sale', 'quick_win', 'todo', 'Dhruvi', 4, 'Quick Wins — Under 1hr', 'Brand', false, '5 mins', 'Shopify Navigation settings — 5 minute fix'),
(28, 'Add tap-to-call phone button in mobile header', 'Add phone icon + Call Us to mobile header next to cart icon. Link: tel:724-263-6601', 'quick_win', 'todo', 'Dhruvi', 4, 'Quick Wins — Under 1hr', 'Mobile UX', false, '1-2 hours', 'header.liquid edit + SVG icon + tel: link'),
(29, 'Add Est. 1995 to header or logo area', 'Add Serving Breeders Since 1995 as tagline below or beside logo', 'quick_win', 'todo', 'Dhruvi', 4, 'Quick Wins — Under 1hr', 'Trust', false, '30-60 mins', 'Header template or logo image edit');
