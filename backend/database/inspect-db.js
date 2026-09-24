import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  const tables = [
    'parcels',
    'ownership_records',
    'encumbrances',
    'restrictions',
    'zoning',
    'tax_records',
    'court_cases',
    'parcel_documents',
    'mutations',
    'mutation_timeline',
    'citizens',
    'government_users',
    'government_roles',
    'audit_events',
    'states',
    'districts',
    'tehsils',
    'villages'
  ];

  console.log('=== REAL DATABASE INSPECTION ===');
  for (const table of tables) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' }).limit(1);
    if (error) {
      console.log(`❌ Table [${table}]: ERROR ${error.message} (${error.code})`);
    } else {
      const cols = data && data.length > 0 ? Object.keys(data[0]) : '(Empty)';
      console.log(`✅ Table [${table}]: Count=${count}, Columns=`, cols);
      if (data && data.length > 0) {
        console.log(`   Sample [${table}]:`, JSON.stringify(data[0]));
      }
    }
  }
}

inspect().catch(console.error);
