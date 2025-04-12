import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlalsknmvyxamzyecdum.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsYWxza25tdnl4YW16eWVjZHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMzM0NDksImV4cCI6MjA1OTkwOTQ0OX0.DieTbdfRktmP1ZT6vcenplRmIb_W3J8Er8rLqdoTd9Y';
export const supabase = createClient(supabaseUrl, supabaseKey);