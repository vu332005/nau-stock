-- Run this script in your Supabase SQL Editor to set up the necessary tables

-- 1. Create the tickers table
CREATE TABLE IF NOT EXISTS public.tickers (
  ticker text PRIMARY KEY,
  return_3m double precision NOT NULL,
  return_6m double precision NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the settings table for storing the admin password hash
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- 3. (Optional) Set up Row Level Security (RLS)
-- If this is just a demo/internal tool and you don't want to deal with complex Auth policies,
-- you can leave RLS disabled. Anyone with the Anon Key can read/write.
-- The UI handles the password check.
