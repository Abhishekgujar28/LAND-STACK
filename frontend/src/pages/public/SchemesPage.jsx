import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Search,
  ExternalLink,
  Shield,
  Layers,
  MapPin,
  FileText,
  Building2,
  Landmark,
  Scale,
  Compass,
  CheckCircle2,
  Globe,
  Sparkles,
  ArrowRight,
  Filter,
  Download,
  BookOpen,
  Plane,
  Gavel,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import './SchemesPage.css';

/**
 * SchemesPage - National & State Land Schemes, Legal Reforms & Portals
 * GIGW 3.0 compliant, comprehensive repository of all Central & State government schemes,
 * land reform laws, and official portal directories.
 */
export const SchemesPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  // 1. National Government Schemes
  const nationalSchemes = [
    {
      id: 'SCHEME-001',
      name: 'DILRMP – Digital India Land Records Modernization Programme',
      ministry: 'Dept. of Land Resources, Ministry of Rural Development',
      funding: '100% Central Sector Scheme (Centrally Funded since 2016)',
      icon: Layers,
      themeColor: 'forest',
      summary:
        'Flagship central programme to build a transparent, integrated, and easily accessible land records system. Computerizes Records of Rights (RoRs), digitizes cadastral maps with GIS, synchronizes land records with Sub-Registrar registration offices, and minimizes land litigation disputes.',
      highlights: [
        '100% Centrally Funded',
        'Cadastral Map Digitization',
        'SRO-Revenue Real-time Sync',
        'Dispute Reduction',
      ],
      portalUrl: 'https://dolr.gov.in/en/programmes-schemes/dilrmp-2/',
      status: 'Active / Nationwide Rollout',
    },
    {
      id: 'SCHEME-002',
      name: 'SVAMITVA – Survey of Villages Abadi and Mapping with Improvised Technology in Village Areas',
      ministry: 'Ministry of Panchayati Raj (in collaboration with Survey of India & State Revenue Depts)',
      funding: 'Central Sector Scheme (Launched 2020)',
      icon: Plane,
      themeColor: 'saffron',
      summary:
        'Uses drone-based aerial LiDAR surveys to map rural inhabited (Abadi) land parcels. Issues legally recognized Property Cards / Title Deeds to village households, empowering rural citizens to leverage property for bank loans, collateral, and formal credit.',
      highlights: [
        'High-Resolution Drone Survey',
        'Rural Property Cards',
        'Bank Credit & Collateral Enablement',
        'Gram Panchayat Planning',
      ],
      portalUrl: 'https://svamitva.nic.in',
      status: 'Active / Nationwide',
    },
    {
      id: 'SCHEME-003',
      name: 'ULPIN / Bhu-Aadhaar – Unique Land Parcel Identification Number',
      ministry: 'Department of Land Resources (DoLR), Ministry of Rural Development',
      funding: 'DILRMP Core Component',
      icon: MapPin,
      themeColor: 'forest',
      summary:
        'Assigns an authoritative 14-digit alphanumeric geo-tagged identity number to every land parcel in India based on precise longitude and latitude coordinates of parcel vertices. Prevents boundary fraud and creates a single source of truth.',
      highlights: [
        '14-Digit Standardized Geo-ID',
        'GIS Coordinate Boundary Seeding',
        'Interoperability Across Banking & Courts',
        'Eliminates Double Ownership',
      ],
      portalUrl: 'https://dolr.gov.in',
      status: 'Mandatory / 28+ States Live',
    },
    {
      id: 'SCHEME-004',
      name: 'National Land Records Modernization Programme (NLRMP)',
      ministry: 'Department of Land Resources (DoLR)',
      funding: 'Predecessor Centrally Sponsored Scheme (2008)',
      icon: BookOpen,
      themeColor: 'slate',
      summary:
        'Historical pioneer programme merging Computerisation of Land Records (CLR) and Strengthening of Revenue Administration & Updating of Land Records (SRA&ULR). Formed the foundational architecture now subsumed into DILRMP.',
      highlights: [
        'Foundational 2008 Architecture',
        'Merged CLR & SRA&ULR',
        'Evolutionary Benchmark',
        'Subsumed into DILRMP',
      ],
      portalUrl: 'https://dolr.gov.in',
      status: 'Subsumed into DILRMP',
    },
    {
      id: 'SCHEME-005',
      name: 'Desert Development Programme (DDP)',
      ministry: 'Department of Land Resources (DoLR), Ministry of Rural Development',
      funding: 'Central Scheme (75:25 Funding Pattern)',
      icon: Compass,
      themeColor: 'saffron',
      summary:
        'Specialized programme aimed at restoring the ecological balance and natural resource base of identified hot and cold desert areas. Covers 235 blocks across 40 districts in 7 states, mitigating drought impact and improving land productivity.',
      highlights: [
        '235 Blocks across 7 States',
        'Soil & Water Conservation',
        'Ecological Balance Restoration',
        'Combating Desertification',
      ],
      portalUrl: 'https://dolr.gov.in',
      status: 'Active Implementation',
    },
    {
      id: 'SCHEME-006',
      name: 'Watershed Development Schemes (e.g., REWARD Project)',
      ministry: 'Department of Land Resources (DoLR) with World Bank Assistance',
      funding: 'Central Scheme + World Bank Credit',
      icon: Globe,
      themeColor: 'forest',
      summary:
        'Rejuvenating Watersheds for Agricultural Resilience through Innovative Development (REWARD) and integrated watershed management. Rehabilitates degraded and rainfed wasteland areas to enhance soil moisture, crop yields, and climate resilience.',
      highlights: [
        'World Bank Assisted',
        'Degraded Wasteland Reclamation',
        'Climate Resilience for Farmers',
        'GIS-based Hydrological Planning',
      ],
      portalUrl: 'https://dolr.gov.in',
      status: 'Active / Multi-State',
    },
    {
      id: 'SCHEME-007',
      name: 'RFCTLARR Act, 2013 & National Rehabilitation and Resettlement (R&R) Policy',
      ministry: 'Department of Land Resources (DoLR)',
      funding: 'Statutory Central Framework',
      icon: Scale,
      themeColor: 'forest',
      summary:
        'The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 governs fair compensation (up to 4x in rural areas, 2x in urban), mandatory Social Impact Assessments (SIA), and rehabilitation for project-affected families, replacing the colonial 1894 Act.',
      highlights: [
        'Replaced 1894 Colonial Act',
        'Up to 4x Market Value in Rural Areas',
        'Mandatory Social Impact Assessment',
        'Statutory R&R Entitlements',
      ],
      portalUrl: 'https://dolr.gov.in',
      status: 'Statutory Central Act',
    },
    {
      id: 'SCHEME-008',
      name: 'Bhoomi Samman National Award',
      ministry: 'Department of Land Resources (DoLR)',
      funding: 'Presidential & National Recognition',
      icon: Award,
      themeColor: 'saffron',
      summary:
        'Prestigious national recognition conferred by the Hon’ble President of India to District Collectors and State PMUs achieving "Platinum Grading" (100% target fulfillment) across DILRMP core components: RoR computerization, cadastral mapping, and SRO integration.',
      highlights: [
        'Conferred by President of India',
        'Platinum Grading Certification',
        '100% Milestone Benchmark',
        'District Collector Recognition',
      ],
      portalUrl: 'https://dolr.gov.in',
      status: 'Annual National Award',
    },
    {
      id: 'SCHEME-009',
      name: 'Forest Rights Act (FRA) Land Rights Implementation Support',
      ministry: 'Ministry of Tribal Affairs / Ministry of Environment, Forest & Climate Change',
      funding: 'Central Statutory Implementation',
      icon: ShieldCheck,
      themeColor: 'forest',
      summary:
        'Recognizes and vests individual forest rights (IFR) and community forest resource (CFR) rights for Scheduled Tribes and Other Traditional Forest Dwellers (OTFD), integrating title records with state cadastral maps.',
      highlights: [
        'Individual & Community Titles (IFR/CFR)',
        'Tribal Land Tenure Security',
        'Cadastral Integration with State RoRs',
        'Gram Sabha Statutory Power',
      ],
      portalUrl: 'https://tribal.nic.in',
      status: 'Active / 14+ States',
    },
    {
      id: 'SCHEME-010',
      name: 'PM-KISAN Land Record Seeding & Aadhaar Linkage',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      funding: 'Central Direct Benefit Transfer Scheme',
      icon: Landmark,
      themeColor: 'saffron',
      summary:
        'Direct income transfer of ₹6,000/year to eligible landholding farmer families. Enrollment and fund disbursals are strictly tied to verified digital land ownership databases, accelerating nationwide RoR cadastral verification.',
      highlights: [
        '₹6,000/Year Direct Transfer',
        'Mandatory Verified Land Seeding',
        'Zero Leakage through DBT',
        'Nationwide Verification Driver',
      ],
      portalUrl: 'https://pmkisan.gov.in',
      status: 'Active / 11+ Crore Beneficiaries',
    },
  ];

  // 2. State-Level Schemes & Portals
  const stateSchemes = [
    {
      state: 'Karnataka',
      code: 'KA',
      region: 'South',
      portalName: 'Bhoomi & SVAMITVA KA',
      scheme: 'Bhoomi RTC & Village Drone Survey',
      summary:
        'India’s pioneer land records computerization system. Delivers digital Records of Rights, Tenancy and Crops (RTC), mutation tracking (e-Kshana), and statewide SVAMITVA rural property card rollouts.',
      features: ['RTC Online Extracts', 'Mutation e-Kshana', 'SVAMITVA Drone Cards', 'Parihara Drought Link'],
      url: 'https://landrecords.karnataka.gov.in',
    },
    {
      state: 'Andhra Pradesh',
      code: 'AP',
      region: 'South',
      portalName: 'WebLand / Meebhoomi (AP)',
      scheme: 'WebLand Integrated Registry',
      summary:
        'Online land records management portal with real-time Sub-Registrar registration linkage, 1B register access, and auto-mutation upon deed registration.',
      features: ['Meebhoomi 1B Extract', 'Adangal Verification', 'SRO Auto-Mutation', 'YSR Jagananna Bhu Hakku'],
      url: 'https://meebhoomi.ap.gov.in',
    },
    {
      state: 'Telangana',
      code: 'TS',
      region: 'South',
      portalName: 'Dharani Portal',
      scheme: 'Integrated Land Records Management System (ILRMS)',
      summary:
        'Unified portal covering agricultural and non-agricultural land records, combining online slot booking, registry execution, and instantaneous e-pattadar passbook issuance.',
      features: ['Instant Mutation upon Registration', 'Pattadar Passbook', 'Slot Booking System', 'Prohibited Land List'],
      url: 'https://dharani.telangana.gov.in',
    },
    {
      state: 'Maharashtra',
      code: 'MH',
      region: 'West',
      portalName: 'Mahabhulekh & e-Ferfar',
      scheme: 'e-Mahabhulekh 7/12 & e-Chawadi',
      summary:
        'Digitized 7/12 (Satbara) extracts, 8A landholding cards, digital property cards (Malmatta Patrak), and 100% digital paperless e-Ferfar mutation with 15-day statutory turnaround.',
      features: ['Digital 7/12 with QR Code', '8A Holding Extract', 'Paperless e-Ferfar', 'SVAMITVA Sanad Cards'],
      url: 'https://bhulekh.mahabhumi.gov.in',
    },
    {
      state: 'Madhya Pradesh',
      code: 'MP',
      region: 'Central',
      portalName: 'MP Bhulekh / Bhu-Abhilekh',
      scheme: 'MP Land Records Modernization',
      summary:
        'Comprehensive state portal for digitized Khasra, Khatauni, and Bhu-Naksha map access; MP was among the earliest pioneer states in the SVAMITVA drone survey rollout.',
      features: ['Digitized Khasra/Khatauni', 'Bhu-Naksha Maps', 'RCMS Revenue Court Case Suite', 'SVAMITVA Pilot Lead'],
      url: 'https://mpbhulekh.gov.in',
    },
    {
      state: 'Rajasthan',
      code: 'RJ',
      region: 'North',
      portalName: 'Apna Khata (e-Dharti)',
      scheme: 'Apna Khata Jamabandi System',
      summary:
        'Online portal for certified Jamabandi (ownership record), Khasra map extracts, and online mutation applications across all 33+ districts of Rajasthan.',
      features: ['Jamabandi Extract', 'Khasra Map Linking', 'e-Mitra Integration', 'Drone Survey Re-Mapping'],
      url: 'https://apnakhata.rajasthan.gov.in',
    },
    {
      state: 'Uttar Pradesh',
      code: 'UP',
      region: 'North',
      portalName: 'Bhulekh UP & e-Khasra',
      scheme: 'UP Revenue Land Computerization',
      summary:
        'Online Khatauni, 16-digit unique parcel code, digitized revenue court management (Vaad), and India’s largest recipient of SVAMITVA rural property Gharauni cards.',
      features: ['16-Digit Parcel Code', 'Gharauni Property Card', 'Vaad Court Management', 'Real-time Mutation Track'],
      url: 'https://upbhulekh.gov.in',
    },
    {
      state: 'Bihar',
      code: 'BR',
      region: 'East',
      portalName: 'Bihar Bhumi (e-Mutation)',
      scheme: 'Bihar Land Records & Lagan Portal',
      summary:
        'Unified system for Dakhil Kharij (mutation), online land tax (Lagan) payments, Jamabandi search, and Special Survey (Vishesh Sarvekshan) for cadastral updates.',
      features: ['Online Dakhil Kharij', 'Digital Lagan Receipt', 'Vishesh Sarvekshan Survey', 'Parimarjan Correction'],
      url: 'https://biharbhumi.bihar.gov.in',
    },
    {
      state: 'West Bengal',
      code: 'WB',
      region: 'East',
      portalName: 'Banglarbhumi',
      scheme: 'Banglarbhumi Land & Land Reforms',
      summary:
        'Full-suite land records, Khatian & Plot information, online mutation, land conversion (U/S 4C), and GIS-enabled cadastral map inspection.',
      features: ['Khatian & Plot Search', 'Land Conversion System', 'Warish (Inheritance) Mutation', 'Mouza Map Viewer'],
      url: 'https://banglarbhumi.gov.in',
    },
    {
      state: 'Odisha',
      code: 'OD',
      region: 'East',
      portalName: 'Bhulekh Odisha',
      scheme: 'Bhulekh & Bhunaksha Odisha',
      summary:
        'Statewide Record of Rights (RoR) portal with district, tehsil, and village level search, integrated with Bhunaksha for spatial parcel boundary validation.',
      features: ['Certified RoR Extracts', 'Bhunaksha Map Overlay', 'e-Registration Linkage', 'Pauti Land Revenue Online'],
      url: 'https://bhulekh.ori.nic.in',
    },
    {
      state: 'Gujarat',
      code: 'GJ',
      region: 'West',
      portalName: 'AnyROR @ Anywhere',
      scheme: 'AnyROR & e-Dhara System',
      summary:
        'Statewide portal providing Anywhere Record of Rights (VF-7, VF-8A, VF-6 mutation register), integrated with urban E-Nagar and rural e-Dhara centers.',
      features: ['VF-7 Survey Number Record', 'VF-8A Khata Details', 'VF-6 Mutation Register', 'i-ORA Revenue Suite'],
      url: 'https://anyror.gujarat.gov.in',
    },
    {
      state: 'Tamil Nadu',
      code: 'TN',
      region: 'South',
      portalName: 'AnyWhere AnyTime e-Services (Patta Chitta)',
      scheme: 'TN Land Records e-Services',
      summary:
        'Official portal for verifying Patta (ownership record), Chitta (land use classification), TSLR extracts (urban areas), and FMB (Field Measurement Book) sketch downloads.',
      features: ['Patta & Chitta Extract', 'FMB Sketch Download', 'TSLR Urban Property Extract', 'A-Register Inspection'],
      url: 'https://eservices.tn.gov.in',
    },
    {
      state: 'Punjab & Haryana',
      code: 'PB/HR',
      region: 'North',
      portalName: 'Jamabandi Punjab / Haryana Jamabandi',
      scheme: 'Jamabandi & Fard Kendra System',
      summary:
        'Provides online Jamabandi, Fard (ownership extract), mutation status, and cadastral maps. Both states achieved early near-100% SVAMITVA village property card saturation.',
      features: ['Online Fard Download', 'Collector Rates Registry', 'SVAMITVA Property Cards', 'Roznamcha Entry System'],
      url: 'https://jamabandi.punjab.gov.in',
    },
    {
      state: 'Chhattisgarh',
      code: 'CG',
      region: 'Central',
      portalName: 'Bhuiyan Portal',
      scheme: 'Bhuiyan Land Records Computerization',
      summary:
        'State portal for B1 Khasra, P-II Kishtabandi, digital map inspection, and seamless paddy procurement MSP quota validation based on digitized agricultural holding records.',
      features: ['B1 Khasra Extract', 'P-II Kishtabandi', 'Kisan Nyay Yojana Linkage', 'Digital Map Verification'],
      url: 'https://bhuiyan.cg.nic.in',
    },
    {
      state: 'Jharkhand',
      code: 'JH',
      region: 'East',
      portalName: 'Jharbhoomi',
      scheme: 'Jharkhand Land Record Management',
      summary:
        'State portal for Khatian inspection, online Register-II (Panji-II), online Lagan receipts, and Dakhil Kharij status tracking across all 24 districts.',
      features: ['Khatian Search', 'Register-II Panji Record', 'Online Lagan Payment', 'Dakhil Kharij Status'],
      url: 'https://jharbhoomi.jharkhand.gov.in',
    },
    {
      state: 'Uttarakhand',
      code: 'UK',
      region: 'North',
      portalName: 'Devbhoomi Bhulekh',
      scheme: 'Devbhoomi Land Record System',
      summary:
        'Digitized RoRs, Khasra-Khatauni records, online mutation tracking, and SVAMITVA rural property card rollouts across hilly and plain tehsils.',
      features: ['Khatauni RoR Extract', 'Bhunaksha Map Suite', 'SVAMITVA Hill Implementation', 'Public Grievance Redressal'],
      url: 'https://bhulekh.uk.gov.in',
    },
  ];

  // 3. Land Reform, Ceiling, Tribal Land Protection & Land Pooling Laws
  const landLaws = [
    {
      category: 'Zamindari & Intermediary Abolition',
      acts: 'State Zamindari / Intermediary Abolition Acts (1950s)',
      objective: 'Abolition of feudal intermediaries (Zamindars, Jagirdars, Inamdars)',
      description:
        'Enacted across nearly all Indian states in the 1950s to dismantle the colonial landlord-tenant hierarchy. Transferred direct proprietary and cultivation land rights to tenant-cultivators, with compensation paid to former intermediaries.',
      enforcement: 'Historic Statutory / Complete Nationwide',
      badge: 'Historic Land Reform',
    },
    {
      category: 'Land Ceiling Laws',
      acts: 'State Agricultural Land Ceiling Acts (e.g. AP Land Reforms Act 1973, Maharashtra Agricultural Lands Act 1961)',
      objective: 'Cap maximum agricultural land a family can hold; redistribute surplus to the landless',
      description:
        'Imposes statutory limits on maximum agricultural landholdings (ranging from 10 to 54 acres depending on irrigation and soil type). Surplus land declared above ceiling is vested in the State and redistributed to landless agricultural laborers and SC/ST households.',
      enforcement: 'Statutory State Legislation',
      badge: 'Redistributive Justice',
    },
    {
      category: 'Tenancy Reform Laws',
      acts: 'State Tenancy Acts (e.g., West Bengal Operation Barga 1978, Kerala Land Reforms Act 1963)',
      objective: 'Security of tenure, regulation of fair rent, and ownership rights to tillers',
      description:
        'Secures tenant-cultivators and sharecroppers (Bargadars) against arbitrary eviction, caps rent at fair proportions (1/4th to 1/5th of produce), and in several progressive states confers permanent ownership rights to the tiller of the soil.',
      enforcement: 'Active State Legislation',
      badge: 'Tiller Rights',
    },
    {
      category: 'Bhoodan & Gramdan Lands',
      acts: 'State Bhoodan Yagna Acts & Gramdan Acts (1950s–1960s)',
      objective: 'Statutory management of voluntary land-gift movement lands initiated by Acharya Vinoba Bhave',
      description:
        'Originating from Acharya Vinoba Bhave’s 1951 Bhoodan movement where landlords voluntarily donated over 4 million acres. State governments enacted Bhoodan Acts to create statutory boards for allotment and dispute resolution of these designated parcels.',
      enforcement: 'State Bhoodan Boards',
      badge: 'Voluntary Redistribution',
    },
    {
      category: 'Wasteland & Surplus Allotment',
      acts: 'State Government Wasteland & Surplus Land Allotment Schemes',
      objective: 'Allotment of government revenue wastelands and ceiling-surplus plots for homesteads',
      description:
        'State revenue authorities identify non-forest cultivable wastelands and distribute Pattas to eligible landless rural families for homesteads (housing) and subsistence farming, creating protected land titles.',
      enforcement: 'District Revenue Administration',
      badge: 'Homestead Security',
    },
    {
      category: 'Tribal Land Alienation Protection',
      acts: 'Fifth Schedule Regulations (e.g., AP Reg 1/1959 & 1970, Odisha OSATIP Act 1956, Tripura Land Revenue Act 1960, Ch. 2-A) & Sixth Schedule Customary Laws',
      objective: 'Prohibit land transfer from Scheduled Tribes to non-tribals; mandatory restoration of alienated land',
      description:
        'Constitutional Fifth Schedule state laws strictly prohibit any transfer or sale of tribal agricultural land to non-tribals, invalidating past transactions and mandating restoration by District Collectors. Sixth Schedule states in the Northeast follow distinct autonomous council customary laws.',
      enforcement: 'Constitutional 5th & 6th Schedules',
      badge: 'Constitutional Safeguard',
    },
    {
      category: 'Forest Rights Act (FRA), 2006',
      acts: 'Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006',
      objective: 'Undo historical injustice by recognizing individual and community forest resource titles',
      description:
        'Central statutory law empowering Gram Sabhas to recognize individual forest land cultivation rights (up to 4 hectares) and Community Forest Resource (CFR) rights, preventing eviction and granting ownership over Minor Forest Produce.',
      enforcement: 'Ministry of Tribal Affairs / MoEFCC',
      badge: 'Forest Tenure Rights',
    },
    {
      category: 'Model Agricultural Land Leasing Act',
      acts: 'NITI Aayog Model Agricultural Land Leasing Act, 2016 (Adopted by MP, UP, etc.)',
      objective: 'Legalize agricultural land leasing to ensure tenant access to bank credit and crop insurance',
      description:
        'A model framework allowing landowners to legally lease out agricultural land on written agreement without fear of losing ownership title, while enabling tenant farmers to access institutional credit, disaster compensation, and PMFBY crop insurance.',
      enforcement: 'State-Adopted Model Framework',
      badge: 'NITI Aayog Model Law',
    },
    {
      category: 'Land Pooling Schemes (Urban Planning)',
      acts: 'e.g., AP Amaravati Capital Land Pooling, Gujarat Town Planning Schemes (TPS), Delhi DDA Land Pooling 2018',
      objective: 'Voluntary land assembly for planned urban infrastructure without forcible acquisition',
      description:
        'Landowners voluntarily pool their fragmented agricultural parcels with an urban development authority. In return, after roads, utilities, and civic amenities are constructed, owners receive a developed commercial/residential plot of smaller area but substantially higher market valuation.',
      enforcement: 'Urban Development Authorities',
      badge: 'Urban Infrastructure',
    },
    {
      category: 'RFCTLARR State Amendments',
      acts: 'State Amendments to the Central RFCTLARR Act, 2013 (Tamil Nadu, Telangana, Gujarat, Jharkhand)',
      objective: 'Streamlined land acquisition processes for critical public infrastructure projects',
      description:
        'State-specific legislative amendments exempting certain designated priority infrastructure projects (e.g., defense, highways, rural electrification, industrial corridors) from Chapter II (SIA) while strictly maintaining or enhancing the mandatory statutory compensation and R&R entitlements.',
      enforcement: 'State Legislative Amendments',
      badge: 'Infrastructure Accelerated',
    },
  ];

  // 4. National-Level Portals Directory
  const nationalPortals = [
    {
      name: 'Department of Land Resources (DoLR)',
      ministry: 'Ministry of Rural Development, Govt. of India',
      url: 'https://dolr.gov.in',
      role: 'Nodal central department for national land reforms, DILRMP, watershed rejuvenation, and RFCTLARR statutory administration.',
      badge: 'Central Nodal Agency',
    },
    {
      name: 'DILRMP Official Programme Portal',
      ministry: 'Department of Land Resources (DoLR)',
      url: 'https://dolr.gov.in/en/programmes-schemes/dilrmp-2/',
      role: 'Official programme guidelines, state-wise cadastral digitization progress dashboards, ULPIN coverage statistics, and GIS standards.',
      badge: 'Programme MIS',
    },
    {
      name: 'SVAMITVA National Portal',
      ministry: 'Ministry of Panchayati Raj',
      url: 'https://svamitva.nic.in',
      role: 'Official portal for rural drone surveys, state-level MoUs, property card distribution metrics, and GIS village spatial datasets.',
      badge: 'Drone Survey Portal',
    },
    {
      name: 'National Generic Document Registration System (NGDRS)',
      ministry: 'DoLR / MeitY (Developed by NIC)',
      url: 'https://ngdrs.gov.in',
      role: '"One Nation, One Registration" uniform software architecture for property registration, deed verification, and valuation calculation across states.',
      badge: 'One Nation One Registration',
    },
    {
      name: 'Ministry of Panchayati Raj',
      ministry: 'Government of India',
      url: 'https://panchayat.gov.in',
      role: 'Apex ministry governing rural local self-government, Gram Panchayat spatial planning, and nodal SVAMITVA execution.',
      badge: 'Panchayati Raj Apex',
    },
    {
      name: 'Ministry of Rural Development',
      ministry: 'Government of India',
      url: 'https://rural.gov.in',
      role: 'Parent ministry of DoLR, overseeing comprehensive rural livelihoods, infrastructure, and natural resource stewardship.',
      badge: 'Parent Ministry',
    },
    {
      name: 'Ministry of Tribal Affairs (FRA Portal)',
      ministry: 'Government of India',
      url: 'https://tribal.nic.in',
      role: 'Central ministry overseeing Forest Rights Act (FRA) implementation, tribal land protection, and Fifth Schedule monitoring.',
      badge: 'Tribal Rights Nodal',
    },
    {
      name: 'Open Government Data (data.gov.in) — DoLR Datasets',
      ministry: 'Ministry of Electronics & IT / DoLR',
      url: 'https://www.data.gov.in/ministrydepartment/Department%20of%20Land%20Resources%20(DOLR)',
      role: 'Official open data repository hosting downloadable nationwide datasets on land digitization, watershed, and cadastral progress.',
      badge: 'Open Datasets',
    },
  ];

  // Filtering Logic
  const filteredNational = useMemo(() => {
    return nationalSchemes.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.ministry.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.highlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const filteredStates = useMemo(() => {
    return stateSchemes.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.state.toLowerCase().includes(q) ||
        item.portalName.toLowerCase().includes(q) ||
        item.scheme.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.features.some((f) => f.toLowerCase().includes(q));

      const matchesRegion =
        selectedStateFilter === 'ALL' || item.region === selectedStateFilter;

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedStateFilter]);

  const filteredLaws = useMemo(() => {
    return landLaws.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.category.toLowerCase().includes(q) ||
        item.acts.toLowerCase().includes(q) ||
        item.objective.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const filteredPortals = useMemo(() => {
    return nationalPortals.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.ministry.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  return (
    <div className="page-schemes">
      {/* Hero Section */}
      <section className="schemes-hero-section">
        <div className="ux4g-container">
          <div className="schemes-hero-inner">
            <div className="section-eyebrow-pill">
              <span className="pill-dot"></span>
              <span>Government Schemes &amp; Legal Frameworks</span>
            </div>
            <h1 className="schemes-hero-title">
              National Land Schemes &amp; <span className="heading-saffron">Statutory Architecture</span>
            </h1>
            <p className="schemes-hero-desc">
              Comprehensive repository of Central Sector Schemes, State-level digitization portals, Land Reform Laws, and Official Digital India Portals under the Department of Land Resources (DoLR).
            </p>

            {/* Quick Search Input */}
            <div className="schemes-search-bar">
              <Search size={18} className="search-icon-left" />
              <input
                type="text"
                placeholder="Search schemes, states (e.g. Maharashtra, Karnataka), ministries, acts, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="schemes-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <section className="schemes-tabs-section">
        <div className="ux4g-container">
          <div className="schemes-tab-navigation">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`schemes-nav-tab ${activeTab === 'ALL' ? 'tab-active' : ''}`}
            >
              <Sparkles size={16} />
              <span>All Frameworks</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('NATIONAL')}
              className={`schemes-nav-tab ${activeTab === 'NATIONAL' ? 'tab-active' : ''}`}
            >
              <Layers size={16} />
              <span>1. National Government Schemes ({filteredNational.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('STATE')}
              className={`schemes-nav-tab ${activeTab === 'STATE' ? 'tab-active' : ''}`}
            >
              <MapPin size={16} />
              <span>2. State-Level Schemes ({filteredStates.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LAWS')}
              className={`schemes-nav-tab ${activeTab === 'LAWS' ? 'tab-active' : ''}`}
            >
              <Scale size={16} />
              <span>3. Land Reforms &amp; Acts ({filteredLaws.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PORTALS')}
              className={`schemes-nav-tab ${activeTab === 'PORTALS' ? 'tab-active' : ''}`}
            >
              <Globe size={16} />
              <span>4. National Portals ({filteredPortals.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="schemes-main-content">
        <div className="ux4g-container">
          {/* ==================== 1. NATIONAL GOVERNMENT SCHEMES ==================== */}
          {(activeTab === 'ALL' || activeTab === 'NATIONAL') && (
            <section className="schemes-content-block" id="national-schemes">
              <div className="block-header-line">
                <div>
                  <span className="block-badge-num">SECTION 1</span>
                  <h2 className="block-title">
                    National Government <span className="text-saffron">Schemes</span>
                  </h2>
                  <p className="block-subtitle">
                    Central Sector and Centrally Sponsored programmes modernizing land governance across India.
                  </p>
                </div>
              </div>

              <div className="national-schemes-grid">
                {filteredNational.map((scheme) => {
                  const IconComp = scheme.icon || Layers;
                  return (
                    <article key={scheme.id} className="national-scheme-card">
                      <div className="scheme-card-top">
                        <div className={`scheme-icon-box ${scheme.themeColor}`}>
                          <IconComp size={24} strokeWidth={2.2} />
                        </div>
                        <div className="scheme-top-meta">
                          <span className="scheme-status-pill">{scheme.status}</span>
                          <span className="scheme-funding-tag">{scheme.funding}</span>
                        </div>
                      </div>

                      <h3 className="scheme-card-title">{scheme.name}</h3>

                      <div className="scheme-ministry-row">
                        <Landmark size={14} className="text-forest" />
                        <span>{scheme.ministry}</span>
                      </div>

                      <p className="scheme-card-summary">{scheme.summary}</p>

                      <div className="scheme-highlights-wrap">
                        <span className="highlights-label">Key Highlights:</span>
                        <div className="highlights-tags-list">
                          {scheme.highlights.map((h, i) => (
                            <span key={i} className="highlight-tag">
                              <CheckCircle2 size={11} className="text-emerald" strokeWidth={2.4} />
                              <span>{h}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="scheme-card-bottom">
                        <a
                          href={scheme.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="scheme-official-btn"
                          title={`Visit official website for ${scheme.name}`}
                        >
                          <span>Official Scheme Portal</span>
                          <ExternalLink size={13} strokeWidth={2.2} />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* ==================== 2. STATE-LEVEL SCHEMES & PORTALS ==================== */}
          {(activeTab === 'ALL' || activeTab === 'STATE') && (
            <section className="schemes-content-block" id="state-schemes">
              <div className="block-header-line d-flex justify-between align-end flex-wrap gap-3">
                <div>
                  <span className="block-badge-num">SECTION 2</span>
                  <h2 className="block-title">
                    State-Level <span className="text-saffron">Schemes &amp; Portals</span>
                  </h2>
                  <p className="block-subtitle">
                    State-specific computerized land record systems, RoR services, and SVAMITVA implementations.
                  </p>
                </div>

                {/* Region Filter Buttons */}
                <div className="state-region-filter-bar">
                  {['ALL', 'North', 'South', 'West', 'East', 'Central'].map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setSelectedStateFilter(reg)}
                      className={`region-pill-btn ${selectedStateFilter === reg ? 'active' : ''}`}
                    >
                      {reg === 'ALL' ? 'All Regions' : reg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="state-schemes-grid">
                {filteredStates.map((st) => (
                  <div key={st.state + st.code} className="state-scheme-tile">
                    <div className="state-tile-header">
                      <div className="state-tile-badge">
                        <span className="state-code-box">{st.code}</span>
                        <div>
                          <h4 className="state-name-bold">{st.state}</h4>
                          <span className="state-region-badge">{st.region} Region</span>
                        </div>
                      </div>
                      <span className="state-scheme-name-pill">{st.scheme}</span>
                    </div>

                    <div className="state-portal-title-row">
                      <Globe size={15} className="text-saffron" />
                      <strong>{st.portalName}</strong>
                    </div>

                    <p className="state-tile-summary">{st.summary}</p>

                    <div className="state-features-list">
                      {st.features.map((f, i) => (
                        <span key={i} className="state-feature-chip">
                          &bull; {f}
                        </span>
                      ))}
                    </div>

                    <div className="state-tile-footer">
                      <a
                        href={st.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="state-portal-direct-link"
                      >
                        <span>Access {st.state} Portal</span>
                        <ExternalLink size={12} strokeWidth={2.4} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================== 3. LAND REFORMS, CEILING & TRIBAL LAWS ==================== */}
          {(activeTab === 'ALL' || activeTab === 'LAWS') && (
            <section className="schemes-content-block" id="land-laws">
              <div className="block-header-line">
                <div>
                  <span className="block-badge-num">SECTION 3</span>
                  <h2 className="block-title">
                    Land Reform, Ceiling, <span className="text-saffron">Tribal Land Protection &amp; Pooling Laws</span>
                  </h2>
                  <p className="block-subtitle">
                    Statutory acts and historical reform frameworks governing land tenure, ceiling limits, tribal safeguards, and land pooling.
                  </p>
                </div>
              </div>

              <div className="laws-table-container">
                <table className="laws-benchmark-table">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Category</th>
                      <th style={{ width: '28%' }}>Statutory Examples &amp; Acts</th>
                      <th style={{ width: '38%' }}>What it covers &amp; Scope</th>
                      <th style={{ width: '12%' }} className="text-right">Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLaws.map((law, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="law-category-cell">
                            <Scale size={16} className="text-forest" />
                            <strong>{law.category}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="law-acts-text font-bold text-forest">
                            {law.acts}
                          </div>
                          <div className="law-enforcement-sub">
                            Enforcement: {law.enforcement}
                          </div>
                        </td>
                        <td>
                          <p className="law-description-text">{law.description}</p>
                          <div className="law-objective-box">
                            <strong>Objective:</strong> {law.objective}
                          </div>
                        </td>
                        <td className="text-right">
                          <span className="law-badge-pill">{law.badge}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================== 4. NATIONAL-LEVEL PORTALS DIRECTORY ==================== */}
          {(activeTab === 'ALL' || activeTab === 'PORTALS') && (
            <section className="schemes-content-block" id="national-portals">
              <div className="block-header-line">
                <div>
                  <span className="block-badge-num">SECTION 4</span>
                  <h2 className="block-title">
                    National-Level <span className="text-saffron">Official Portals Directory</span>
                  </h2>
                  <p className="block-subtitle">
                    Direct entry points to central government departments, scheme MIS engines, and open land datasets.
                  </p>
                </div>
              </div>

              <div className="national-portals-grid">
                {filteredPortals.map((portal, idx) => (
                  <div key={idx} className="national-portal-card">
                    <div className="portal-card-header">
                      <div className="portal-icon-wrapper">
                        <Building2 size={22} className="text-forest" />
                      </div>
                      <div>
                        <h4 className="portal-title-text">{portal.name}</h4>
                        <span className="portal-ministry-text">{portal.ministry}</span>
                      </div>
                    </div>

                    <p className="portal-role-desc">{portal.role}</p>

                    <div className="portal-card-footer">
                      <span className="portal-badge-chip">{portal.badge}</span>
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portal-visit-btn"
                        title={`Open official website: ${portal.name}`}
                      >
                        <span>Visit Portal</span>
                        <ExternalLink size={13} strokeWidth={2.4} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Consultation / Help Banner */}
          <div className="schemes-footer-callout">
            <div className="callout-left">
              <ShieldCheck size={28} className="text-forest" />
              <div>
                <h4 className="callout-title">Need Guidance on Scheme Eligibility or Portal Access?</h4>
                <p className="callout-desc">
                  Explore our comprehensive Citizen Helpdesk, FAQs, or submit an official inquiry regarding Central/State land schemes.
                </p>
              </div>
            </div>
            <div className="callout-right d-flex gap-3">
              <Link to="/help" className="callout-btn-primary">
                <span>View FAQs &amp; Help</span>
                <ArrowRight size={14} />
              </Link>
              <Link to="/services" className="callout-btn-secondary">
                <span>Explore Citizen Services</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchemesPage;
