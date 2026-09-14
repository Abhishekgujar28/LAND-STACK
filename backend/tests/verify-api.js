/**
 * Land Stack Backend — API Verification Test Suite
 * 
 * Verifies core workflows:
 * 1. Health check & version
 * 2. Citizen OTP request & verify
 * 3. Government officer login & context switch
 * 4. Parcel 360° aggregation
 * 5. 12-state mutation creation & state machine transition
 * 6. Work queues & statutory case dossiers
 * 7. Jurisdictions & Analytics
 * 8. GIS spatial GeoJSON
 */

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting LAND-STACK Backend Verification...\n');
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
  await test('GET /health returns healthy status', async () => {
    const res = await fetch('http://localhost:5000/health');
    const data = await res.json();
    if (data.status !== 'healthy' || data.version !== '2.0.0') {
      throw new Error(`Unexpected health payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. Application Types
  await test('GET /applications/types returns statutory services', async () => {
    const res = await fetch(`${BASE_URL}/applications/types`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Failed to get application types: ${JSON.stringify(data)}`);
    }
  });

  // 3. Citizen OTP Auth
  let citizenCookie = '';
  await test('POST /auth/citizen/request-otp generates OTP', async () => {
    const res = await fetch(`${BASE_URL}/auth/citizen/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: '+919876543210' }),
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
      body: JSON.stringify({ mobile: '+919876543210', otp: '123456' }),
    });
    const rawCookies = res.headers.get('set-cookie');
    const data = await res.json();
    if (!data.success || data.data.role !== 'CITIZEN') {
      throw new Error(`OTP verification failed: ${JSON.stringify(data)}`);
    }
    if (rawCookies) {
      citizenCookie = rawCookies.split(';')[0];
    }
  });

  // 4. Government Login (Tahsildar)
  let officerCookie = '';
  await test('POST /auth/government/login logs in Tahsildar with assignments', async () => {
    const res = await fetch(`${BASE_URL}/auth/government/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tahsildar.haveli@mahabhumi.gov.in',
        password: 'Password123!',
      }),
    });
    const rawCookies = res.headers.get('set-cookie');
    const data = await res.json();
    if (!data.success || data.data.role !== 'TEHSILDAR') {
      throw new Error(`Officer login failed: ${JSON.stringify(data)}`);
    }
    if (rawCookies) {
      officerCookie = rawCookies.split(';')[0];
    }
  });

  // 5. Parcel Search
  await test('GET /parcels search returns parcel list', async () => {
    const res = await fetch(`${BASE_URL}/parcels?search=Wagholi`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(`Parcel search failed: ${JSON.stringify(data)}`);
    }
  });

  // 6. Parcel 360° Detail
  await test('GET /parcels/:ulpin/360 returns comprehensive 360 profile', async () => {
    const res = await fetch(`${BASE_URL}/parcels/ULPIN-MH-PUN-000001/360`, {
      headers: {
        Cookie: officerCookie,
        'X-Mock-User-Id': 'off-tahsildar-01',
        'X-Mock-Role': 'TEHSILDAR',
      },
    });
    const data = await res.json();
    if (!data.success || !data.data.overview || !data.data.valuation) {
      throw new Error(`Parcel 360 failed: ${JSON.stringify(data)}`);
    }
  });

  // 7. Officer Work Queue
  await test('GET /cases/queue returns jurisdiction-derived officer queue', async () => {
    const res = await fetch(`${BASE_URL}/cases/queue`, {
      headers: {
        Cookie: officerCookie,
        'X-Mock-User-Id': 'off-tahsildar-01',
        'X-Mock-Role': 'TEHSILDAR',
        'X-Mock-User-Type': 'GOVERNMENT',
        'X-Mock-Tehsil': 'TEH-HAV',
      },
    });
    const data = await res.json();
    if (!data.success || !data.data.items || !data.data.metrics) {
      throw new Error(`Officer queue failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Case Dossier
  await test('GET /cases/:id/dossier returns statutory checklist and artifacts', async () => {
    const res = await fetch(`${BASE_URL}/cases/MUT-PU-HVL-2026-00456/dossier`, {
      headers: {
        Cookie: officerCookie,
        'X-Mock-User-Id': 'off-tahsildar-01',
        'X-Mock-Role': 'TEHSILDAR',
        'X-Mock-User-Type': 'GOVERNMENT',
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
        'X-Mock-User-Id': 'c1',
        'X-Mock-Role': 'CITIZEN',
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
        'X-Mock-User-Id': 'off-tahsildar-01',
        'X-Mock-Role': 'TEHSILDAR',
        'X-Mock-User-Type': 'GOVERNMENT',
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

  // 11. Admin Blocked from Approval
  await test('POST /mutations/:id/approve strictly blocks ADMIN role', async () => {
    const res = await fetch(`${BASE_URL}/mutations/${newMutationId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Mock-User-Id': 'off-admin-01',
        'X-Mock-Role': 'ADMIN',
        'X-Mock-User-Type': 'GOVERNMENT',
      },
      body: JSON.stringify({
        remarks: 'Admin trying to approve',
        _mfaToken: 'mock-mfa-token',
      }),
    });
    const data = await res.json();
    if (res.status !== 403 || data.success) {
      throw new Error(`Admin role was not blocked from MUTATION_APPROVE! Status: ${res.status}`);
    }
  });

  // 12. Jurisdictions Hierarchy
  await test('GET /jurisdictions returns states, districts, tehsils, villages', async () => {
    const res = await fetch(`${BASE_URL}/jurisdictions`);
    const data = await res.json();
    if (!data.success || !data.data.states || !data.data.districts) {
      throw new Error(`Jurisdictions hierarchy failed: ${JSON.stringify(data)}`);
    }
  });

  // 13. GIS Parcel GeoJSON
  await test('GET /gis/parcels/:ulpin/geojson returns valid GeoJSON Feature', async () => {
    const res = await fetch(`${BASE_URL}/gis/parcels/ULPIN-MH-PUN-000001/geojson`);
    const data = await res.json();
    if (data.type !== 'Feature' || data.geometry?.type !== 'Polygon') {
      throw new Error(`Invalid GeoJSON output: ${JSON.stringify(data)}`);
    }
  });

  // 14. Analytics
  await test('GET /analytics/national returns national overview', async () => {
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
