/**
 * Land Stack / BHARATBHUMI — Deterministic Canonical Seeder
 * 
 * 1. Seeds all 14 canonical roles into `government_roles` table
 * 2. Seeds key government users into `government_users` table
 * 3. Creates Supabase Auth users for officers & citizens with confirmed email/phone
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Supabase credentials missing in backend/.env');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CANONICAL_ROLES = [
  { role: 'CITIZEN', name: 'Citizen Landholder', department_code: 'DEPT-REV', level: 'Citizen' },
  { role: 'TALATHI', name: 'Talathi / Patwari', department_code: 'DEPT-REV', level: 'Village' },
  { role: 'PATWARI', name: 'Patwari (Accountant)', department_code: 'DEPT-REV', level: 'Village' },
  { role: 'SRO', name: 'Sub-Registrar Officer', department_code: 'DEPT-REG', level: 'Tehsil' },
  { role: 'CRO', name: 'Circle Revenue Officer', department_code: 'DEPT-REV', level: 'Circle' },
  { role: 'TEHSILDAR', name: 'Tehsildar & Executive Magistrate', department_code: 'DEPT-REV', level: 'Tehsil' },
  { role: 'COLLECTOR', name: 'District Collector & DM', department_code: 'DEPT-DIST', level: 'District' },
  { role: 'SURVEY_GIS', name: 'Cadastral Survey & GIS Officer', department_code: 'DEPT-REV', level: 'Tehsil' },
  { role: 'ULB_OFFICER', name: 'Urban Local Body Officer', department_code: 'DEPT-REV', level: 'City' },
  { role: 'STATE_PMU', name: 'State PMU Project Lead', department_code: 'DEPT-STATE', level: 'State' },
  { role: 'STATE_AUTHORITY', name: 'State Revenue Authority', department_code: 'DEPT-STATE', level: 'State' },
  { role: 'NATIONAL_MONITOR', name: 'National Dashboard Monitor', department_code: 'DEPT-NAT', level: 'National' },
  { role: 'DOLR_NATIONAL', name: 'Department of Land Resources', department_code: 'DEPT-NAT', level: 'National' },
  { role: 'ADMIN', name: 'Platform System Administrator', department_code: 'DEPT-ADMIN', level: 'System' },
];

const OFFICERS_DATA = [
  {
    id: 'GOV-001',
    name: 'Sanjay Deshmukh',
    local_name: 'संजय देशमुख',
    email: 'sanjay.deshmukh@maharashtra.gov.in',
    role: 'TEHSILDAR',
    department_code: 'DEPT-REV',
    designation: 'Tehsildar & Executive Magistrate',
    state_code: 'MH',
    district_code: 'DIST-PUN',
    tehsil_code: 'TEH-HAV',
    mobile: '+91 98230 11111',
    active: true,
  },
  {
    id: 'GOV-002',
    name: 'Prakash Shinde',
    local_name: 'प्रकाश शिंदे',
    email: 'prakash.shinde@maharashtra.gov.in',
    role: 'TALATHI',
    department_code: 'DEPT-REV',
    designation: 'Talathi Saja Wagholi',
    state_code: 'MH',
    district_code: 'DIST-PUN',
    tehsil_code: 'TEH-HAV',
    village_code: 'VIL-WAG',
    mobile: '+91 98230 22222',
    active: true,
  },
  {
    id: 'GOV-003',
    name: 'Rekha Joshi',
    local_name: 'रेखा जोशी',
    email: 'rekha.joshi@igrmaharashtra.gov.in',
    role: 'SRO',
    department_code: 'DEPT-REG',
    designation: 'Sub-Registrar Class-1 Haveli',
    state_code: 'MH',
    district_code: 'DIST-PUN',
    tehsil_code: 'TEH-HAV',
    mobile: '+91 98230 33333',
    active: true,
  },
  {
    id: 'GOV-004',
    name: 'Dr. Suhas Diwase, IAS',
    local_name: 'डॉ. सुहास दिवसे',
    email: 'collector.pune@maharashtra.gov.in',
    role: 'COLLECTOR',
    department_code: 'DEPT-DIST',
    designation: 'District Collector & DM',
    state_code: 'MH',
    district_code: 'DIST-PUN',
    mobile: '+91 98230 44444',
    active: true,
  },
  {
    id: 'GOV-005',
    name: 'Vikram Patole',
    local_name: 'विक्रम पाटोळे',
    email: 'vikram.patole@maharashtra.gov.in',
    role: 'SURVEY_GIS',
    department_code: 'DEPT-REV',
    designation: 'Cadastral Survey Specialist',
    state_code: 'MH',
    district_code: 'DIST-PUN',
    tehsil_code: 'TEH-HAV',
    mobile: '+91 98230 55555',
    active: true,
  },
  {
    id: 'GOV-006',
    name: 'Anita Bhosale',
    local_name: 'अनिता भोसले',
    email: 'anita.bhosale@pmc.gov.in',
    role: 'ULB_OFFICER',
    department_code: 'DEPT-REV',
    designation: 'Urban Land Records Officer',
    state_code: 'MH',
    district_code: 'DIST-PUN',
    mobile: '+91 98230 66666',
    active: true,
  },
  {
    id: 'GOV-011',
    name: 'Anil Verma',
    local_name: 'अनिल वर्मा',
    email: 'anil.verma@pmu.landrecords.gov.in',
    role: 'STATE_PMU',
    department_code: 'DEPT-STATE',
    designation: 'State PMU Project Lead',
    state_code: 'MH',
    mobile: '+91 98230 77777',
    active: true,
  },
  {
    id: 'GOV-013',
    name: 'Meera Sengupta',
    local_name: 'मीरा सेनगुप्ता',
    email: 'meera.sengupta@dolr.gov.in',
    role: 'NATIONAL_MONITOR',
    department_code: 'DEPT-NAT',
    designation: 'National MIS Lead',
    mobile: '+91 98230 88888',
    active: true,
  },
  {
    id: 'GOV-014',
    name: 'System Administrator',
    local_name: 'प्रशासक',
    email: 'admin@landstack.gov.in',
    role: 'ADMIN',
    department_code: 'DEPT-ADMIN',
    designation: 'Platform Administrator',
    mobile: '+91 98230 99999',
    active: true,
  },
];

async function seed() {
  console.log('🌱 Starting Canonical Seeding...\n');

  // 1. Seed Roles
  console.log('1. Seeding 14 Canonical Roles into government_roles...');
  for (const r of CANONICAL_ROLES) {
    const { error } = await admin.from('government_roles').upsert({
      role: r.role,
      name: r.name,
      department_code: r.department_code,
      level: r.level,
      permissions: [],
    });
    if (error) {
      console.warn(`  ⚠️ Role ${r.role}: ${error.message}`);
    } else {
      console.log(`  ✅ Role ${r.role} active`);
    }
  }

  // 2. Provision Officers
  console.log('\n2. Syncing Government Users into government_users table...');
  for (const off of OFFICERS_DATA) {
    const { error: offError } = await admin.from('government_users').upsert({
      id: off.id,
      name: off.name,
      local_name: off.local_name,
      email: off.email,
      role: off.role,
      department_code: off.department_code,
      designation: off.designation,
      state_code: off.state_code || null,
      district_code: off.district_code || null,
      tehsil_code: off.tehsil_code || null,
      village_code: off.village_code || null,
      mobile: off.mobile || null,
      active: off.active,
    });

    if (offError) {
      console.warn(`  ⚠️ Error saving officer ${off.id}: ${offError.message}`);
    } else {
      console.log(`  ✅ Officer record synced: ${off.name} (${off.role})`);
    }
  }

  console.log('\n🎉 Canonical Seeding Complete!');
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
