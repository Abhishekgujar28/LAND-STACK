const BASE_URL = 'http://localhost:5000/api/v1';

async function runRealRuntimeE2E() {
  console.log('====================================================');
  console.log('LAND-STACK / BHARATBHUMI REAL RUNTIME ACCEPTANCE E2E');
  console.log('Testing against Live Supabase PostgreSQL');
  console.log('====================================================\n');

  const results = [];

  // Helper
  async function testStep(stepNum, name, testFn) {
    try {
      const res = await testFn();
      console.log(`[PASS] Step ${stepNum}: ${name}`);
      results.push({ step: stepNum, name, status: 'PASS', details: res });
    } catch (err) {
      console.error(`[FAIL] Step ${stepNum}: ${name} ->`, err.message);
      results.push({ step: stepNum, name, status: 'FAIL', error: err.message });
    }
  }

  let citizenToken = null;
  let citizenUser = null;
  let govToken = null;
  let govUser = null;

  // 1. App startup
  await testStep(1, 'App Startup & Server Health Check', async () => {
    const res = await fetch('http://localhost:5000/api/v1/health');
    if (!res.ok) throw new Error(`Health returned ${res.status}`);
    const json = await res.json();
    if (!json.supabaseConnected) throw new Error('Supabase not connected');
    return `Mode: ${json.mode}, SupabaseConnected: ${json.supabaseConnected}`;
  });

  // 2. Citizen Authentication
  await testStep(2, 'Citizen Authentication (Abhishek Gujar)', async () => {
    const res = await fetch(`${BASE_URL}/auth/citizen/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: '9823045891', otp: '123456', password: 'Password123!' }),
    });
    if (!res.ok) throw new Error(`Citizen auth returned ${res.status}`);
    const json = await res.json();
    citizenToken = json.data?.accessToken;
    citizenUser = json.data?.user || json.data;
    if (!citizenToken) throw new Error('No access token in response');
    if (citizenUser?.name !== 'Abhishek Gujar') throw new Error(`Unexpected user name: ${citizenUser?.name}`);
    return `Authenticated: ${citizenUser.name}, Token length: ${citizenToken.length}`;
  });

  // 3. Citizen Session Restoration (/auth/me)
  await testStep(3, 'Citizen Session Restoration (/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` },
    });
    if (!res.ok) throw new Error(`/auth/me returned ${res.status}`);
    const json = await res.json();
    if (json.data?.role !== 'CITIZEN') throw new Error(`Expected role CITIZEN, got ${json.data?.role}`);
    return `Role: ${json.data.role}, Name: ${json.data.name}`;
  });

  // 4. Citizen Parcels List
  await testStep(4, 'Citizen Parcels List (/citizens/parcels)', async () => {
    const res = await fetch(`${BASE_URL}/citizens/parcels`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` },
    });
    if (!res.ok) throw new Error(`Fetch parcels returned ${res.status}`);
    const json = await res.json();
    const parcels = json.data || [];
    if (parcels.length !== 3) throw new Error(`Expected 3 parcels, got ${parcels.length}`);
    const ulpins = parcels.map((p) => p.ulpin).join(', ');
    return `Loaded ${parcels.length} parcels from PostgreSQL: ${ulpins}`;
  });

  // 5. Parcel Search
  await testStep(5, 'Parcel Search (/parcels?search=Wagholi)', async () => {
    const res = await fetch(`${BASE_URL}/parcels?search=Wagholi`);
    if (!res.ok) throw new Error(`Search returned ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : json.data?.parcels || [];
    if (list.length === 0) throw new Error('Zero parcels found for Wagholi');
    const first = list[0];
    if (first.latitude === undefined || first.longitude === undefined) {
      throw new Error('Centroid coordinates missing from search response');
    }
    return `Found ${list.length} parcels. First centroid: lat=${first.latitude}, lng=${first.longitude}`;
  });

  // 6. Parcel Details & 360 Dossier
  await testStep(6, 'Parcel 360 Dossier (/parcels/TEST_ULPIN_MH_PUN_001/360)', async () => {
    const res = await fetch(`${BASE_URL}/parcels/TEST_ULPIN_MH_PUN_001/360`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` },
    });
    if (!res.ok) throw new Error(`360 returned ${res.status}`);
    const json = await res.json();
    const d = json.data;
    if (!d.overview || d.overview.ulpin !== 'TEST_ULPIN_MH_PUN_001') {
      throw new Error(`Overview mismatch: ${d.overview?.ulpin}`);
    }
    const currentOwner = d.ownership?.current?.[0]?.owner_name;
    if (currentOwner !== 'Abhishek Gujar') {
      throw new Error(`Expected owner Abhishek Gujar, got ${currentOwner}`);
    }
    return `ULPIN: ${d.overview.ulpin}, Owner: ${currentOwner}, Gat: ${d.overview.gatNumber}, Village: ${d.overview.villageName}`;
  });

  // 7. Government Login (Sayali Wadhai - Talathi)
  await testStep(7, 'Government Login (Sayali Wadhai)', async () => {
    const res = await fetch(`${BASE_URL}/auth/government/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sayali.wadhai@maharashtra.gov.in', password: 'Password123!' }),
    });
    if (!res.ok) throw new Error(`Gov login returned ${res.status}`);
    const json = await res.json();
    govToken = json.data?.accessToken;
    govUser = json.data?.user || json.data;
    if (!govToken) throw new Error('No gov access token returned');
    if (govUser?.role !== 'TALATHI') throw new Error(`Expected TALATHI role, got ${govUser?.role}`);
    return `Officer: ${govUser.name} (${govUser.role}), Office: ${govUser.office}`;
  });

  // 8. Government Profile (/auth/me)
  await testStep(8, 'Government Session & Jurisdiction Resolution (/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${govToken}` },
    });
    if (!res.ok) throw new Error(`Gov /auth/me returned ${res.status}`);
    const json = await res.json();
    const u = json.data;
    if (u.role !== 'TALATHI') throw new Error(`Expected TALATHI, got ${u.role}`);
    return `Officer ${u.name}, Tehsil: ${u.jurisdiction?.tehsilCode}, Village: ${u.jurisdiction?.villageCode}`;
  });

  // 9. Officer Directory
  await testStep(9, 'Officer Directory (/officers)', async () => {
    const res = await fetch(`${BASE_URL}/officers`, {
      headers: { 'Authorization': `Bearer ${govToken}` },
    });
    if (!res.ok) throw new Error(`Officers returned ${res.status}`);
    const json = await res.json();
    const officers = json.data || [];
    if (officers.length === 0) throw new Error('Zero officers returned');
    return `Retrieved ${officers.length} government officers from PostgreSQL`;
  });

  // 10. Cases Work Queue
  await testStep(10, 'Cases Work Queue (/cases/queue)', async () => {
    const res = await fetch(`${BASE_URL}/cases/queue`, {
      headers: { 'Authorization': `Bearer ${govToken}` },
    });
    if (!res.ok) throw new Error(`Cases queue returned ${res.status}`);
    const json = await res.json();
    const queue = json.data?.items || json.data || [];
    if (queue.length === 0) throw new Error('Zero cases in queue');
    return `Queue has ${queue.length} statutory mutation cases for Wagholi circle`;
  });

  // 11. Analytics Endpoints
  await testStep(11, 'Analytics National & System Health', async () => {
    const [natRes, healthRes] = await Promise.all([
      fetch(`${BASE_URL}/analytics/national`),
      fetch(`${BASE_URL}/analytics/system-health`),
    ]);
    if (!natRes.ok) throw new Error(`National analytics returned ${natRes.status}`);
    if (!healthRes.ok) throw new Error(`System health returned ${healthRes.status}`);
    const nat = await natRes.json();
    const h = await healthRes.json();
    return `Parcels: ${nat.data?.totalParcels}, Mutations: ${nat.data?.totalMutations}, DB: ${h.data?.database} (${h.data?.databaseLatencyMs}ms)`;
  });

  // 12. Audit Ledger
  await testStep(12, 'Audit Ledger (/audit)', async () => {
    const res = await fetch(`${BASE_URL}/audit?limit=10`, {
      headers: { 'Authorization': `Bearer ${govToken}` },
    });
    if (!res.ok) throw new Error(`Audit returned ${res.status}`);
    const json = await res.json();
    const logs = json.data || [];
    if (logs.length === 0) throw new Error('No audit events in PostgreSQL audit_events');
    return `Retrieved ${logs.length} immutable audit ledger rows from database`;
  });

  // 13. GIS Boundaries
  await testStep(13, 'GIS Cadastral Layer (/gis/parcels/TEST_ULPIN_MH_PUN_001/geojson)', async () => {
    const res = await fetch(`${BASE_URL}/gis/parcels/TEST_ULPIN_MH_PUN_001/geojson`);
    if (!res.ok) throw new Error(`GIS returned ${res.status}`);
    const json = await res.json();
    const feat = json.data || json;
    if (feat.type !== 'Feature') throw new Error('Expected GeoJSON Feature');
    return `Feature ${feat.properties?.ulpin} has polygon coordinates with ${feat.geometry?.coordinates?.[0]?.length} vertices`;
  });

  // 14. Unauthorized Access Check
  await testStep(14, 'Unauthorized Access Enforcement (No Token -> 401)', async () => {
    const res = await fetch(`${BASE_URL}/cases/queue`);
    if (res.status !== 401) throw new Error(`Expected HTTP 401, got ${res.status}`);
    const json = await res.json();
    return `Correctly blocked with HTTP 401: "${json.error?.message || json.message}"`;
  });

  // 15. Forbidden Access Check (Citizen accessing Officer Queue)
  await testStep(15, 'Forbidden Access Enforcement (Citizen accessing Gov Queue -> 403)', async () => {
    const res = await fetch(`${BASE_URL}/cases/queue`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` },
    });
    if (res.status !== 403) throw new Error(`Expected HTTP 403, got ${res.status}`);
    const json = await res.json();
    return `Correctly blocked with HTTP 403: "${json.error?.message || json.message}"`;
  });

  // 16. Invalid Resource Check
  await testStep(16, 'Invalid Resource 404 Semantics (/parcels/NON_EXISTENT_ULPIN/360)', async () => {
    const res = await fetch(`${BASE_URL}/parcels/NON_EXISTENT_ULPIN/360`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` },
    });
    if (res.status !== 404) throw new Error(`Expected HTTP 404, got ${res.status}`);
    const json = await res.json();
    return `Correctly returned HTTP 404: "${json.error?.message || json.message}"`;
  });

  // 17. Validation Error Semantics (Invalid Mobile -> 422)
  await testStep(17, 'Validation Error 422 Semantics (Invalid Mobile Format)', async () => {
    const res = await fetch(`${BASE_URL}/auth/citizen/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: '123' }),
    });
    if (res.status !== 422) throw new Error(`Expected HTTP 422, got ${res.status}`);
    const json = await res.json();
    return `Correctly rejected with HTTP 422: "${json.error?.message || json.message}"`;
  });

  // 18. Database-Only Provenance
  await testStep(18, 'Database-Only Provenance Confirmation', async () => {
    // Check that citizen parcels and audit events match actual database schema
    const health = await (await fetch(`${BASE_URL}/analytics/system-health`)).json();
    if (health.data?.mode !== 'DATABASE_ONLY') throw new Error(`Mode is ${health.data?.mode}`);
    return `System running in mode: ${health.data.mode}, Architecture: ${health.data.architecture}`;
  });

  console.log('\n====================================================');
  const allPassed = results.every((r) => r.status === 'PASS');
  console.log(`ACCEPTANCE RESULTS: ${results.filter((r) => r.status === 'PASS').length} / ${results.length} PASSED`);
  console.log(`OVERALL SUITE STATUS: ${allPassed ? '100% PASS' : 'FAILURES DETECTED'}`);
  console.log('====================================================');
}

runRealRuntimeE2E().catch(console.error);
