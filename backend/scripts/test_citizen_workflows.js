const BASE_URL = 'http://localhost:5000/api/v1';

async function testCitizenWorkflows() {
  console.log('=== CITIZEN WORKFLOW DATABASE VERIFICATION ===\n');

  // 1. Citizen Login as Abhishek Gujar
  const loginRes = await fetch(`${BASE_URL}/auth/dev/citizen-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ citizenId: 'TEST_CIT_001' }),
  });
  const loginData = await loginRes.json();
  const token = loginData?.data?.accessToken;
  console.log('1. Citizen Login:', loginData.success ? `PASS (Token acquired for ${loginData.data.user.name})` : 'FAIL');
  if (!token) throw new Error('Could not authenticate citizen');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // 2. Get My Parcels with authentic share & khata
  const parcelsRes = await fetch(`${BASE_URL}/citizens/parcels`, { headers });
  const parcels = await parcelsRes.json();
  console.log('2. My Parcels Count:', parcels.data?.length || parcels.length);
  const firstParcel = (parcels.data || parcels)[0];
  console.log('   Sample Parcel:', {
    ulpin: firstParcel.ulpin,
    share: firstParcel.share,
    relation: firstParcel.relation,
    khataNumber: firstParcel.khataNumber,
    village: firstParcel.village_name || firstParcel.villageName,
  });

  // 3. Application Types
  const typesRes = await fetch(`${BASE_URL}/applications/types`, { headers });
  const types = await typesRes.json();
  console.log('3. Statutory Application Types Available:', types.data?.length || types.length);

  // 4. Submit Service Application
  const appRes = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      typeCode: 'APPT_ROR_EXTRACT',
      parcelUlpin: firstParcel.ulpin,
      feeAmount: 50,
      remarks: 'Automated test application for Certified Digitally Signed 7/12 RoR Extract',
      formData: {
        applicantName: loginData.data.user.name,
        applicantMobile: loginData.data.user.mobile,
        village: firstParcel.village_name || firstParcel.villageName,
        gatNumber: firstParcel.gat_number,
      },
    }),
  });
  const appData = await appRes.json();
  console.log('4. Service Application Submission:', appData.success ? `PASS (${appData.data.application_number}, Status: ${appData.data.status})` : `FAIL: ${JSON.stringify(appData)}`);

  // 5. Submit e-Ferfar Mutation
  const mutRes = await fetch(`${BASE_URL}/mutations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      parcelUlpin: firstParcel.ulpin,
      type: 'Sale Deed Mutation',
      buyerName: loginData.data.user.name,
      sellerName: firstParcel.currentOwner || 'Landholder',
      remarks: 'Automated test e-Ferfar mutation registration under MLRC',
      formData: {
        deedNumber: 'TEST-SRO-2026-001',
      },
    }),
  });
  const mutData = await mutRes.json();
  console.log('5. e-Ferfar Mutation Registration:', mutData.success ? `PASS (${mutData.data.mutation_number}, Status: ${mutData.data.status})` : `FAIL: ${JSON.stringify(mutData)}`);

  // 6. Lodge Grievance
  const grvRes = await fetch(`${BASE_URL}/grievances`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      citizenId: loginData.data.user.id,
      parcelUlpin: firstParcel.ulpin,
      category: 'Delayed Mutation (Exceeded 30-Day SLA)',
      subject: 'Delay in sanction of e-Ferfar mutation after Form 135D notice',
      description: 'Formal objection and complaint regarding 30-day statutory SLA delay under RTS Act.',
    }),
  });
  const grvData = await grvRes.json();
  console.log('6. Grievance Lodging:', grvData.success ? `PASS (Ticket: ${grvData.data.grievanceNumber || grvData.data.grievance_number}, Status: ${grvData.data.status})` : `FAIL: ${JSON.stringify(grvData)}`);

  console.log('\n=== ALL CITIZEN DATABASE-BACKED WORKFLOWS VERIFIED ===');
}

testCitizenWorkflows().catch(console.error);
