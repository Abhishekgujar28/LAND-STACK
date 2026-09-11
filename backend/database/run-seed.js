import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.error('❌ Supabase credentials not found or incomplete in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

function loadJson(relPath) {
  const p = path.resolve(__dirname, '../src/data/json', relPath);
  if (fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return [];
}

async function seedTable(tableName, data, transformFn) {
  if (!data || data.length === 0) {
    console.log(`⏩ Skipping ${tableName} (no data)`);
    return;
  }
  const transformed = transformFn ? data.map(transformFn) : data;
  console.log(`⏳ Seeding ${transformed.length} records into ${tableName}...`);

  const chunkSize = 50;
  for (let i = 0; i < transformed.length; i += chunkSize) {
    const chunk = transformed.slice(i, i + chunkSize);
    const { error } = await supabase.from(tableName).upsert(chunk);
    if (error) {
      console.warn(`⚠️ Warning inserting into ${tableName}:`, error.message);
    }
  }
  console.log(`✅ ${tableName} seeded successfully.`);
}

async function run() {
  console.log(`🚀 Starting database seeding to: ${supabaseUrl}`);

  // 1. Jurisdictions
  await seedTable('states', loadJson('jurisdictions/states.json'), s => ({
    code: s.code,
    name: s.name,
    local_name: s.localName,
  }));

  await seedTable('districts', loadJson('jurisdictions/districts.json'), d => ({
    code: d.code,
    state_code: d.stateCode,
    name: d.name,
    local_name: d.localName,
  }));

  await seedTable('tehsils', loadJson('jurisdictions/tehsils.json'), t => ({
    code: t.code,
    district_code: t.districtCode,
    name: t.name,
    local_name: t.localName,
  }));

  await seedTable('villages', loadJson('jurisdictions/villages.json'), v => ({
    code: v.code,
    tehsil_code: v.tehsilCode,
    name: v.name,
    local_name: v.localName,
    pin_code: v.pinCode || v.pincode,
  }));

  // 2. Departments & Roles
  await seedTable('departments', loadJson('departments/departments.json'), d => ({
    code: d.id || d.code,
    name: d.name,
    local_name: d.localName,
    description: d.description,
  }));

  await seedTable('government_roles', loadJson('users/governmentRoles.json'), r => ({
    role: r.role,
    name: r.name || r.title,
    department_code: (r.departmentCode || r.department || 'DEPT-REV').slice(0, 20),
    level: r.level || 'State',
    permissions: r.permissions || [],
  }));

  // 3. Citizens (all registered IDs)
  const citizensRaw = loadJson('users/citizens.json');
  // Also collect any owner IDs from ownership.json to satisfy foreign key constraints
  const ownershipRaw = loadJson('parcels/ownership.json');
  const existingCitizenIds = new Set(citizensRaw.map(c => c.id));

  ownershipRaw.forEach(o => {
    if (o.ownerId && !existingCitizenIds.has(o.ownerId)) {
      citizensRaw.push({
        id: o.ownerId,
        name: o.ownerName || 'Land Owner',
        localName: o.ownerName,
        stateCode: 'MH',
        mobile: `+91 98000 ${Math.floor(10000 + Math.random() * 90000)}`,
        email: `${o.ownerId.toLowerCase()}@example.com`,
        aadhaarHash: 'XXXX-XXXX-9999',
        pan: 'ABCDE1234F',
        address: 'Maharashtra, India',
        kycVerified: true,
        registeredAt: new Date().toISOString(),
      });
      existingCitizenIds.add(o.ownerId);
    }
  });

  await seedTable('citizens', citizensRaw, c => ({
    id: c.id,
    name: c.name,
    local_name: c.localName,
    state_code: c.stateCode || 'MH',
    mobile: c.mobile,
    email: c.email,
    aadhaar_hash: c.aadhaarHash || c.aadhaar,
    pan: c.pan,
    address: c.address,
    kyc_verified: c.kycVerified ?? true,
    registered_at: c.registeredAt || new Date().toISOString(),
  }));

  // Map officer roles accurately
  await seedTable('government_users', loadJson('users/governmentUsers.json'), g => ({
    id: g.id,
    name: g.name,
    local_name: g.localName,
    role: g.role === 'SYS_ADMIN' ? 'ADMIN' : g.role,
    department_code: (g.departmentCode || g.department || 'DEPT-REV').slice(0, 20),
    designation: g.designation,
    state_code: g.stateCode,
    district_code: g.districtCode,
    tehsil_code: g.tehsilCode,
    village_code: g.villageCode,
    email: g.email,
    mobile: g.mobile,
    office: g.office,
    active: g.active ?? true,
  }));

  // 4. Parcels
  await seedTable('parcels', loadJson('parcels/parcels.json'), p => ({
    ulpin: p.ulpin,
    survey_number: p.surveyNumber,
    gat_number: p.gatNumber,
    khasra_number: p.khasraNumber,
    cts_number: p.ctsNumber,
    state_code: p.stateCode,
    district_code: p.districtCode,
    tehsil_code: p.tehsilCode,
    village_code: p.villageCode,
    village_name: p.villageName,
    area: p.area,
    area_unit: p.areaUnit || 'Hectare',
    land_use: p.landUse,
    classification: p.classification,
    latitude: p.latitude,
    longitude: p.longitude,
    status: p.status || 'CLEAR',
    source: p.source,
    source_system: p.sourceSystem,
    last_updated: p.lastUpdated || new Date().toISOString(),
  }));

  // 5. Ownership & 360 attributes
  await seedTable('ownership_records', ownershipRaw, o => ({
    id: o.id,
    parcel_ulpin: o.parcelId || o.parcelUlpin,
    owner_id: o.ownerId,
    owner_name: o.ownerName,
    khata_number: o.khataNumber,
    relation: o.relation,
    share: o.share,
    aadhaar_status: o.aadhaarStatus,
  }));

  await seedTable('encumbrances', loadJson('parcels/encumbrances.json'), e => ({
    id: e.id,
    parcel_ulpin: e.parcelId || e.parcelUlpin,
    type: e.type || 'Bank Charge / Mortgage',
    bank_name: e.bankName || e.institution,
    amount: typeof e.amount === 'number' ? e.amount : parseFloat(String(e.chargeAmount || e.amount || '0').replace(/,/g, '')),
    registered_date: e.registrationDate || e.registeredDate || e.startDate,
    status: e.status || 'ACTIVE',
    discharge_date: e.dischargeDate,
    remarks: e.remarks || e.branch,
  }));

  await seedTable('restrictions', loadJson('parcels/restrictions.json'), r => ({
    id: r.id,
    parcel_ulpin: r.parcelId || r.parcelUlpin,
    type: r.type || 'Statutory Restriction',
    title: r.title || r.type || 'Land Restriction',
    authority: r.authority,
    notification_number: r.notificationNumber || r.orderNumber,
    notification_date: r.notificationDate || r.orderDate,
    description: r.description || r.reason,
    status: r.status || 'ACTIVE',
  }));

  await seedTable('zoning', loadJson('parcels/zoning.json'), z => ({
    id: z.id,
    parcel_ulpin: z.parcelId || z.parcelUlpin,
    master_plan: z.masterPlan || z.sanctionedDP,
    current_zone: z.currentZone || z.zone || z.zoneCategory,
    permissible_uses: z.permissibleUses || [z.permissibility].filter(Boolean),
    max_fsi: z.maxFsi || z.fsi,
    road_width_meters: z.roadWidthMeters || z.roadWidth,
    authority: z.authority,
  }));

  await seedTable('tax_records', loadJson('parcels/taxRecords.json'), t => ({
    id: t.id,
    parcel_ulpin: t.parcelId || t.parcelUlpin,
    assessment_year: t.assessmentYear || t.financialYear,
    annual_tax: t.annualTax || t.annualAssessment,
    pending_dues: t.pendingDues || t.outstandingDues || 0,
    last_paid_date: t.lastPaidDate,
    receipt_number: t.receiptNumber,
    payment_status: t.paymentStatus || t.status || 'PAID',
  }));

  await seedTable('court_cases', loadJson('parcels/courtCases.json'), c => ({
    id: c.id,
    parcel_ulpin: c.parcelId || c.parcelUlpin,
    case_number: c.caseNumber,
    court_name: c.courtName || c.court,
    case_type: c.caseType,
    petitioner: c.petitioner,
    respondent: c.respondent,
    filing_date: c.filingDate,
    next_hearing_date: c.nextHearingDate,
    status: c.status,
    stay_granted: c.stayGranted ?? false,
    order_summary: c.orderSummary || c.summary,
  }));

  await seedTable('parcel_documents', loadJson('parcels/parcelDocuments.json'), d => ({
    id: d.id,
    parcel_ulpin: d.parcelId || d.parcelUlpin,
    title: d.title || d.documentName,
    type: d.type || d.documentType,
    file_name: d.fileName || `${d.title || 'doc'}.pdf`,
    file_size: d.fileSize,
    issue_date: d.issueDate || d.issuedDate || d.uploadDate,
    authority: d.authority || d.issuedBy,
    verification_hash: d.verificationHash || d.hash || d.barcode,
  }));

  // 6. Mutations & Workflows
  await seedTable('mutations', loadJson('mutations/mutations.json'), m => ({
    id: m.id,
    mutation_number: m.mutationNumber,
    parcel_ulpin: m.parcelId || m.parcelUlpin,
    type: m.type || m.mutationType || 'Sale Deed Mutation',
    applicant_id: m.applicantId,
    applicant_name: m.applicantName || m.initiatedBy || 'Applicant',
    buyer_name: m.buyerName,
    seller_name: m.sellerName,
    status: m.status,
    applied_date: m.appliedDate || m.filingDate || m.applicationDate,
    sla_days: m.slaDays || 30,
    sla_deadline: m.slaDeadline,
    current_step: m.currentStep || 1,
    total_steps: m.totalSteps || 6,
    remarks: m.remarks,
    tehsil_code: m.tehsilCode,
    village_code: m.villageCode,
  }));

  const timelineData = loadJson('mutations/mutationTimeline.json');
  const stepsList = [];
  timelineData.forEach(mt => {
    (mt.steps || []).forEach((s, idx) => {
      stepsList.push({
        id: `STEP-${mt.mutationId}-${s.step || idx + 1}`,
        mutation_id: mt.mutationId,
        step_number: s.step || idx + 1,
        title: s.title,
        description: s.description,
        completed: s.completed ?? false,
        active: s.active ?? false,
        completed_at: s.completedAt,
        officer_name: s.officerName || s.actor,
        officer_role: s.officerRole || s.role,
      });
    });
  });
  await seedTable('mutation_timeline', stepsList);

  await seedTable('sro_audits', loadJson('mutations/sroAudits.json'), s => ({
    id: s.id,
    deed_number: s.deedNumber || `DEED-${s.id}`,
    parcel_ulpin: s.ulpin || s.parcelId || 'ULPIN-MH-PUN-000001',
    sro_code: s.sroCode || s.officeCode || 'SRO-HAV-05',
    registration_date: new Date().toISOString(),
    buyer_name: s.buyerName || s.ownerName,
    seller_name: s.sellerName,
    valuation_amount: typeof s.valuationAmount === 'number' ? s.valuationAmount : 5000000,
    stamp_duty_paid: typeof s.stampDutyPaid === 'number' ? s.stampDutyPaid : 350000,
    status: s.status || 'CLEARED_FOR_REGISTRATION',
    flags: s.flags || [],
  }));

  // 7. Applications & Types
  const appTypes = [
    { code: 'EXTRACT_712', title: 'Digitally Signed Form 7/12 Extract', category: 'Extracts & Certificates', description: 'Digitally signed 7/12 land record extract with QR verification', fee: 15, processing_time: 'Instant' },
    { code: 'EXTRACT_8A', title: 'Form 8A Khate Pustika Extract', category: 'Extracts & Certificates', description: 'Consolidated land holding statement per khata', fee: 15, processing_time: 'Instant' },
    { code: 'MUTATION', title: 'e-Ferfar Statutory Mutation', category: 'Mutation Services', description: 'Online mutation filing for sale deed, succession, partition', fee: 100, processing_time: '30 Days' },
    { code: 'PROPERTY_CARD', title: 'Urban Property Card (Nagar Bhumapan)', category: 'Extracts & Certificates', description: 'Urban land record extract issued by City Survey Officer', fee: 20, processing_time: '1 Day' },
    { code: 'NA_NOC', title: 'Non-Agricultural (NA) Conversion NOC', category: 'Zoning & Conversion', description: 'Collector NOC for agricultural to residential/commercial conversion', fee: 500, processing_time: '45 Days' },
    { code: 'MOJANI', title: 'Cadastral Boundary Measurement (Mojani)', category: 'Survey & Boundaries', description: 'Official DILR cadastral field demarcation and measurement', fee: 1200, processing_time: '21 Days' },
  ];
  await seedTable('application_types', appTypes);

  await seedTable('applications', loadJson('applications/applications.json'), a => ({
    id: a.id,
    application_number: a.applicationNumber || `APP-2026-${a.id}`,
    type_code: a.type || 'EXTRACT_712',
    citizen_id: a.citizenId,
    parcel_ulpin: a.parcelId || a.parcelUlpin,
    status: a.status || 'APPROVED',
    submission_date: a.appliedDate ? new Date(a.appliedDate).toISOString() : new Date().toISOString(),
    fee_amount: a.feeAmount || a.fee || 15,
    payment_status: a.paymentStatus || 'PAID',
    tracking_history: a.trackingHistory || [],
    form_data: a.formData || {},
  }));

  // 8. Documents, Grievances, Notifications, Watchlist
  await seedTable('documents', loadJson('documents/documents.json'), d => ({
    id: d.id,
    user_id: d.userId || d.citizenId,
    parcel_ulpin: d.parcelId || d.parcelUlpin,
    title: d.title || d.name,
    type: d.type,
    certificate_number: d.certificateNumber || d.docNumber,
    issued_by: d.issuedBy || d.authority,
    issue_date: d.issueDate,
    file_url: d.fileUrl || d.url,
    verification_hash: d.verificationHash || d.hash,
    valid_until: d.validUntil,
  }));

  await seedTable('grievances', loadJson('grievances/grievances.json'), g => ({
    id: g.id,
    grievance_number: g.grievanceNumber || `GRV-2026-${g.id}`,
    citizen_id: g.citizenId,
    parcel_ulpin: g.parcelId || g.parcelUlpin,
    category: g.category,
    subject: g.subject,
    description: g.description || g.officerRemarks || 'Grievance submitted by citizen',
    status: g.status,
    filed_date: g.createdDate ? new Date(g.createdDate).toISOString() : new Date().toISOString(),
    department_code: 'DEPT-REV',
    resolution_notes: g.officerRemarks,
    resolved_at: g.resolutionDate ? new Date(g.resolutionDate).toISOString() : null,
  }));

  await seedTable('notifications', loadJson('notifications/notifications.json'), n => ({
    id: n.id,
    user_id: n.userId,
    title: n.title,
    message: n.message,
    type: n.type,
    is_read: n.read ?? n.is_read ?? false,
    action_link: n.actionLink || n.link,
    created_at: n.createdAt || n.timestamp,
  }));

  await seedTable('watchlist', loadJson('watchlist/watchlist.json'), w => ({
    id: w.id,
    citizen_id: w.citizenId || w.userId,
    parcel_ulpin: w.ulpin || w.parcelId,
    label: w.label || `${w.villageName || 'Wagholi'} Parcel`,
    notify_mutations: w.alertOnMutation ?? true,
    notify_encumbrances: true,
    notify_court_cases: true,
    created_at: w.addedDate ? new Date(w.addedDate).toISOString() : new Date().toISOString(),
  }));

  // 9. Public Content
  await seedTable('news', loadJson('news/news.json'), n => ({
    id: n.id,
    title: n.title,
    category: n.category,
    summary: n.summary,
    content: n.content,
    published_date: n.publishedDate || n.date,
    source: n.source,
    tag: n.tag,
  }));

  await seedTable('notices', loadJson('notices/notices.json'), n => ({
    id: n.id,
    notice_number: n.noticeNumber || `NOT-2026-${n.id}`,
    title: n.title,
    parcel_ulpin: n.parcelId || n.parcelUlpin,
    village_code: n.villageCode,
    issue_date: n.issueDate || n.date,
    expiry_date: n.expiryDate,
    description: n.description || n.content,
    authority: n.authority || n.department,
  }));

  await seedTable('government_services', loadJson('services/governmentServices.json'), s => ({
    id: s.id,
    title: s.title || s.name,
    category: s.category,
    description: s.description,
    icon: s.icon,
    route: s.route || s.path,
    eligibility: s.eligibility,
    fee: s.fee,
    processing_time: s.processingTime || s.sla,
  }));

  console.log(`\n🎉 All tables seeded 100% cleanly into Supabase!`);
}

run().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
