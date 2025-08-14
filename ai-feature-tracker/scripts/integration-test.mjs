import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env from .env and then override with .env.local if present
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

function fail(message, error) {
  console.error('❌ Integration test failed:', message);
  if (error) console.error(error);
  process.exit(1);
}

function assertEnv(name) {
  const val = process.env[name];
  if (!val || val.trim().length === 0) {
    fail(`Missing required environment variable: ${name}`);
  }
  return val;
}

async function main() {
  const url = assertEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anon = assertEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const supabase = createClient(url, anon);

  // 1) Basic connectivity
  const ping = await supabase.from('ai_tools').select('id').limit(1);
  if (ping.error) fail('Connectivity check query errored', ping.error);

  // 2) Simple data shape validation
  const tools = await supabase.from('ai_tools').select('id, name, is_active').limit(5);
  if (tools.error) fail('Tools query errored', tools.error);
  if (tools.data && !Array.isArray(tools.data)) fail('Expected tools.data to be an array');

  // 3) View access if present (optional)
  const updates = await supabase.from('recent_feature_updates').select('*').limit(1);
  if (updates.error && updates.error.code !== '42P01') {
    // Allow missing view/table in dev (42P01: undefined_table)
    fail('Recent feature updates query errored', updates.error);
  }

  console.log('✅ Integration tests passed.');
  process.exit(0);
}

main().catch((e) => fail('Unhandled error', e));


