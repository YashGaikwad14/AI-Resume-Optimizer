const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

let supabase = null;
try {
  const looksValidUrl = /^https?:\/\//i.test(SUPABASE_URL) && SUPABASE_URL.includes('.supabase.co');
  const hasKey = SUPABASE_SERVICE_ROLE_KEY.length > 20;
  if (looksValidUrl && hasKey) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  } else {
    console.warn('[supabase] Skipping client init. Set valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  }
} catch (err) {
  console.error('[supabase] Failed to init client:', err.message);
  supabase = null;
}

async function saveEvent(table, payload) {
  try {
    if (!supabase) return { skipped: true };
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) throw error;
    return { data };
  } catch (err) {
    console.error(`[supabase] insert into ${table} failed`, err);
    return { error: err.message };
  }
}

async function saveRecord(payload) {
  return saveEvent('records', payload);
}

async function recentRecords(userId, type, limit = 20) {
  try {
    if (!supabase) return { skipped: true };
    let query = supabase.from('records').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    return { data };
  } catch (err) {
    console.error('[supabase] recentRecords failed', err);
    return { error: err.message };
  }
}

async function searchRecords(userId, q, type, limit = 50) {
  try {
    if (!supabase) return { skipped: true };
    let query = supabase.from('records').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
    if (type) query = query.eq('type', type);
    if (q) query = query.ilike('content', `%${q}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { data };
  } catch (err) {
    console.error('[supabase] searchRecords failed', err);
    return { error: err.message };
  }
}

module.exports = { supabase, saveEvent, saveRecord, recentRecords, searchRecords };


