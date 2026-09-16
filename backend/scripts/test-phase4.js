/**
 * Phase 4 Backend Integration Test
 * Verifies ULB Officer, queue, jurisdiction enforcement, and statutory actions.
 */
import { getSupabaseAdmin } from '../src/config/supabase.js';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTest() {
  console.log('🧪 Starting Phase 4 Backend Integration Test...\n');

  // 1. Official Login as ULB Officer (Anita Bhosale)
  console.log('1. Authenticating as ULB Officer (anita.bhosale@pmc.gov.in)...');
  const loginRes = await fetch(`${BASE_URL}/auth/government/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'anita.bhosale@pmc.gov.in',
      password: 'Password123!',
    }),
  });

  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('❌ Login failed:', loginData);
    process.exit(1);
  }

  const token = loginData.data?.accessToken;
  const officerUser = loginData.data?.user || loginData.data?.officer;
  console.log('✅ Authenticated successfully. Role:', officerUser?.role, 'Jurisdiction:', officerUser?.jurisdiction);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 2. Fetch Officer Queue
  console.log('\n2. Fetching Officer Work Queue (/cases/queue)...');
  const queueRes = await fetch(`${BASE_URL}/cases/queue`, { headers: authHeaders });
  const queueData = await queueRes.json();
  
  if (!queueRes.ok) {
    console.error('❌ Queue fetch failed:', queueData);
    process.exit(1);
  }

  const items = queueData.data?.items || [];
  console.log(`✅ Received ${items.length} items. QueueType: ${items[0]?.queueType}`);
  console.log('Sample Queue Item:', {
    id: items[0]?.id,
    ulpin: items[0]?.ulpin,
    ctsNumber: items[0]?.ctsNumber,
    landUse: items[0]?.landUse,
    isUrban: items[0]?.isUrban,
    zoning: items[0]?.zoning?.currentZone,
    taxStatus: items[0]?.tax?.paymentStatus,
  });

  // 3. Fetch Case Dossier
  const targetCaseId = items[0]?.id;
  console.log(`\n3. Fetching Case Dossier for ${targetCaseId}...`);
  const dossierRes = await fetch(`${BASE_URL}/cases/${targetCaseId}/dossier`, { headers: authHeaders });
  const dossierData = await dossierRes.json();

  if (!dossierRes.ok) {
    console.error('❌ Dossier fetch failed:', dossierData);
    process.exit(1);
  }

  console.log('✅ Dossier loaded successfully:');
  console.log('  ULPIN:', dossierData.data?.ulpin);
  console.log('  Zoning:', dossierData.data?.zoning?.current_zone, 'FSI:', dossierData.data?.zoning?.max_fsi);
  console.log('  Tax:', dossierData.data?.tax?.payment_status, 'Receipt:', dossierData.data?.tax?.receipt_number);
  console.log('  Checklist count:', dossierData.data?.statutoryChecklist?.length);

  // 4. Jurisdiction Tampering Test (Talathi attempting to access out-of-village case)
  console.log('\n4. Testing Jurisdiction Enforcement (Login as Wagholi Talathi)...');
  const talathiRes = await fetch(`${BASE_URL}/auth/government/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'prakash.shinde@maharashtra.gov.in',
      password: 'Password123!',
    }),
  });

  const talathiLogin = await talathiRes.json();
  const talathiToken = talathiLogin.data?.accessToken;
  const talathiUser = talathiLogin.data?.user || talathiLogin.data?.officer;
  console.log('✅ Talathi authenticated. Officer:', talathiUser?.name, 'Jurisdiction:', talathiUser?.jurisdiction);

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error('Database admin client unavailable');
    process.exit(1);
  }

  // Insert test out-of-village mutation (Lohegaon village, but officer is Wagholi Talathi)
  const outVillageId = 'MUT-TEST-OUT-JURIS';
  const { error: insErr } = await admin.from('mutations').upsert({
    id: outVillageId,
    mutation_number: 'FERFAR-OUT-JURIS',
    parcel_ulpin: 'TEST_ULPIN_MH_PUN_001',
    type: 'Sale Deed / Kharedi Khat',
    status: 'INITIATED',
    applicant_id: 'CIT-001',
    applicant_name: 'Outside Citizen',
    village_code: 'VIL-LOH',
    tehsil_code: 'TEH-HAV',
  });
  if (insErr) {
    console.error('❌ Insert error for test mutation:', insErr.message);
  }

  // Attempt to load dossier as Wagholi Talathi
  const tamperRes = await fetch(`${BASE_URL}/cases/${outVillageId}/dossier`, {
    headers: { 'Authorization': `Bearer ${talathiToken}` },
  });
  const tamperData = await tamperRes.json();
  console.log(`Tamper attempt response HTTP ${tamperRes.status}:`, tamperData.error?.code || tamperData.message || tamperData);

  if (tamperRes.status === 403) {
    console.log('🛡️ Jurisdiction Enforcement PASSED! (Received 403 Forbidden on URL tampering)');
  } else {
    console.error('❌ Expected 403 Forbidden but received:', tamperRes.status);
    process.exit(1);
  }

  // Cleanup test mutation
  await admin.from('mutations').delete().eq('id', outVillageId);

  // 5. ULB Officer Statutory Sanction Test
  console.log('\n5. Executing Statutory Sanction by ULB Officer...');
  const testUlbMutationId = 'MUT-TEST-ULB-ACTION';
  await admin.from('mutations').upsert({
    id: testUlbMutationId,
    mutation_number: 'FERFAR-ULB-TEST',
    parcel_ulpin: 'TEST_ULPIN_MH_PUN_002',
    type: 'Sale Deed / Kharedi Khat',
    status: 'REVIEWED',
    applicant_id: 'CIT-001',
    applicant_name: 'Abhishek Gujar',
    village_code: 'VIL-WAG',
    tehsil_code: 'TEH-HAV',
  });

  const approveRes = await fetch(`${BASE_URL}/mutations/${testUlbMutationId}/approve`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      remarks: 'Sanctioned under PMC Urban Municipal Land Regulations 2026. PMRDA CDP 2041 zoning verified.',
      _mfaToken: '123456',
    }),
  });

  const approveData = await approveRes.json();
  console.log(`Statutory Approve HTTP ${approveRes.status}:`, approveData.data?.status || approveData.message);

  if (approveRes.ok && approveData.data?.status === 'APPROVED') {
    console.log('✅ Statutory Sanction Order PASSED directly in PostgreSQL!');
  } else {
    console.error('❌ Statutory sanction failed:', approveData);
    process.exit(1);
  }

  // Verify timeline entry in database
  const { data: timelineEntries } = await admin.from('mutation_timeline').select('*').eq('mutation_id', testUlbMutationId);
  console.log(`✅ Mutation Timeline recorded ${timelineEntries?.length} entries.`);

  // Cleanup test record
  await admin.from('mutation_timeline').delete().eq('mutation_id', testUlbMutationId);
  await admin.from('mutations').delete().eq('id', testUlbMutationId);

  console.log('\n🎉 All Phase 4 Backend Integration Tests PASSED!');
}

runTest().catch(console.error);
