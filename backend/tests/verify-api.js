/**
 * Land Stack Backend — API Verification Test Suite
 * 
 * Verifies core workflows strictly against Supabase PostgreSQL + Auth:
 * 1. Health check & version
 * 2. Application types
 * 3. Citizen OTP request & verify (with real DB citizen + JWT cookie)
 * 4. Government officer login (Sanjay Deshmukh - TEHSILDAR)
 * 5. Parcel search
 * 6. Parcel 360° dossier aggregation
 * 7. Work queues & statutory case dossiers
 * 8. Mutation creation by Citizen
 * 9. Mutation state machine guard (premature jump rejected with 409)
 * 10. Admin statutory non-bypass (ADMIN blocked from approval with 403)
 * 11. Jurisdictions hierarchy
 * 12. GIS spatial GeoJSON
 * 13. Analytics national overview
 */

const BASE_URL = 'http://localhost:5000/api/v1';

function extractCookies(res) {
  if (typeof res.headers.getSetCookie === 'function') {
    const list = res.headers.getSetCookie();
    if (list && list.length > 0) {
      return list.map((c) => c.split(';')[0]).join('; ');
    }
  }
  const raw = res.headers.get('set-cookie');
  if (!raw) return '';
  return raw
    .split(',')
    .map((c) => c.split(';')[0].trim())
    .join('; ');
}

async function runTests() {
  console.log('🧪 Starting LAND-STACK Database-Only Backend Verification...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /health returns healthy database-only status', async () => {
    const res = await fetch('http://localhost:5000/health');
    const data = await res.json();
    if (data.status !== 'healthy' || data.version !== '2.0.0') {
      throw new Error(`Unexpected health payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. Application Types
  await test('GET /applications/types returns statutory services from DB', async () => {
    const res = await fetch(`${BASE_URL}/applications/types`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Failed to get application types: ${JSON.stringify(data)}`);
    }
  });

  // 3. Citizen OTP Auth
  let citizenCookie = '';
  await test('POST /auth/citizen/request-otp generates OTP for DB citizen', async () => {
    const res = await fetch(`${BASE_URL}/auth/citizen/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: '+91 98230 45891' }),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`OTP request failed: ${JSON.stringify(data)}`);
    }
  });

  await test('POST /auth/citizen/verify-otp verifies and sets HTTP cookie', async () => {
    const res = await fetch(`${BASE_URL}/auth/citizen/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: '+91 98230 45891', otp: '123456' }),
    });
    citizenCookie = extractCookies(res);
    const data = await res.json();
    if (!data.success || data.data.role !== 'CITIZEN' || !citizenCookie) {
      throw new Error(`OTP verification failed: ${JSON.stringify(data)}`);
    }
  });

  // 4. Government Login (Tehsildar)
  let officerCookie = '';
  await test('POST /auth/government/login logs in Tehsildar with verified JWT cookie', async () => {
    const res = await fetch(`${BASE_URL}/auth/government/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sanjay.deshmukh@maharashtra.gov.in',
        password: 'Password123!',
      }),
    });
    officerCookie = extractCookies(res);
    const data = await res.json();
    if (!data.success || data.data.role !== 'TEHSILDAR' || !officerCookie) {
      throw new Error(`Officer login failed: ${JSON.stringify(data)}`);
    }
  });

  // 5. Parcel Search
  await test('GET /parcels search returns parcel list from DB', async () => {
    const res = await fetch(`${BASE_URL}/parcels?search=Wagholi`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(`Parcel search failed: ${JSON.stringify(data)}`);
    }
  });

  // 6. Parcel 360° Detail
  await test('GET /parcels/:ulpin/360 returns comprehensive 360 profile from DB', async () => {
    const res = await fetch(`${BASE_URL}/parcels/ULPIN-MH-PUN-000001/360`, {
      headers: {
        Cookie: officerCookie,
      },
    });
    const data = await res.json();
    if (!data.success || !data.data.overview) {
      throw new Error(`Parcel 360 failed: ${JSON.stringify(data)}`);
    }
  });

  // 7. Officer Work Queue
  let caseId = 'MUT-005';
  await test('GET /cases/queue returns jurisdiction-derived officer queue', async () => {
    const res = await fetch(`${BASE_URL}/cases/queue`, {
      headers: {
        Cookie: officerCookie,
      },
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data.items)) {
      throw new Error(`Officer queue failed: ${JSON.stringify(data)}`);
    }
    if (data.data.items.length > 0) {
      caseId = data.data.items[0].id;
    }
  });

  // 8. Case Dossier
  await test('GET /cases/:id/dossier returns statutory checklist and artifacts from DB', async () => {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/dossier`, {
      headers: {
        Cookie: officerCookie,
      },
    });
    const data = await res.json();
    if (!data.success || !data.data.statutoryChecklist) {
      throw new Error(`Case dossier failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. Mutation Creation & State Machine Action
  let newMutationId = '';
  await test('POST /mutations creates new mutation in INITIATED state', async () => {
    const res = await fetch(`${BASE_URL}/mutations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: citizenCookie,
      },
      body: JSON.stringify({
        parcelUlpin: 'ULPIN-MH-PUN-000001',
        type: 'Sale Deed Mutation',
        buyerName: 'Rohan Kadam',
        remarks: 'Verification test application',
      }),
    });
    const data = await res.json();
    if (!data.success || data.data.status !== 'INITIATED') {
      throw new Error(`Mutation creation failed: ${JSON.stringify(data)}`);
    }
    newMutationId = data.data.id;
  });

  // 10. Mutation Invalid State Transition Rejection
  await test('POST /mutations/:id/approve rejects premature approval (state machine guard)', async () => {
    const res = await fetch(`${BASE_URL}/mutations/${newMutationId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: officerCookie,
      },
      body: JSON.stringify({
        remarks: 'Attempting invalid jump directly from INITIATED to APPROVED',
        _mfaToken: 'mock-mfa-token',
      }),
    });
    const data = await res.json();
    // Must fail because INITIATED cannot jump directly to APPROVED!
    if (res.status !== 409 || data.success) {
      throw new Error(`State machine did NOT block invalid transition! Status: ${res.status}`);
    }
  });

  // 11. Admin Blocked from Approval (Statutory Non-Bypass)
  await test('POST /mutations/:id/approve strictly blocks ADMIN role (statutory non-bypass)', async () => {
    // Authenticate as ADMIN
    const adminRes = await fetch(`${BASE_URL}/auth/government/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@landstack.gov.in',
        password: 'Password123!',
      }),
    });
    const adminCookie = extractCookies(adminRes);

    const res = await fetch(`${BASE_URL}/mutations/${newMutationId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        remarks: 'Admin trying to approve without statutory authority',
      }),
    });
    const data = await res.json();
    if (res.status !== 403 || data.success) {
      throw new Error(`Admin role was not blocked from MUTATION_APPROVE! Status: ${res.status}`);
    }
  });

  // 12. Jurisdictions Hierarchy
  await test('GET /jurisdictions returns states, districts, tehsils, villages from DB', async () => {
    const res = await fetch(`${BASE_URL}/jurisdictions`);
    const data = await res.json();
    if (!data.success || !data.data.states || !data.data.districts) {
      throw new Error(`Jurisdictions hierarchy failed: ${JSON.stringify(data)}`);
    }
  });

  // 13. GIS Parcel GeoJSON
  await test('GET /gis/parcels/:ulpin/geojson returns valid GeoJSON Feature from DB', async () => {
    const res = await fetch(`${BASE_URL}/gis/parcels/ULPIN-MH-PUN-000001/geojson`);
    const data = await res.json();
    if (data.type !== 'Feature' || data.geometry?.type !== 'Polygon') {
      throw new Error(`Invalid GeoJSON output: ${JSON.stringify(data)}`);
    }
  });

  // 14. Analytics
  await test('GET /analytics/national returns national overview calculated from DB', async () => {
    const res = await fetch(`${BASE_URL}/analytics/national`);
    const data = await res.json();
    if (!data.success || !data.data.totalParcels) {
      throw new Error(`Analytics national failed: ${JSON.stringify(data)}`);
    }
  });

  console.log(`\n🏁 Test Run Completed: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runTests();
