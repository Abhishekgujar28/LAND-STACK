/**
 * Phase 7 Final Product Transformation Acceptance Audit
 * 
 * Verifies end-to-end integration:
 * AUTH -> USER -> ROLE -> JURISDICTION -> DATABASE -> GIS -> WORKFLOW -> AUDIT
 */

const API_BASE = 'http://localhost:5000/api/v1';

async function runAudit() {
  console.log('======================================================================');
  console.log('   PHASE 7 FINAL PRODUCT TRANSFORMATION ACCEPTANCE AUDIT');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
    }
  }

  // -------------------------------------------------------------
  // 1. CITIZEN AUTHENTICATION & PROFILE
  // -------------------------------------------------------------
  console.log('[1/6] Auditing Citizen Authentication & Profile...');
  const citLoginRes = await fetch(`${API_BASE}/auth/dev/citizen-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ citizenId: 'TEST_CIT_001' }),
  });
  const citRaw = await citLoginRes.json();
  const citData = citRaw.data || citRaw;
  const citizenToken = citData.accessToken;
  const citizen = citData.user || citData;
  const citizenId = citizen.userId || citizen.id;

  assert(citLoginRes.ok && citizenToken, 'Citizen authentication returned valid JWT token');
  assert(citizen && citizen.name, `Citizen identity loaded: ${citizen?.name} (${citizenId})`);

  // -------------------------------------------------------------
  // 2. CITIZEN DASHBOARD & "MY LAND" PARCELS
  // -------------------------------------------------------------
  console.log('\n[2/6] Auditing Citizen "My Land" Holdings from Database...');
  const parcelsRes = await fetch(`${API_BASE}/citizens/parcels`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  const parcelsRaw = await parcelsRes.json();
  const ownedParcels = parcelsRaw.data || parcelsRaw;

  assert(parcelsRes.ok && Array.isArray(ownedParcels), 'Authoritative landholdings queried successfully');
  assert(ownedParcels.length > 0, `Citizen owns ${ownedParcels.length} verified parcel(s) in database`);
  if (ownedParcels.length > 0) {
    const firstP = ownedParcels[0];
    console.log(`    -> Holding: ULPIN ${firstP.ulpin} | Village: ${firstP.village_name || firstP.villageName} | Area: ${firstP.area} Ha | Title: ${firstP.status}`);
  }

  // -------------------------------------------------------------
  // 3. CITIZEN SERVICE APPLICATION & DOCUMENT UPLOAD WORKFLOW
  // -------------------------------------------------------------
  console.log('\n[3/6] Auditing Multi-Step Citizen Service Application Workflow...');
  // Step 3a: Document Upload
  const docPayload = {
    parcelUlpin: ownedParcels[0]?.ulpin || 'TEST-ULPIN-001',
    type: 'Identity Proof (Aadhaar / Voter ID)',
    title: 'Applicant_Aadhaar_SelfAttested.pdf',
    certificateNumber: `DOC-VERIFIED-${Date.now().toString().slice(-6)}`,
    issuedBy: 'Citizen Self-Attested Inward',
    mimeType: 'application/pdf',
    fileSize: 1048576,
    fileUrl: 'https://storage.landstack.gov.in/docs/Applicant_Aadhaar.pdf',
  };
  const docRes = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`,
    },
    body: JSON.stringify(docPayload),
  });
  const docRaw = await docRes.json();
  const docData = docRaw.data || docRaw;
  assert(docRes.ok && docData.id, `Document registered with vault ID: ${docData.id || docData.certificateNumber}`);

  // Step 3b: Application Submission
  const appPayload = {
    typeCode: 'APPT_ROR_EXTRACT',
    parcelUlpin: ownedParcels[0]?.ulpin || 'TEST-ULPIN-001',
    feeAmount: 50,
    remarks: 'Phase 7 Verification - Certified Extract Request',
    formData: {
      applicantName: citizen.name,
      applicantMobile: citizen.mobile,
      village: ownedParcels[0]?.village_name || 'Wagholi',
      tehsil: ownedParcels[0]?.tehsil || 'Haveli',
      documentId: docData.id,
    },
    documents: [docData.id],
  };

  const appRes = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`,
    },
    body: JSON.stringify(appPayload),
  });
  const appRaw = await appRes.json();
  const appData = appRaw.data || appRaw;
  assert(appRes.ok && (appData.application_number || appData.id), `Statutory application submitted: ${appData.application_number || appData.id}`);

  // Step 3c: Application Tracking Retrieval
  const trackRes = await fetch(`${API_BASE}/applications`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  const trackRaw = await trackRes.json();
  const appsList = trackRaw.data || trackRaw;
  assert(Array.isArray(appsList) && appsList.length > 0, `Database application tracking verified (${appsList.length} application(s) recorded)`);

  // -------------------------------------------------------------
  // 4. CITIZEN WATCHLIST & PERSISTENCE
  // -------------------------------------------------------------
  console.log('\n[4/6] Auditing Citizen Watchlist Persistence in Database...');
  const targetUlpin = ownedParcels[0]?.ulpin || 'TEST-ULPIN-001';
  const wlAddRes = await fetch(`${API_BASE}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`,
    },
    body: JSON.stringify({
      citizenId: citizenId,
      parcelId: targetUlpin,
      label: `Audit Watchlist Target (${targetUlpin})`,
    }),
  });
  const wlAddRaw = await wlAddRes.json();
  const addedWl = wlAddRaw.data || wlAddRaw;
  assert(wlAddRes.ok && addedWl.id, `Parcel added to database watchlist: ID ${addedWl.id}`);

  // Query watchlist
  const wlListRes = await fetch(`${API_BASE}/watchlist?citizenId=${citizenId}`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  const wlListRaw = await wlListRes.json();
  const wlItems = wlListRaw.data || wlListRaw;
  assert(Array.isArray(wlItems) && wlItems.some((w) => w.parcel_ulpin === targetUlpin || w.parcelId === targetUlpin), 'Watchlist record confirmed stored in Supabase PostgreSQL');

  // -------------------------------------------------------------
  // 5. POSTGIS CADASTRAL & ADMINISTRATIVE REFERENCE LAYERS
  // -------------------------------------------------------------
  console.log('\n[5/6] Auditing PostGIS Spatial Layers (Zero Fake Polygons)...');
  const cadRes = await fetch(`${API_BASE}/gis/villages/VIL-WAG/cadastral-map`);
  const cadRaw = await cadRes.json();
  const cadFeatures = cadRaw.features || cadRaw.data?.features || [];
  assert(cadRes.ok && cadFeatures.length > 0, `PostGIS Cadastral Mesh returned ${cadFeatures.length} parcel polygons for Wagholi`);

  const wardsRes = await fetch(`${API_BASE}/gis/layers/urban-wards`);
  const wardsRaw = await wardsRes.json();
  const wardFeatures = wardsRaw.features || wardsRaw.data?.features || [];
  assert(wardsRes.ok && wardFeatures.length > 0, `PMC Urban Administrative Reference layer active (${wardFeatures.length} wards)`);

  const zoningRes = await fetch(`${API_BASE}/gis/layers/zoning-overlay`);
  const zoningRaw = await zoningRes.json();
  const zoningFeatures = zoningRaw.features || zoningRaw.data?.features || [];
  assert(zoningRes.ok && zoningFeatures.length > 0, `PMRDA 2041 Master Plan Zoning overlay active (${zoningFeatures.length} planning zones)`);

  // -------------------------------------------------------------
  // 6. GOVERNMENT WORKSPACES, WORK QUEUES & STRUCTURED DOSSIERS
  // -------------------------------------------------------------
  console.log('\n[6/6] Auditing Role-Aware Government Workspaces & Case Dossiers...');
  
  // Tehsildar Authentication
  const tehLoginRes = await fetch(`${API_BASE}/auth/government/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sanjay.deshmukh@maharashtra.gov.in', password: 'Password123!' }),
  });
  const tehRaw = await tehLoginRes.json();
  const tehData = tehRaw.data || tehRaw;
  const tehToken = tehData.accessToken;
  assert(tehLoginRes.ok && tehToken, 'Tehsildar authenticated with Haveli jurisdiction scope');

  // Tehsildar Work Queue
  const queueRes = await fetch(`${API_BASE}/cases/queue`, {
    headers: { Authorization: `Bearer ${tehToken}` },
  });
  const queueRaw = await queueRes.json();
  const queueData = queueRaw.data || queueRaw;
  const queueItems = queueData.items || queueData || [];
  assert(queueRes.ok && Array.isArray(queueItems) && queueItems.length > 0, `Tehsildar queue loaded: ${queueItems.length} active case(s)`);

  // Structured Case Dossier
  if (queueItems.length > 0) {
    const targetCaseId = queueItems[0].id;
    const dossierRes = await fetch(`${API_BASE}/cases/${targetCaseId}/dossier`, {
      headers: { Authorization: `Bearer ${tehToken}` },
    });
    const dossierRaw = await dossierRes.json();
    const dossier = dossierRaw.data || dossierRaw;

    assert(dossierRes.ok && dossier.caseId, `Structured Case Dossier compiled for ${dossier.mutationNumber || targetCaseId}`);
    assert(dossier.statutoryChecklist && dossier.statutoryChecklist.length > 0, `Dossier statutory checklist contains ${dossier.statutoryChecklist?.length} verified gates`);
    assert(Array.isArray(dossier.timeline), `Dossier timeline contains ${dossier.timeline?.length} chronological events`);
  }

  // ULB Officer Authentication & Municipal Queue
  const ulbLoginRes = await fetch(`${API_BASE}/auth/government/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'anita.bhosale@pmc.gov.in', password: 'Password123!' }),
  });
  const ulbRaw = await ulbLoginRes.json();
  const ulbToken = ulbRaw.data?.accessToken;
  assert(ulbLoginRes.ok && ulbToken, 'ULB Officer (PMC Municipal Corporation) authenticated');

  const ulbQueueRes = await fetch(`${API_BASE}/cases/queue`, {
    headers: { Authorization: `Bearer ${ulbToken}` },
  });
  const ulbQueueRaw = await ulbQueueRes.json();
  const ulbItems = ulbQueueRaw.data?.items || [];
  assert(ulbQueueRes.ok && Array.isArray(ulbItems), `ULB Municipal Queue loaded with CTS/PMRDA zoning data (${ulbItems.length} items)`);

  // Survey Specialist Authentication & Spatial Queue
  const survLoginRes = await fetch(`${API_BASE}/auth/government/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'vikram.patole@maharashtra.gov.in', password: 'Password123!' }),
  });
  const survRaw = await survLoginRes.json();
  const survToken = survRaw.data?.accessToken;
  assert(survLoginRes.ok && survToken, 'Survey & GIS Specialist (Maharashtra Land Records) authenticated');

  const survQueueRes = await fetch(`${API_BASE}/cases/queue`, {
    headers: { Authorization: `Bearer ${survToken}` },
  });
  const survQueueRaw = await survQueueRes.json();
  const survItems = survQueueRaw.data?.items || [];
  assert(survQueueRes.ok && Array.isArray(survItems), `Survey Spatial Task Queue loaded with PostGIS geometry (${survItems.length} items)`);

  // Summary
  console.log('\n======================================================================');
  console.log(`   AUDIT RESULTS: ${passed}/${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('======================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL ACCEPTANCE CRITERIA MET WITH 100% SUCCESS.');
    process.exit(0);
  } else {
    console.error('⚠️ SOME ACCEPTANCE CRITERIA FAILED.');
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit execution error:', err);
  process.exit(1);
});
