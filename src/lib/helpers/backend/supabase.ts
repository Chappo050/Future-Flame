// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = SUPABASE_SECRET_KEY;
const supabasePrivate = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabasePrivate;
