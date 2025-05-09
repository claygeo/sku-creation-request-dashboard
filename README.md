# Product Creation Dashboard

An Electron-based desktop application built with React for submitting and tracking SKU (Stock Keeping Unit) requests, integrated with Supabase for data storage and EmailJS for email notifications. Designed to streamline SKU creation processes (potentially for Curaleaf), it features a pastel-themed UI with light/dark modes, offline support via electron-store, and a particle background for visual appeal.

## Features

- Dashboard: Centralized interface with options to submit new SKU requests or check request statuses, featuring a theme toggle (light/dark) and particle background.
- Submit SKU Request: Detailed form for entering product details (e.g., brand, category, strain, cannabinoids, cost), with validation, progress tracking, Supabase storage, and EmailJS notifications.
- Check Status: Table view of SKU requests with details (ID, date, distributor menu name, status, completed by) and the ability to cancel pending requests, synced with Supabase and local storage.
- Supabase Integration: Stores SKU requests in a sku_requests table, with offline support via electron-store.
- Email Notifications: Sends email notifications via EmailJS upon successful SKU request submission.
- Responsive UI: Pastel-themed design with gradients (pink to green), Poppins/Roboto fonts, and responsive layouts for light/dark modes.

## Prerequisites

- Node.js 16 or higher
- Supabase account with a sku_requests table (see Setup for SQL)
- EmailJS account with a service, template, and user ID
- Git (for cloning the repository)

## Setup

1. Clone the Repository:
git clone https://github.com/your-username/product-creation-dashboard.git
cd product-creation-dashboard

2. Install Dependencies:
npm install


3. Set Up Supabase:
- Create a Supabase project and obtain the URL and anon key.
- Create the sku_requests table using the following SQL:
  CREATE TABLE sku_requests (
    id BIGINT PRIMARY KEY,
    date_requested DATE,
    requester_email TEXT,
    distributor_menu_name TEXT,
    brand TEXT,
    master_category TEXT,
    subcategory_1 TEXT,
    subcategory_2 TEXT,
    product_line TEXT,
    product_attribute TEXT,
    strain TEXT,
    dominance TEXT,
    flavor TEXT,
    cannabinoids TEXT,
    ttl_thc TEXT,
    ttl_cbd TEXT,
    qty_in_pack INTEGER,
    cost FLOAT,
    item_index_number TEXT,
    status TEXT DEFAULT 'Pending',
    completed_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

- Create a src/utils/supabase.js file with your Supabase client:
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your_supabase_url';
const supabaseKey = 'your_supabase_anon_key';
export const supabase = createClient(supabaseUrl, supabaseKey);

4. Configure EmailJS:
- Create an EmailJS account and obtain your Service ID, Template ID, and User ID.
- Update SubmitRequest.jsx with your EmailJS credentials:
await emailjs.send('your_service_id', 'your_template_id', emailParams, 'your_user_id');

5. Run the Application:
- Development mode (starts Vite and Electron):
npm run dev
- Build for production (creates a portable Windows executable):
npm run package
The output will be in the dist/ folder.

## Notes

The application is tailored to Curaleaf’s SKU creation process. Ensure permission to share if making the repository public.
Offline support is provided via electron-store, with automatic syncing to Supabase when online.
The src/utils/supabase.js file is missing from the provided files; create it as shown in the Setup section.
The EmailJS configuration is currently planned. SoonTM.
