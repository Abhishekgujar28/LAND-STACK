-- =====================================================================
-- Land Stack Initial Seed Data (Supabase PostgreSQL)
-- Preserves all entities from prototype JSON data
-- =====================================================================

BEGIN;

-- States
INSERT INTO states (code, name, local_name) VALUES
('MH', 'Maharashtra', 'महाराष्ट्र'),
('RJ', 'Rajasthan', 'राजस्थान')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Districts
INSERT INTO districts (code, state_code, name, local_name) VALUES
('DIST-PUN', 'MH', 'Pune', 'पुणे'),
('DIST-NSK', 'MH', 'Nashik', 'नाशिक'),
('DIST-JPR', 'RJ', 'Jaipur', 'जयपुर'),
('DIST-UDP', 'RJ', 'Udaipur', 'उदयपुर')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Tehsils
INSERT INTO tehsils (code, district_code, name, local_name) VALUES
('TEH-HAV', 'DIST-PUN', 'Haveli', 'हवेली'),
('TEH-MUL', 'DIST-PUN', 'Mulshi', 'मुळशी'),
('TEH-MAW', 'DIST-PUN', 'Mawal', 'मावळ'),
('TEH-NSK-CITY', 'DIST-NSK', 'Nashik City', 'नाशिक शहर'),
('TEH-IGP', 'DIST-NSK', 'Igatpuri', 'इगतपुरी'),
('TEH-JPR-CITY', 'DIST-JPR', 'Jaipur City', 'जयपुर शहर'),
('TEH-AMB', 'DIST-JPR', 'Amber', 'आमेर'),
('TEH-UDP-CITY', 'DIST-UDP', 'Girwa', 'गिरवा'),
('TEH-SAL', 'DIST-UDP', 'Salumber', 'सलूम्बर')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Villages
INSERT INTO villages (code, tehsil_code, name, local_name, pin_code) VALUES
('VIL-WAG', 'TEH-HAV', 'Wagholi', 'वाघोली', '412207'),
('VIL-LOH', 'TEH-HAV', 'Lohegaon', 'लोहगाव', '411047'),
('VIL-MAN', 'TEH-HAV', 'Manjri Khurd', 'मांजरी खुर्द', '412307'),
('VIL-PIR', 'TEH-MUL', 'Pirangut', 'पिरंगुट', '412115'),
('VIL-HIN', 'TEH-MUL', 'Hinjawadi', 'हिंजवडी', '411057'),
('VIL-TAL', 'TEH-MAW', 'Talegaon Dabhade', 'तळेगाव दाभाडे', '410506'),
('VIL-NSK-PAN', 'TEH-NSK-CITY', 'Panchavati', 'पंचवटी', '422003'),
('VIL-NSK-GAN', 'TEH-NSK-CITY', 'Gangapur', 'गंगापूर', '422013'),
('VIL-GHO', 'TEH-IGP', 'Ghoti', 'घोटी', '422402'),
('VIL-TRY', 'TEH-IGP', 'Trimbakeshwar', 'त्र्यंबकेश्वर', '422212'),
('VIL-JPR-MAL', 'TEH-JPR-CITY', 'Malviya Nagar', 'मालवीय नगर', '302017'),
('VIL-JPR-MAN', 'TEH-JPR-CITY', 'Mansarovar', 'मानसरोवर', '302020'),
('VIL-AMB-JAM', 'TEH-AMB', 'Jamwa Ramgarh', 'जमवा रामगढ़', '303012'),
('VIL-AMB-CHO', 'TEH-AMB', 'Chomu', 'चौमूँ', '303702'),
('VIL-GIR-UDA', 'TEH-UDP-CITY', 'Udaipur City', 'उदयपुर शहर', '313001'),
('VIL-GIR-BAD', 'TEH-UDP-CITY', 'Badgaon', 'बड़गाँव', '313011'),
('VIL-SAL-KHE', 'TEH-SAL', 'Kheroda', 'खेरोडा', '313027'),
('VIL-SAL-SEM', 'TEH-SAL', 'Semari', 'सेमारी', '313603')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Departments
INSERT INTO departments (code, name, local_name, description) VALUES
('DEPT-REV', 'Revenue & Land Records', NULL, 'Talathi/Patwari field verification, Tehsildar statutory decisions, mutation processing, and RoR maintenance.'),
('DEPT-REG', 'Registration & Stamps', NULL, 'Sub-Registrar deed verification, pre-registration audits, NGDRS integration, and property registration linkage.'),
('DEPT-DIST', 'District Administration', NULL, 'District Collector oversight, tehsil SLA monitoring, officer reallocation, and inter-tehsil dispute escalation.'),
('DEPT-STATE', 'State Project Management', NULL, 'State-level DILRMP progress, statewide analytics, adapter API health, and AI executive briefings.'),
('DEPT-NAT', 'National Land Governance (DoLR)', NULL, 'Department of Land Resources — national benchmarks, state comparison, DILRMP MIS sync, and Bhu-Aadhaar tracking.'),
('DEPT-ADMIN', 'IT & Platform Administration', NULL, 'System health, OPA policy deployment, state config management, user management, audit log integrity, and DLQ monitoring.')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Government Roles
INSERT INTO government_roles (role, name, department_code, level, permissions) VALUES
('TALATHI', NULL, 'Revenue & Land Records', 'State', '[]'::jsonb),
('TEHSILDAR', NULL, 'Revenue & Land Records', 'State', '[]'::jsonb),
('SRO', NULL, 'Registration & Stamps', 'State', '[]'::jsonb),
('COLLECTOR', NULL, 'District Administration', 'State', '[]'::jsonb),
('STATE_PMU', NULL, 'Settlement Commissionerate', 'State', '[]'::jsonb),
('NATIONAL_MONITOR', NULL, 'Ministry of Rural Development', 'State', '[]'::jsonb),
('ADMIN', NULL, 'NIC Land Records Division', 'State', '[]'::jsonb)
ON CONFLICT (role) DO UPDATE SET name = EXCLUDED.name;

-- Citizens
INSERT INTO citizens (id, name, local_name, state_code, mobile, email, aadhaar_hash, pan, address, kyc_verified, registered_at) VALUES
('CIT-001', 'Aarav Patil', 'आरव पाटील', 'MH', '+91 98230 45891', 'aarav.patil@example.com', 'XXXX-XXXX-8912', 'ABCPP1234D', 'Gat No 42, Wagholi, Pune, Maharashtra 412207', TRUE, '2024-01-15T10:00:00Z'),
('CIT-002', 'Sunita Kulkarni', 'सुनिता कुलकर्णी', 'MH', '+91 98231 12345', 'sunita.k@example.com', 'XXXX-XXXX-4519', 'BCDPK5678E', 'Flat 402, Shivneri Apts, Lohegaon, Pune 411047', TRUE, '2024-02-10T11:30:00Z'),
('CIT-003', 'Rajesh Gaikwad', 'राजेश गायकवाड', 'MH', '+91 98232 23456', 'rajesh.g@example.com', 'XXXX-XXXX-7821', 'CDERG9012F', 'Survey 118, Hinjawadi Phase 1, Pune 411057', TRUE, '2024-03-01T09:15:00Z'),
('CIT-004', 'Priya Shinde', 'प्रिया शिंदे', 'MH', '+91 98233 34567', 'priya.shinde@example.com', 'XXXX-XXXX-3342', 'DEFPS3456G', 'Gat 88, Manjri Khurd, Haveli, Pune 412307', TRUE, '2024-03-12T14:20:00Z'),
('CIT-005', 'Ramesh Bhosale', 'रमेश भोसले', 'MH', '+91 98234 45678', 'ramesh.b@example.com', 'XXXX-XXXX-9912', 'EFGRB7890H', 'Plot 12, Pirangut Industrial Area, Mulshi, Pune 412115', TRUE, '2024-04-05T16:00:00Z'),
('CIT-006', 'Vikram Singh Rathore', 'विक्रम सिंह राठौड़', 'RJ', '+91 94140 33001', 'vikram.rathore@example.com', 'XXXX-XXXX-6543', 'GHI VR5678J', 'Khasra 92, Chomu, Amber, Jaipur 303702', TRUE, '2024-05-18T12:00:00Z'),
('CIT-007', 'Meena Devi', 'मीना देवी', 'RJ', '+91 94140 33002', 'meena.devi@example.com', 'XXXX-XXXX-8765', 'HIJMD9012K', 'Khasra 14, Kheroda, Salumber, Udaipur 313027', TRUE, '2024-06-22T10:45:00Z'),
('CIT-008', 'Rakesh Jangid', 'राकेश जांगिड़', 'RJ', '+91 94140 33003', 'rakesh.jangid@example.com', 'XXXX-XXXX-4321', 'IJKRJ3456L', 'Ward 12, Malviya Nagar, Jaipur 302017', TRUE, '2024-07-09T08:30:00Z'),
('CIT-009', 'Deepa Meghwal', 'दीपा मेघवाल', 'RJ', '+91 94140 33004', 'deepa.m@example.com', 'XXXX-XXXX-1098', 'JKLDM7890M', 'Khasra 56, Semari, Salumber 313603', TRUE, '2024-08-14T15:10:00Z'),
('CIT-010', 'Suresh Chavan', 'सुरेश चव्हाण', 'MH', '+91 98238 89012', 'suresh.chavan@example.com', 'XXXX-XXXX-5678', 'KLMSC1234N', 'CTS 804, Panchavati, Nashik 422003', TRUE, '2024-09-02T13:40:00Z')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Government Users
INSERT INTO government_users (id, name, local_name, role, department_code, designation, state_code, district_code, tehsil_code, village_code, email, mobile, office, active) VALUES
('GOV-001', 'Sanjay Deshmukh', 'संजय देशमुख', 'TEHSILDAR', 'DEPT-REV', 'Tehsildar & Executive Magistrate', 'MH', 'DIST-PUN', 'TEH-HAV', NULL, 'sanjay.deshmukh@maharashtra.gov.in', '+91 94220 11001', 'Tehsildar Office, Haveli, Pune', TRUE),
('GOV-002', 'Prakash Shinde', 'प्रकाश शिंदे', 'TALATHI', 'DEPT-REV', 'Talathi (Circle Wagholi)', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'prakash.shinde@maharashtra.gov.in', '+91 94220 11002', 'Talathi Office, Wagholi Circle', TRUE),
('GOV-003', 'Rekha Joshi', 'रेखा जोशी', 'SRO', 'DEPT-REG', 'Sub-Registrar of Assurances', 'MH', 'DIST-PUN', 'TEH-HAV', NULL, 'rekha.joshi@igrmaharashtra.gov.in', '+91 94220 11003', 'Sub-Registrar Office Haveli No 5', TRUE),
('GOV-004', 'Dr. Suhas Diwase', 'डॉ. सुहास दिवसे', 'COLLECTOR', 'DEPT-DIST', 'District Collector & District Magistrate', 'MH', 'DIST-PUN', NULL, NULL, 'collector.pune@maharashtra.gov.in', '+91 94220 11004', 'Collectorate Office, Pune', TRUE),
('GOV-005', 'Ganesh Gole', 'गणेश गोले', 'TALATHI', 'DEPT-REV', 'Talathi (Circle Igatpuri)', 'MH', 'DIST-NSK', 'TEH-IGP', 'VIL-GHO', 'ganesh.gole@maharashtra.gov.in', '+91 94220 11005', 'Talathi Office, Ghoti Circle, Igatpuri', TRUE),
('GOV-006', 'Ram Kishan Meena', 'राम किशन मीणा', 'TEHSILDAR', 'DEPT-REV', 'Tehsildar & Executive Magistrate', 'RJ', 'DIST-JPR', 'TEH-AMB', NULL, 'rk.meena@rajasthan.gov.in', '+91 94140 22001', 'Tehsildar Office, Amber, Jaipur', TRUE),
('GOV-007', 'Bhawani Singh Rathore', 'भवानी सिंह राठौड़', 'TALATHI', 'DEPT-REV', 'Patwari (Halka Chomu)', 'RJ', 'DIST-JPR', 'TEH-AMB', 'VIL-AMB-CHO', 'bs.rathore@rajasthan.gov.in', '+91 94140 22002', 'Patwari Halka Office, Chomu', TRUE),
('GOV-008', 'Sunita Sharma', 'सुनीता शर्मा', 'SRO', 'DEPT-REG', 'Sub-Registrar', 'RJ', 'DIST-JPR', 'TEH-JPR-CITY', NULL, 'sunita.sharma@rajasthan.gov.in', '+91 94140 22003', 'Sub-Registrar Office, Jaipur City', TRUE),
('GOV-009', 'Dinesh Gupta', 'दिनेश गुप्ता', 'COLLECTOR', 'DEPT-DIST', 'District Collector & District Magistrate', 'RJ', 'DIST-UDP', NULL, NULL, 'collector.udaipur@rajasthan.gov.in', '+91 94140 22004', 'Collectorate Office, Udaipur', TRUE),
('GOV-010', 'Laxmi Narayan Joshi', 'लक्ष्मी नारायण जोशी', 'TALATHI', 'DEPT-REV', 'Patwari (Halka Salumber)', 'RJ', 'DIST-UDP', 'TEH-SAL', 'VIL-SAL-KHE', 'ln.joshi@rajasthan.gov.in', '+91 94140 22005', 'Patwari Office, Kheroda, Salumber', TRUE),
('GOV-011', 'Anil Verma', 'अनिल वर्मा', 'STATE_PMU', 'DEPT-STATE', 'State PMU Head — Maharashtra', 'MH', NULL, NULL, NULL, 'anil.verma@pmu.landrecords.gov.in', '+91 94220 11007', 'Settlement Commissionerate & Land Records, Pune', TRUE),
('GOV-012', 'Kavita Shekhawat', 'कविता शेखावत', 'STATE_PMU', 'DEPT-STATE', 'State PMU Head — Rajasthan', 'RJ', NULL, NULL, NULL, 'kavita.shekhawat@pmu.rajasthan.gov.in', '+91 94140 22006', 'Revenue Board, Ajmer', TRUE),
('GOV-013', 'Meera Sengupta', 'मीरा सेनगुप्ता', 'NATIONAL_MONITOR', 'DEPT-NAT', 'National Cadastral Monitoring Officer', NULL, NULL, NULL, NULL, 'meera.sengupta@dolr.gov.in', '+91 94220 11008', 'Department of Land Resources (DoLR), New Delhi', TRUE),
('GOV-014', 'Manoj Tiwari', 'मनोज तिवारी', 'SYS_ADMIN', 'DEPT-ADMIN', 'Land Stack System Administrator', NULL, NULL, NULL, NULL, 'admin.landstack@nic.in', '+91 94220 11009', 'NIC Land Records Division, New Delhi', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Parcels
INSERT INTO parcels (ulpin, survey_number, gat_number, khasra_number, cts_number, state_code, district_code, tehsil_code, village_code, village_name, area, area_unit, land_use, classification, latitude, longitude, status, source, source_system, last_updated) VALUES
('ULPIN-MH-PUN-000001', '104', '42', '104/1', 'CTS-WAG-101', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 1.45, 'Hectare', 'Agricultural', 'Jirayat', 18.5793, 73.9812, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-01-15T09:00:00Z'),
('ULPIN-MH-PUN-000002', '108', '45', '108/2', 'CTS-WAG-102', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 0.85, 'Hectare', 'Residential (NA)', 'Non-Agricultural', 18.581, 73.9835, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-02-01T11:20:00Z'),
('ULPIN-MH-PUN-000003', '112', '49', '112/A', 'CTS-WAG-103', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 2.1, 'Hectare', 'Commercial (NA)', 'Non-Agricultural', 18.5825, 73.985, 'ENCUMBERED', 'e-Mahabhumi & CERSAI', 'CERSAI_INTEGRATION', '2025-01-20T14:10:00Z'),
('ULPIN-MH-PUN-000004', '120', '55', '120/1', NULL, 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 3.4, 'Hectare', 'Tribal Protected Agricultural', 'Section 36A Protected', 18.584, 73.987, 'RESTRICTED', 'Revenue Department Tribal Cell', 'REVENUE_TRIBAL_REGISTRY', '2024-11-10T08:30:00Z'),
('ULPIN-MH-PUN-000005', '201', '78', '201/1', 'CTS-LOH-201', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-LOH', 'Lohegaon', 1.2, 'Hectare', 'Residential (NA)', 'Non-Agricultural', 18.591, 73.921, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-02-14T10:00:00Z'),
('ULPIN-MH-PUN-000006', '205', '82', '205/3', 'CTS-LOH-202', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-LOH', 'Lohegaon', 0.65, 'Hectare', 'Agricultural', 'Bagayat', 18.593, 73.923, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-01-10T12:00:00Z'),
('ULPIN-MH-PUN-000007', '210', '89', '210/1', 'CTS-LOH-203', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-LOH', 'Lohegaon', 1.85, 'Hectare', 'Industrial', 'Non-Agricultural', 18.595, 73.925, 'ENCUMBERED', 'e-Mahabhumi & SBI Mortgage Cell', 'CERSAI_INTEGRATION', '2025-02-05T15:45:00Z'),
('ULPIN-MH-PUN-000008', '215', '93', '215/B', NULL, 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-LOH', 'Lohegaon', 2.5, 'Hectare', 'Agricultural', 'Jirayat', 18.597, 73.928, 'DISPUTED', 'e-Courts Pune District & Sessions', 'ECOURTS_INTEGRATION', '2025-01-18T16:30:00Z'),
('ULPIN-MH-PUN-000009', '301', '15', '301/1', 'CTS-MAN-301', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-MAN', 'Manjri Khurd', 1.1, 'Hectare', 'Agricultural', 'Bagayat', 18.514, 73.978, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-01-25T11:00:00Z'),
('ULPIN-MH-PUN-000010', '305', '19', '305/2', 'CTS-MAN-302', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-MAN', 'Manjri Khurd', 0.95, 'Hectare', 'Residential (NA)', 'Non-Agricultural', 18.516, 73.981, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-02-12T14:15:00Z'),
('ULPIN-MH-PUN-000011', '310', '25', '310/1', 'CTS-MAN-303', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-MAN', 'Manjri Khurd', 2.75, 'Hectare', 'Commercial', 'Non-Agricultural', 18.518, 73.984, 'ENCUMBERED', 'e-Mahabhumi & Bank of Maharashtra', 'CERSAI_INTEGRATION', '2025-01-28T09:30:00Z'),
('ULPIN-MH-PUN-000012', '315', '31', '315/A', NULL, 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-MAN', 'Manjri Khurd', 4.1, 'Hectare', 'Government Canal Buffer', 'Irrigation Restricted Zone', 18.52, 73.986, 'RESTRICTED', 'Water Resources Dept Maharashtra', 'IRRIGATION_DEPT_REGISTRY', '2024-12-05T13:00:00Z'),
('ULPIN-MH-PUN-000013', '401', '61', '401/1', 'CTS-PIR-401', 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-PIR', 'Pirangut', 1.75, 'Hectare', 'Agricultural', 'Jirayat', 18.508, 73.682, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-02-02T10:30:00Z'),
('ULPIN-MH-PUN-000014', '406', '68', '406/2', 'CTS-PIR-402', 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-PIR', 'Pirangut', 1.15, 'Hectare', 'Industrial (MIDC Buffer)', 'Non-Agricultural', 18.51, 73.685, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-01-12T16:00:00Z'),
('ULPIN-MH-PUN-000015', '412', '74', '412/1', 'CTS-PIR-403', 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-PIR', 'Pirangut', 3.2, 'Hectare', 'Warehouse / Logistics', 'Non-Agricultural', 18.512, 73.688, 'ENCUMBERED', 'HDFC Bank Commercial Loan Registry', 'CERSAI_INTEGRATION', '2025-02-18T11:45:00Z'),
('ULPIN-MH-PUN-000016', '418', '81', '418/B', NULL, 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-PIR', 'Pirangut', 2.45, 'Hectare', 'Agricultural', 'Jirayat', 18.514, 73.691, 'DISPUTED', 'Sub-Divisional Officer (SDO) Revenue Court', 'REVENUE_COURT_CMS', '2025-01-22T14:00:00Z'),
('ULPIN-MH-PUN-000017', '501', '110', '501/1', 'CTS-HIN-501', 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-HIN', 'Hinjawadi', 0.5, 'Hectare', 'IT Park / Commercial', 'Non-Agricultural', 18.5912, 73.7385, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-02-10T12:00:00Z'),
('ULPIN-MH-PUN-000018', '505', '118', '505/2', 'CTS-HIN-502', 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-HIN', 'Hinjawadi', 1.1, 'Hectare', 'Residential Township (NA)', 'Non-Agricultural', 18.5935, 73.741, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-01-14T09:15:00Z'),
('ULPIN-MH-PUN-000019', '512', '125', '512/1', 'CTS-HIN-503', 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-HIN', 'Hinjawadi', 1.8, 'Hectare', 'Commercial Office', 'Non-Agricultural', 18.596, 73.7435, 'ENCUMBERED', 'ICICI Bank Corporate Credit Cell', 'CERSAI_INTEGRATION', '2025-02-04T15:30:00Z'),
('ULPIN-MH-PUN-000020', '520', '134', '520/A', NULL, 'MH', 'DIST-PUN', 'TEH-MUL', 'VIL-HIN', 'Hinjawadi', 2.9, 'Hectare', 'Forest Eco-Sensitive Buffer', 'Forest Conservation Buffer', 18.598, 73.746, 'RESTRICTED', 'Forest Department Maharashtra', 'FOREST_DEPT_REGISTRY', '2024-10-18T10:00:00Z'),
('ULPIN-MH-PUN-000021', '601', '12', '601/1', 'CTS-TAL-601', 'MH', 'DIST-PUN', 'TEH-MAW', 'VIL-TAL', 'Talegaon Dabhade', 1.6, 'Hectare', 'Agricultural', 'Jirayat', 18.735, 73.675, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-02-11T13:20:00Z'),
('ULPIN-MH-PUN-000022', '608', '18', '608/2', 'CTS-TAL-602', 'MH', 'DIST-PUN', 'TEH-MAW', 'VIL-TAL', 'Talegaon Dabhade', 0.8, 'Hectare', 'Residential (NA)', 'Non-Agricultural', 18.737, 73.678, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-01-29T11:10:00Z'),
('ULPIN-MH-PUN-000023', '614', '26', '614/B', 'CTS-TAL-603', 'MH', 'DIST-PUN', 'TEH-MAW', 'VIL-TAL', 'Talegaon Dabhade', 2.2, 'Hectare', 'Industrial', 'Non-Agricultural', 18.739, 73.681, 'DISPUTED', 'Civil Court Senior Division Pune', 'ECOURTS_INTEGRATION', '2025-02-08T16:00:00Z'),
('ULPIN-MH-PUN-000024', '620', '33', '620/1', 'CTS-TAL-604', 'MH', 'DIST-PUN', 'TEH-MAW', 'VIL-TAL', 'Talegaon Dabhade', 1.35, 'Hectare', 'Agricultural', 'Jirayat', 18.741, 73.684, 'UNDER_VERIFICATION', 'Talathi Field Verification Saza', 'FIELD_SURVEY_ROVER', '2025-02-20T10:00:00Z'),
('ULPIN-MH-PUN-000025', '628', '41', '628/3', 'CTS-TAL-605', 'MH', 'DIST-PUN', 'TEH-MAW', 'VIL-TAL', 'Talegaon Dabhade', 0.9, 'Hectare', 'Agricultural', 'Bagayat', 18.743, 73.687, 'UNDER_VERIFICATION', 'e-Mojani Cadastral Resurvey', 'EMOJANI_ETS_SURVEY', '2025-02-21T15:30:00Z'),
('ULPIN-MH-NSK-000026', '701', '14', '701/1', 'CTS-PAN-701', 'MH', 'DIST-NSK', 'TEH-NSK-CITY', 'VIL-NSK-PAN', 'Panchavati', 0.75, 'Hectare', 'Residential (NA)', 'Non-Agricultural', 20.005, 73.791, 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', '2025-02-15T11:00:00Z'),
('ULPIN-MH-NSK-000027', '705', '22', '705/A', 'CTS-GAN-702', 'MH', 'DIST-NSK', 'TEH-NSK-CITY', 'VIL-NSK-GAN', 'Gangapur', 1.5, 'Hectare', 'Commercial (NA)', 'Non-Agricultural', 20.021, 73.742, 'ENCUMBERED', 'e-Mahabhumi & Bank of Baroda', 'CERSAI_INTEGRATION', '2025-01-30T14:20:00Z'),
('ULPIN-RJ-JPR-000028', '801', '51', '801/1', 'KHAT-MAL-801', 'RJ', 'DIST-JPR', 'TEH-JPR-CITY', 'VIL-JPR-MAL', 'Malviya Nagar', 0.45, 'Hectare', 'Residential (NA)', 'Abadi Commercial', 26.853, 75.815, 'CLEAR', 'Apna Khata Rajasthan Land Records', 'RAJ_APNA_KHATA_DB', '2025-02-10T10:00:00Z'),
('ULPIN-RJ-JPR-000029', '808', '63', '808/2', 'KHAT-MAN-802', 'RJ', 'DIST-JPR', 'TEH-JPR-CITY', 'VIL-JPR-MAN', 'Mansarovar', 1.25, 'Hectare', 'Commercial (NA)', 'Non-Agricultural', 26.868, 75.762, 'ENCUMBERED', 'Apna Khata & PNB Loan Cell', 'CERSAI_INTEGRATION', '2025-01-28T16:00:00Z'),
('ULPIN-RJ-JPR-000030', '815', '72', '815/A', 'KHAT-AMB-803', 'RJ', 'DIST-JPR', 'TEH-AMB', 'VIL-AMB-JAM', 'Jamwa Ramgarh', 3.8, 'Hectare', 'Agricultural (Barani)', 'Barani Doyam', 27.014, 75.945, 'RESTRICTED', 'Rajasthan Forest & Wildlife Cell', 'RAJ_REVENUE_DB', '2024-11-20T09:40:00Z'),
('ULPIN-RJ-UDP-000031', '901', '88', '901/1', 'KHAT-GIR-901', 'RJ', 'DIST-UDP', 'TEH-UDP-CITY', 'VIL-GIR-UDA', 'Udaipur City', 0.6, 'Hectare', 'Tourism / Heritage Zone', 'Abadi Commercial', 24.585, 73.712, 'CLEAR', 'Apna Khata & UIT Udaipur', 'RAJ_APNA_KHATA_DB', '2025-02-18T12:30:00Z')
ON CONFLICT (ulpin) DO UPDATE SET status = EXCLUDED.status;

-- Ownership Records
INSERT INTO ownership_records (id, parcel_ulpin, owner_id, owner_name, khata_number, relation, share, aadhaar_status) VALUES
('OWN-001', 'ULPIN-MH-PUN-000001', 'CIT-001', 'Aarav Patil', 'KH-8A-1001', 'Sole Owner', 100, 'Verified'),
('OWN-002', 'ULPIN-MH-PUN-000002', 'CIT-001', 'Aarav Patil', 'KH-8A-1001', 'Joint Co-Sharer', 60, 'Verified'),
('OWN-003', 'ULPIN-MH-PUN-000002', 'CIT-004', 'Priya Shinde', 'KH-8A-1044', 'Joint Co-Sharer', 40, 'Verified'),
('OWN-004', 'ULPIN-MH-PUN-000003', 'CIT-002', 'Sunita Kulkarni', 'KH-8A-1002', 'Sole Owner', 100, 'Verified'),
('OWN-005', 'ULPIN-MH-PUN-000004', 'CIT-007', 'Vikram Jadhav', 'KH-8A-1007', 'Tribal Occupant', 100, 'Verified'),
('OWN-006', 'ULPIN-MH-PUN-000005', 'CIT-002', 'Sunita Kulkarni', 'KH-8A-1002', 'Sole Owner', 100, 'Verified'),
('OWN-007', 'ULPIN-MH-PUN-000006', 'CIT-009', 'Suresh Chavan', 'KH-8A-1009', 'Joint Co-Sharer', 50, 'Verified'),
('OWN-008', 'ULPIN-MH-PUN-000006', 'CIT-002', 'Sunita Kulkarni', 'KH-8A-1002', 'Joint Co-Sharer', 50, 'Verified'),
('OWN-009', 'ULPIN-MH-PUN-000007', 'CIT-009', 'Suresh Chavan', 'KH-8A-1009', 'Sole Owner', 100, 'Verified'),
('OWN-010', 'ULPIN-MH-PUN-000008', 'CIT-003', 'Rajesh Gaikwad', 'KH-8A-1003', 'Disputed Claimant', 50, 'Verified'),
('OWN-011', 'ULPIN-MH-PUN-000008', 'CIT-009', 'Suresh Chavan', 'KH-8A-1009', 'Khatedar in Possession', 50, 'Verified'),
('OWN-012', 'ULPIN-MH-PUN-000009', 'CIT-004', 'Priya Shinde', 'KH-8A-1044', 'Sole Owner', 100, 'Verified'),
('OWN-013', 'ULPIN-MH-PUN-000010', 'CIT-004', 'Priya Shinde', 'KH-8A-1044', 'Joint Co-Sharer', 70, 'Verified'),
('OWN-014', 'ULPIN-MH-PUN-000010', 'CIT-001', 'Aarav Patil', 'KH-8A-1001', 'Joint Co-Sharer', 30, 'Verified'),
('OWN-015', 'ULPIN-MH-PUN-000011', 'CIT-007', 'Vikram Jadhav', 'KH-8A-1007', 'Sole Owner', 100, 'Verified'),
('OWN-016', 'ULPIN-MH-PUN-000012', 'CIT-007', 'Vikram Jadhav', 'KH-8A-1007', 'Notified Holder', 100, 'Verified'),
('OWN-017', 'ULPIN-MH-PUN-000013', 'CIT-005', 'Ramesh Bhosale', 'KH-8A-1005', 'Sole Owner', 100, 'Verified'),
('OWN-018', 'ULPIN-MH-PUN-000014', 'CIT-005', 'Ramesh Bhosale', 'KH-8A-1005', 'Sole Owner', 100, 'Verified'),
('OWN-019', 'ULPIN-MH-PUN-000015', 'CIT-008', 'Meena Pawar', 'KH-8A-1008', 'Sole Owner', 100, 'Verified'),
('OWN-020', 'ULPIN-MH-PUN-000016', 'CIT-008', 'Meena Pawar', 'KH-8A-1008', 'Joint Co-Sharer', 50, 'Verified'),
('OWN-021', 'ULPIN-MH-PUN-000016', 'CIT-005', 'Ramesh Bhosale', 'KH-8A-1005', 'Joint Co-Sharer', 50, 'Verified'),
('OWN-022', 'ULPIN-MH-PUN-000017', 'CIT-003', 'Rajesh Gaikwad', 'KH-8A-1003', 'Sole Owner', 100, 'Verified'),
('OWN-023', 'ULPIN-MH-PUN-000018', 'CIT-003', 'Rajesh Gaikwad', 'KH-8A-1003', 'Sole Owner', 100, 'Verified'),
('OWN-024', 'ULPIN-MH-PUN-000019', 'CIT-003', 'Rajesh Gaikwad', 'KH-8A-1003', 'Sole Owner', 100, 'Verified'),
('OWN-025', 'ULPIN-MH-PUN-000020', 'CIT-008', 'Meena Pawar', 'KH-8A-1008', 'Recorded Holder', 100, 'Verified'),
('OWN-026', 'ULPIN-MH-PUN-000021', 'CIT-006', 'Ananya Deshmukh', 'KH-8A-1006', 'Sole Owner', 100, 'Verified'),
('OWN-027', 'ULPIN-MH-PUN-000022', 'CIT-006', 'Ananya Deshmukh', 'KH-8A-1006', 'Sole Owner', 100, 'Verified'),
('OWN-028', 'ULPIN-MH-PUN-000023', 'CIT-010', 'Kavita More', 'KH-8A-1010', 'Litigant Shareholder', 60, 'Verified'),
('OWN-029', 'ULPIN-MH-PUN-000024', 'CIT-010', 'Kavita More', 'KH-8A-1010', 'Applicant in Possession', 100, 'Verified'),
('OWN-030', 'ULPIN-MH-PUN-000025', 'CIT-010', 'Kavita More', 'KH-8A-1010', 'Khatedar', 100, 'Verified'),
('OWN-031', 'ULPIN-MH-NSK-000026', 'CIT-011', 'Ganesh Sonawane', 'KH-8A-2001', 'Sole Owner', 100, 'Verified'),
('OWN-032', 'ULPIN-MH-NSK-000027', 'CIT-012', 'Dhananjay Ahire', 'KH-8A-2002', 'Sole Owner', 100, 'Verified'),
('OWN-033', 'ULPIN-RJ-JPR-000028', 'CIT-013', 'Mahendra Singh Shekhawat', 'KH-RJ-3001', 'Khatedar', 100, 'Verified'),
('OWN-034', 'ULPIN-RJ-JPR-000029', 'CIT-014', 'Rohit Sharma', 'KH-RJ-3002', 'Joint Co-Sharer', 60, 'Verified'),
('OWN-035', 'ULPIN-RJ-JPR-000029', 'CIT-015', 'Anil Sharma', 'KH-RJ-3003', 'Joint Co-Sharer', 40, 'Verified'),
('OWN-036', 'ULPIN-RJ-JPR-000030', 'CIT-016', 'Devendra Meena', 'KH-RJ-3004', 'Recorded Holder', 100, 'Verified'),
('OWN-037', 'ULPIN-RJ-UDP-000031', 'CIT-017', 'Bhawani Singh Sisodia', 'KH-RJ-4001', 'Sole Owner', 100, 'Verified')
ON CONFLICT (id) DO UPDATE SET share = EXCLUDED.share;

-- Encumbrances
INSERT INTO encumbrances (id, parcel_ulpin, type, bank_name, amount, registered_date, status, discharge_date, remarks) VALUES
('ENC-001', 'ULPIN-MH-PUN-000003', NULL, 'State Bank of India', NULL, NULL, 'ACTIVE', NULL, NULL),
('ENC-002', 'ULPIN-MH-PUN-000003', NULL, 'Bank of Baroda', NULL, NULL, 'ACTIVE', NULL, NULL),
('ENC-003', 'ULPIN-MH-PUN-000007', NULL, 'Bank of Maharashtra', NULL, NULL, 'ACTIVE', NULL, NULL),
('ENC-004', 'ULPIN-MH-PUN-000011', NULL, 'Canara Bank', NULL, NULL, 'ACTIVE', NULL, NULL),
('ENC-005', 'ULPIN-MH-PUN-000015', NULL, 'HDFC Bank', NULL, NULL, 'ACTIVE', NULL, NULL),
('ENC-006', 'ULPIN-MH-PUN-000019', NULL, 'ICICI Bank Ltd', NULL, NULL, 'ACTIVE', NULL, NULL),
('ENC-007', 'ULPIN-MH-PUN-000001', NULL, 'Pune District Central Co-op Bank', NULL, NULL, 'SATISFIED', NULL, NULL),
('ENC-008', 'ULPIN-MH-PUN-000005', NULL, 'Union Bank of India', NULL, NULL, 'SATISFIED', NULL, NULL),
('ENC-009', 'ULPIN-MH-PUN-000013', NULL, 'Maharashtra Gramin Bank', NULL, NULL, 'SATISFIED', NULL, NULL),
('ENC-010', 'ULPIN-MH-PUN-000021', NULL, 'State Bank of India', NULL, NULL, 'SATISFIED', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Restrictions
INSERT INTO restrictions (id, parcel_ulpin, type, title, authority, notification_number, notification_date, description, status) VALUES
('RES-001', 'ULPIN-MH-PUN-000004', 'Section 36A MLRC', NULL, 'Collector Office Pune', NULL, NULL, NULL, 'ACTIVE'),
('RES-002', 'ULPIN-MH-PUN-000012', 'Irrigation Canal Buffer', NULL, 'Maharashtra Water Resources Dept', NULL, NULL, NULL, 'ACTIVE'),
('RES-003', 'ULPIN-MH-PUN-000020', 'Eco-Sensitive Forest Zone', NULL, 'Ministry of Environment, Forest and Climate Change (MoEFCC)', NULL, NULL, NULL, 'ACTIVE'),
('RES-004', 'ULPIN-MH-PUN-000008', 'Revenue Injunction', NULL, 'Sub-Divisional Officer (SDO) Haveli', NULL, NULL, NULL, 'ACTIVE'),
('RES-005', 'ULPIN-MH-PUN-000016', 'Interim Stay on Alienation', NULL, 'Tehsildar Mulshi', NULL, NULL, NULL, 'ACTIVE'),
('RES-006', 'ULPIN-MH-PUN-000023', 'Civil Court Lis Pendens', NULL, 'Civil Judge Senior Division Pune', NULL, NULL, NULL, 'ACTIVE'),
('RES-007', 'ULPIN-MH-PUN-000003', 'Statutory Charge Notice', NULL, 'Sub-Registrar Haveli 5', NULL, NULL, NULL, 'ACTIVE'),
('RES-008', 'ULPIN-MH-PUN-000007', 'Industrial Land Use Covenant', NULL, 'MIDC / Town Planning', NULL, NULL, NULL, 'ACTIVE'),
('RES-009', 'ULPIN-MH-PUN-000011', 'Commercial Mortgage Lien', NULL, 'Sub-Registrar Haveli 5', NULL, NULL, NULL, 'ACTIVE'),
('RES-010', 'ULPIN-MH-PUN-000015', 'Warehouse Zoning Restriction', NULL, 'PMRDA Planning Cell', NULL, NULL, NULL, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Zoning
INSERT INTO zoning (id, parcel_ulpin, master_plan, current_zone, permissible_uses, max_fsi, road_width_meters, authority) VALUES
('ZON-001', 'ULPIN-MH-PUN-000001', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-002', 'ULPIN-MH-PUN-000002', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMC / PMRDA'),
('ZON-003', 'ULPIN-MH-PUN-000003', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMC / PMRDA'),
('ZON-004', 'ULPIN-MH-PUN-000004', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-005', 'ULPIN-MH-PUN-000005', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMC'),
('ZON-006', 'ULPIN-MH-PUN-000006', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMC'),
('ZON-007', 'ULPIN-MH-PUN-000007', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-008', 'ULPIN-MH-PUN-000008', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMC'),
('ZON-009', 'ULPIN-MH-PUN-000009', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-010', 'ULPIN-MH-PUN-000010', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-011', 'ULPIN-MH-PUN-000011', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-012', 'ULPIN-MH-PUN-000012', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-013', 'ULPIN-MH-PUN-000013', NULL, NULL, '[]'::jsonb, NULL, NULL, 'PMRDA'),
('ZON-014', 'ULPIN-MH-PUN-000017', NULL, NULL, '[]'::jsonb, NULL, NULL, 'MIDC / PMRDA'),
('ZON-015', 'ULPIN-MH-PUN-000021', NULL, NULL, '[]'::jsonb, NULL, NULL, 'Talegaon Dabhade M.C.')
ON CONFLICT (id) DO NOTHING;

-- Tax Records
INSERT INTO tax_records (id, parcel_ulpin, assessment_year, annual_tax, pending_dues, last_paid_date, receipt_number, payment_status) VALUES
('TAX-001', 'ULPIN-MH-PUN-000001', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-881', 'PAID'),
('TAX-002', 'ULPIN-MH-PUN-000002', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-882', 'PAID'),
('TAX-003', 'ULPIN-MH-PUN-000003', NULL, NULL, NULL, NULL, NULL, 'UNPAID'),
('TAX-004', 'ULPIN-MH-PUN-000004', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-883', 'PAID'),
('TAX-005', 'ULPIN-MH-PUN-000005', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-884', 'PAID'),
('TAX-006', 'ULPIN-MH-PUN-000006', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-885', 'PAID'),
('TAX-007', 'ULPIN-MH-PUN-000007', NULL, NULL, NULL, NULL, NULL, 'UNPAID'),
('TAX-008', 'ULPIN-MH-PUN-000008', NULL, NULL, NULL, NULL, NULL, 'UNPAID'),
('TAX-009', 'ULPIN-MH-PUN-000009', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-886', 'PAID'),
('TAX-010', 'ULPIN-MH-PUN-000010', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-887', 'PAID'),
('TAX-011', 'ULPIN-MH-PUN-000011', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-888', 'PAID'),
('TAX-012', 'ULPIN-MH-PUN-000012', NULL, NULL, NULL, NULL, 'GOV-EXEMPT-01', 'EXEMPT'),
('TAX-013', 'ULPIN-MH-PUN-000013', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-889', 'PAID'),
('TAX-014', 'ULPIN-MH-PUN-000014', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-890', 'PAID'),
('TAX-015', 'ULPIN-MH-PUN-000015', NULL, NULL, NULL, NULL, NULL, 'UNPAID'),
('TAX-016', 'ULPIN-MH-PUN-000016', NULL, NULL, NULL, NULL, NULL, 'UNPAID'),
('TAX-017', 'ULPIN-MH-PUN-000017', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-891', 'PAID'),
('TAX-018', 'ULPIN-MH-PUN-000018', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-892', 'PAID'),
('TAX-019', 'ULPIN-MH-PUN-000019', NULL, NULL, NULL, NULL, NULL, 'UNPAID'),
('TAX-020', 'ULPIN-MH-PUN-000021', NULL, NULL, NULL, NULL, 'MHPUN-REV-2024-893', 'PAID')
ON CONFLICT (id) DO NOTHING;

-- Court Cases
INSERT INTO court_cases (id, parcel_ulpin, case_number, court_name, case_type, petitioner, respondent, filing_date, next_hearing_date, status, stay_granted, order_summary) VALUES
('CASE-001', 'ULPIN-MH-PUN-000008', 'SCS/342/2023', 'Civil Court Senior Division Pune', 'Partition & Injunction Suit', 'Rajesh Gaikwad vs Suresh Chavan & Others', NULL, '2023-05-12', NULL, 'PENDING', FALSE, NULL),
('CASE-002', 'ULPIN-MH-PUN-000008', 'RTS/REV/112/2024', 'Sub-Divisional Officer (Revenue) Haveli', 'Revenue Appeal under Sec 247 MLRC', 'Rajesh Gaikwad vs State of Maharashtra', NULL, '2024-02-18', NULL, 'PENDING', FALSE, NULL),
('CASE-003', 'ULPIN-MH-PUN-000016', 'BND/DISP/45/2024', 'Tehsildar & Mamlatdar Court Mulshi', 'Mamlatdars'' Courts Act Boundary dispute', 'Meena Pawar vs Ramesh Bhosale', NULL, '2024-07-04', NULL, 'PENDING', FALSE, NULL),
('CASE-004', 'ULPIN-MH-PUN-000023', 'RCS/1098/2022', 'Civil Court Junior Division Vadgaon Mawal', 'Declaration of Title & Perpetual Injunction', 'Kavita More vs Balwant More', NULL, '2022-11-20', NULL, 'PENDING', FALSE, NULL),
('CASE-005', 'ULPIN-MH-PUN-000001', 'SCS/211/2018', 'Civil Court Senior Division Pune', 'Partition Suit', 'Aarav Patil vs Laxman Patil', NULL, '2018-03-15', NULL, 'DISPOSED', FALSE, NULL),
('CASE-006', 'ULPIN-MH-PUN-000005', 'TEN/70B/2019', 'Agricultural Lands Tribunal Haveli', 'Sec 70B Tenancy Determination', 'Sunita Kulkarni vs State', NULL, '2019-06-12', NULL, 'DISPOSED', FALSE, NULL),
('CASE-007', 'ULPIN-MH-PUN-000013', 'MCA/89/2020', 'District Court Pune', 'Land Acquisition Compensation Reference', 'Ramesh Bhosale vs Road Authority', NULL, '2020-04-10', NULL, 'DISPOSED', FALSE, NULL),
('CASE-008', 'ULPIN-MH-PUN-000021', 'RTS/APPEAL/78/2021', 'Sub-Divisional Officer Mawal', 'e-Ferfar Mutation Rejection Appeal', 'Ananya Deshmukh vs Mandal Adhikari', NULL, '2021-08-25', NULL, 'DISPOSED', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Parcel Documents
INSERT INTO parcel_documents (id, parcel_ulpin, title, type, file_name, file_size, issue_date, authority, verification_hash) VALUES
('PDOC-001', 'ULPIN-MH-PUN-000001', 'Digital Form 7/12 Extract (Adhikar Abhilekh)', 'Form 7/12', NULL, '245 KB', NULL, NULL, NULL),
('PDOC-002', 'ULPIN-MH-PUN-000001', 'Form 8A Khate Pustika Extract', 'Form 8A', NULL, '180 KB', NULL, NULL, NULL),
('PDOC-003', 'ULPIN-MH-PUN-000001', 'Cadastral Village Map (Tippan / Nakasha)', 'Map', NULL, '1.2 MB', NULL, NULL, NULL),
('PDOC-004', 'ULPIN-MH-PUN-000002', 'Form 7/12 Non-Agricultural Extract', 'Form 7/12', NULL, '260 KB', NULL, NULL, NULL),
('PDOC-005', 'ULPIN-MH-PUN-000002', 'City Survey Property Card (Malmatta Patrak)', 'Property Card', NULL, '310 KB', NULL, NULL, NULL),
('PDOC-006', 'ULPIN-MH-PUN-000002', 'Sanctioned NA Conversion Order', 'NA Order', NULL, '420 KB', NULL, NULL, NULL),
('PDOC-007', 'ULPIN-MH-PUN-000003', 'Form 7/12 with Bank Encumbrance Note', 'Form 7/12', NULL, '290 KB', NULL, NULL, NULL),
('PDOC-008', 'ULPIN-MH-PUN-000003', 'Registered Simple Mortgage Deed (CERSAI)', 'Mortgage Deed', NULL, '1.8 MB', NULL, NULL, NULL),
('PDOC-009', 'ULPIN-MH-PUN-000004', 'Form 7/12 Tribal Notification 36A Note', 'Form 7/12', NULL, '230 KB', NULL, NULL, NULL),
('PDOC-010', 'ULPIN-MH-PUN-000005', 'Form 7/12 Residential NA Extract', 'Form 7/12', NULL, '250 KB', NULL, NULL, NULL),
('PDOC-011', 'ULPIN-MH-PUN-000005', 'Form 8A Holding Certificate', 'Form 8A', NULL, '175 KB', NULL, NULL, NULL),
('PDOC-012', 'ULPIN-MH-PUN-000006', 'Form 7/12 Agricultural Extract', 'Form 7/12', NULL, '220 KB', NULL, NULL, NULL),
('PDOC-013', 'ULPIN-MH-PUN-000007', 'Form 7/12 Industrial Extract', 'Form 7/12', NULL, '270 KB', NULL, NULL, NULL),
('PDOC-014', 'ULPIN-MH-PUN-000008', 'Form 7/12 with Pending Litigation Note', 'Form 7/12', NULL, '310 KB', NULL, NULL, NULL),
('PDOC-015', 'ULPIN-MH-PUN-000008', 'Civil Court Stay Order Certified Copy', 'Court Order', NULL, '580 KB', NULL, NULL, NULL),
('PDOC-016', 'ULPIN-MH-PUN-000009', 'Form 7/12 Agricultural Bagayat', 'Form 7/12', NULL, '235 KB', NULL, NULL, NULL),
('PDOC-017', 'ULPIN-MH-PUN-000010', 'Form 7/12 Residential NA Extract', 'Form 7/12', NULL, '240 KB', NULL, NULL, NULL),
('PDOC-018', 'ULPIN-MH-PUN-000011', 'Form 7/12 Commercial Extract', 'Form 7/12', NULL, '285 KB', NULL, NULL, NULL),
('PDOC-019', 'ULPIN-MH-PUN-000012', 'Irrigation Department Notification Order', 'Government Order', NULL, '490 KB', NULL, NULL, NULL),
('PDOC-020', 'ULPIN-MH-PUN-000013', 'Form 7/12 Agricultural Jirayat', 'Form 7/12', NULL, '210 KB', NULL, NULL, NULL),
('PDOC-021', 'ULPIN-MH-PUN-000014', 'MIDC Area Clearance Certificate', 'NOC', NULL, '360 KB', NULL, NULL, NULL),
('PDOC-022', 'ULPIN-MH-PUN-000015', 'Form 7/12 Warehouse Land Record', 'Form 7/12', NULL, '295 KB', NULL, NULL, NULL),
('PDOC-023', 'ULPIN-MH-PUN-000016', 'e-Mojani Measurement Sheet (Gat Map)', 'Mojani Sheet', NULL, '1.5 MB', NULL, NULL, NULL),
('PDOC-024', 'ULPIN-MH-PUN-000017', 'Special Planning Authority (MIDC) Lease Deed', 'Lease Deed', NULL, '2.2 MB', NULL, NULL, NULL),
('PDOC-025', 'ULPIN-MH-PUN-000018', 'Form 7/12 Residential Township', 'Form 7/12', NULL, '260 KB', NULL, NULL, NULL),
('PDOC-026', 'ULPIN-MH-PUN-000019', 'CERSAI Hypothecation Certificate', 'CERSAI Certificate', NULL, '320 KB', NULL, NULL, NULL),
('PDOC-027', 'ULPIN-MH-PUN-000020', 'MoEFCC Eco-Sensitive Zone Notification', 'Gazette Notification', NULL, '680 KB', NULL, NULL, NULL),
('PDOC-028', 'ULPIN-MH-PUN-000021', 'Form 7/12 Talegaon Agricultural', 'Form 7/12', NULL, '225 KB', NULL, NULL, NULL),
('PDOC-029', 'ULPIN-MH-PUN-000022', 'Talegaon Municipal Sanctioned Layout', 'Layout Order', NULL, '1.1 MB', NULL, NULL, NULL),
('PDOC-030', 'ULPIN-MH-PUN-000023', 'Form 7/12 Disputed Title Extract', 'Form 7/12', NULL, '310 KB', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Mutations
INSERT INTO mutations (id, mutation_number, parcel_ulpin, type, applicant_id, applicant_name, buyer_name, seller_name, status, applied_date, sla_days, sla_deadline, current_step, total_steps, remarks, tehsil_code, village_code) VALUES
('MUT-001', 'FERFAR-2025-0101', 'ULPIN-MH-PUN-000001', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-002', 'FERFAR-2025-0102', 'ULPIN-MH-PUN-000002', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-003', 'FERFAR-2025-0103', 'ULPIN-MH-PUN-000003', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-004', 'FERFAR-2025-0104', 'ULPIN-MH-PUN-000005', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-005', 'FERFAR-2025-0105', 'ULPIN-MH-PUN-000006', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-006', 'FERFAR-2025-0106', 'ULPIN-MH-PUN-000007', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-007', 'FERFAR-2025-0107', 'ULPIN-MH-PUN-000008', NULL, NULL, NULL, NULL, NULL, 'REJECTED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-008', 'FERFAR-2025-0108', 'ULPIN-MH-PUN-000009', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-009', 'FERFAR-2025-0109', 'ULPIN-MH-PUN-000010', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-010', 'FERFAR-2025-0110', 'ULPIN-MH-PUN-000013', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-011', 'FERFAR-2025-0111', 'ULPIN-MH-PUN-000015', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-012', 'FERFAR-2025-0112', 'ULPIN-MH-PUN-000017', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-013', 'FERFAR-2025-0113', 'ULPIN-MH-PUN-000021', NULL, NULL, NULL, NULL, NULL, 'APPROVED', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-014', 'FERFAR-2025-0114', 'ULPIN-MH-PUN-000024', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, 30, NULL, 1, 6, NULL, NULL, NULL),
('MUT-015', 'FERFAR-2025-0115', 'ULPIN-MH-PUN-000025', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, 30, NULL, 1, 6, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Mutation Timeline Steps
INSERT INTO mutation_timeline (id, mutation_id, step_number, title, description, completed, active, completed_at, officer_name, officer_role) VALUES
('STEP-MUT-001-1', 'MUT-001', 1, 'SRO Deed Registration & Stamp Duty Verification', 'Registered Sale Deed No 4122/2025 verified by SRO Haveli. Ready Reckoner valuation ₹87,00,000, 6% Stamp Duty (₹5,22,000) & 1% Reg Fee verified.', FALSE, FALSE, NULL, 'e-Registration SRO (Mahesh Patil)', NULL),
('STEP-MUT-001-2', 'MUT-001', 2, 'Pencil Entry (कच्ची नोंद) in Form 6 Register', 'Talathi recorded provisional pencil entry No 101 in Village Chavadi register (गाव नमुना ६).', FALSE, FALSE, NULL, 'GOV-002 (Prakash Shinde - Talathi)', NULL),
('STEP-MUT-001-3', 'MUT-001', 3, 'Talathi Physical Ground Visit & GPS Photo Panchnama', 'Talathi visited Gat 42, took 4 geo-tagged site photographs with live GPS (18.5793°N, 73.9812°E), verified boundary pegs (शेव), and recorded panchnama with adjoining landholders.', FALSE, FALSE, NULL, 'Talathi Office Wagholi', NULL),
('STEP-MUT-001-4', 'MUT-001', 4, 'Form 135D Statutory Public Notice Issued', '15-day statutory objection notice served to all recorded co-sharers, adjoining owners, and Gram Panchayat notice board.', FALSE, FALSE, NULL, 'Revenue Department Portal', NULL),
('STEP-MUT-001-5', 'MUT-001', 5, 'Objection Window Period Ended (Zero Objections)', 'Zero objections received during the mandatory 15-day statutory window. Talathi submitted formal recommendation dossier.', FALSE, FALSE, NULL, 'Talathi Wagholi', NULL),
('STEP-MUT-001-6', 'MUT-001', 6, 'Tehsildar Statutory Sanction Order (Class-3 DSC)', 'Tehsildar Sanjay Deshmukh verified deed, Talathi report, and title audit. Signed statutory order using Class-3 DSC USB token.', FALSE, FALSE, NULL, 'GOV-001 (Sanjay Deshmukh - Tehsildar)', NULL),
('STEP-MUT-001-7', 'MUT-001', 7, 'MahaBhulekh 7/12 RoR & 8A Extract Finalized', 'Pencil entry converted into permanent record (पक्की नोंद). Digital 7/12 RoR updated and pushed to Citizen DigiLocker.', FALSE, FALSE, NULL, 'e-Mahabhumi System', NULL),
('STEP-MUT-005-1', 'MUT-005', 1, 'SRO Release Deed Registration & Stamp Duty Paid', 'Registered Release Deed submitted by Suresh Chavan at SRO Haveli. Article 52 family release stamp duty ₹500 verified.', FALSE, FALSE, NULL, 'Sub-Registrar Office', NULL),
('STEP-MUT-005-2', 'MUT-005', 2, 'Pencil Entry Form 6 Generated', 'Provisional entry No 182 created in e-Ferfar register by Talathi Lohegaon.', FALSE, FALSE, NULL, 'GOV-003 (Nitin Kulkarni - Talathi)', NULL),
('STEP-MUT-005-3', 'MUT-005', 3, 'Talathi Field Inspection & Boundary Verification', 'Talathi conducted ground visit, took geotagged parcel photos, and verified co-parcener consent.', FALSE, FALSE, NULL, 'Talathi Lohegaon', NULL),
('STEP-MUT-005-4', 'MUT-005', 4, 'Notice Period Form 135D Active', 'Notice active. 15 days statutory objection window expires on 2025-03-04.', FALSE, FALSE, NULL, 'Revenue System', NULL),
('STEP-MUT-005-5', 'MUT-005', 5, 'Tehsildar Hearing & Sanction Order', 'Awaiting completion of statutory notice window before DSC sanction.', FALSE, FALSE, NULL, 'Tehsildar Haveli', NULL)
ON CONFLICT (id) DO NOTHING;

-- SRO Registration Audits
INSERT INTO sro_audits (id, deed_number, parcel_ulpin, sro_code, registration_date, buyer_name, seller_name, valuation_amount, stamp_duty_paid, status, flags) VALUES
('AUDIT-2026-0881', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CLEARED_FOR_REGISTRATION', '[]'::jsonb),
('AUDIT-2026-0882', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CLEARED_FOR_REGISTRATION', '[]'::jsonb),
('AUDIT-2026-0883', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'HALTED_RESTRICTED', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Application Types
INSERT INTO application_types (code, title, category, description, fee, processing_time, required_documents) VALUES
(NULL, 'Digitally Signed 7/12 Extract', NULL, NULL, 15, NULL, '[]'::jsonb),
(NULL, 'Digitally Signed 8A Holding', NULL, NULL, 15, NULL, '[]'::jsonb),
(NULL, 'City Survey Property Card', NULL, NULL, 25, NULL, '[]'::jsonb),
(NULL, 'e-Ferfar Mutation Request', NULL, NULL, 100, NULL, '[]'::jsonb),
(NULL, 'Heirship (Waras) Mutation', NULL, NULL, 50, NULL, '[]'::jsonb),
(NULL, 'Family Partition Mutation', NULL, NULL, 100, NULL, '[]'::jsonb),
(NULL, 'Bank Lien Removal (Boja Kami)', NULL, NULL, 50, NULL, '[]'::jsonb),
(NULL, 'Cadastral Boundary Measurement', NULL, NULL, 1000, NULL, '[]'::jsonb),
(NULL, 'Certified Copy of Ferfar', NULL, NULL, 20, NULL, '[]'::jsonb),
(NULL, 'Non-Agricultural Conversion NOC', NULL, NULL, 500, NULL, '[]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- Applications
INSERT INTO applications (id, application_number, type_code, citizen_id, parcel_ulpin, status, submission_date, fee_amount, payment_status, tracking_history, form_data) VALUES
('APP-001', NULL, NULL, 'CIT-001', 'ULPIN-MH-PUN-000001', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-002', NULL, NULL, 'CIT-001', 'ULPIN-MH-PUN-000001', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-003', NULL, NULL, 'CIT-001', 'ULPIN-MH-PUN-000002', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-004', NULL, NULL, 'CIT-002', 'ULPIN-MH-PUN-000003', 'PENDING', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-005', NULL, NULL, 'CIT-002', 'ULPIN-MH-PUN-000005', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-006', NULL, NULL, 'CIT-003', 'ULPIN-MH-PUN-000008', 'REJECTED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-007', NULL, NULL, 'CIT-003', 'ULPIN-MH-PUN-000017', 'IN_PROGRESS', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-008', NULL, NULL, 'CIT-004', 'ULPIN-MH-PUN-000009', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-009', NULL, NULL, 'CIT-004', 'ULPIN-MH-PUN-000010', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-010', NULL, NULL, 'CIT-005', 'ULPIN-MH-PUN-000013', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-011', NULL, NULL, 'CIT-005', 'ULPIN-MH-PUN-000014', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-012', NULL, NULL, 'CIT-006', 'ULPIN-MH-PUN-000021', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-013', NULL, NULL, 'CIT-006', 'ULPIN-MH-PUN-000022', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-014', NULL, NULL, 'CIT-007', 'ULPIN-MH-PUN-000011', 'PENDING', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-015', NULL, NULL, 'CIT-008', 'ULPIN-MH-PUN-000015', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-016', NULL, NULL, 'CIT-008', 'ULPIN-MH-PUN-000016', 'IN_PROGRESS', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-017', NULL, NULL, 'CIT-009', 'ULPIN-MH-PUN-000006', 'IN_PROGRESS', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-018', NULL, NULL, 'CIT-009', 'ULPIN-MH-PUN-000007', 'APPROVED', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-019', NULL, NULL, 'CIT-010', 'ULPIN-MH-PUN-000024', 'PENDING', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb),
('APP-020', NULL, NULL, 'CIT-010', 'ULPIN-MH-PUN-000025', 'PENDING', NULL, 0, 'PAID', '[]'::jsonb, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Issued Documents
INSERT INTO documents (id, user_id, parcel_ulpin, title, type, certificate_number, issued_by, issue_date, file_url, verification_hash, valid_until) VALUES
('DOC-001', 'CIT-001', 'ULPIN-MH-PUN-000001', '7/12 Extract - Wagholi Gat 42', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-002', 'CIT-001', 'ULPIN-MH-PUN-000001', 'Form 8A Holding Certificate', '8A Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-003', 'CIT-001', 'ULPIN-MH-PUN-000002', 'Property Card - CTS-WAG-102', 'Property Card', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-004', 'CIT-001', 'ULPIN-MH-PUN-000001', 'Challan Receipt 7/12 Download', 'Payment Receipt', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-005', 'CIT-002', 'ULPIN-MH-PUN-000003', 'Form 7/12 Wagholi Commercial Plot', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-006', 'CIT-002', 'ULPIN-MH-PUN-000005', '7/12 Lohegaon Residential Gat 78', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-007', 'CIT-002', 'ULPIN-MH-PUN-000005', 'Form 8A Khata Certificate', '8A Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-008', 'CIT-003', 'ULPIN-MH-PUN-000008', '7/12 Lohegaon Disputed Holding', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-009', 'CIT-003', 'ULPIN-MH-PUN-000017', 'MIDC Land Allotment Order', 'Government Order', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-010', 'CIT-003', 'ULPIN-MH-PUN-000018', '7/12 Hinjawadi Residential', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-011', 'CIT-004', 'ULPIN-MH-PUN-000009', '7/12 Manjri Khurd Gat 15', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-012', 'CIT-004', 'ULPIN-MH-PUN-000010', '7/12 Manjri Khurd Residential', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-013', 'CIT-004', 'ULPIN-MH-PUN-000009', 'Sanctioned Ferfar Patrak Extract', 'Ferfar Copy', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-014', 'CIT-005', 'ULPIN-MH-PUN-000013', '7/12 Pirangut Agricultural Gat 61', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-015', 'CIT-005', 'ULPIN-MH-PUN-000014', 'MIDC Boundary Demarcation Map', 'Map', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-016', 'CIT-005', 'ULPIN-MH-PUN-000013', 'Waras Certificate issued by Tehsildar', 'Legal Heir Certificate', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-017', 'CIT-006', 'ULPIN-MH-PUN-000021', '7/12 Talegaon Dabhade Gat 12', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-018', 'CIT-006', 'ULPIN-MH-PUN-000022', '7/12 Talegaon Residential Layout', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-019', 'CIT-006', 'ULPIN-MH-PUN-000021', 'Partition Deed Registered Copy', 'Deed', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-020', 'CIT-007', 'ULPIN-MH-PUN-000004', '7/12 Tribal Occupancy Record', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-021', 'CIT-007', 'ULPIN-MH-PUN-000011', '7/12 Commercial Manjri Khurd', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-022', 'CIT-008', 'ULPIN-MH-PUN-000015', '7/12 Pirangut Warehouse Land', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-023', 'CIT-008', 'ULPIN-MH-PUN-000016', '7/12 Disputed Agricultural Plot', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-024', 'CIT-008', 'ULPIN-MH-PUN-000020', 'Eco-Sensitive Notification Extract', 'Gazette Order', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-025', 'CIT-009', 'ULPIN-MH-PUN-000006', '7/12 Lohegaon Agricultural Bagayat', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-026', 'CIT-009', 'ULPIN-MH-PUN-000007', '7/12 Lohegaon Industrial Plot', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-027', 'CIT-009', 'ULPIN-MH-PUN-000007', 'CERSAI Search Report Certificate', 'Encumbrance Report', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-028', 'CIT-010', 'ULPIN-MH-PUN-000024', '7/12 Talegaon Verification Record', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-029', 'CIT-010', 'ULPIN-MH-PUN-000025', 'e-Mojani ETS Survey Sheet', 'Survey Map', NULL, NULL, NULL, NULL, NULL, NULL),
('DOC-030', 'CIT-010', 'ULPIN-MH-PUN-000023', '7/12 Talegaon Civil Suit Disputed Record', '7/12 Extract', NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Grievances
INSERT INTO grievances (id, grievance_number, citizen_id, parcel_ulpin, category, subject, description, status, filed_date, department_code, resolution_notes, resolved_at) VALUES
('GRV-001', NULL, 'CIT-001', 'ULPIN-MH-PUN-000001', 'Delayed Mutation', 'Delay in formal 7/12 updation after sale deed registration', NULL, 'RESOLVED', NULL, NULL, NULL, NULL),
('GRV-002', NULL, 'CIT-002', 'ULPIN-MH-PUN-000003', 'Incorrect Encumbrance', 'Bank charge amount wrongly printed in Itar Hakka column', NULL, 'IN_PROGRESS', NULL, NULL, NULL, NULL),
('GRV-003', NULL, 'CIT-003', 'ULPIN-MH-PUN-000008', 'Unauthorized Pencil Entry', 'Provisional pencil entry made without notice to co-sharer', NULL, 'RESOLVED', NULL, NULL, NULL, NULL),
('GRV-004', NULL, 'CIT-004', 'ULPIN-MH-PUN-000009', 'Typographical Spelling Error', 'Spelling mistake in owner''s middle name on 7/12 extract', NULL, 'RESOLVED', NULL, NULL, NULL, NULL),
('GRV-005', NULL, 'CIT-005', 'ULPIN-MH-PUN-000013', 'Delay in Heirship Sanction', 'Waras application pending over 45 days at Mandal Adhikari level', NULL, 'RESOLVED', NULL, NULL, NULL, NULL),
('GRV-006', NULL, 'CIT-006', 'ULPIN-MH-PUN-000021', 'Area Discrepancy', 'Difference of 0.05 Hectare between Gat Book and e-Mojani map', NULL, 'IN_PROGRESS', NULL, NULL, NULL, NULL),
('GRV-007', NULL, 'CIT-007', 'ULPIN-MH-PUN-000011', 'Failure to Release Bank Lien', 'Bank issued NOC but Boja not removed from 7/12 portal', NULL, 'PENDING', NULL, NULL, NULL, NULL),
('GRV-008', NULL, 'CIT-008', 'ULPIN-MH-PUN-000016', 'Encroachment on Boundaries', 'Adjoining owner encroaching on survey boundary line', NULL, 'IN_PROGRESS', NULL, NULL, NULL, NULL),
('GRV-009', NULL, 'CIT-009', 'ULPIN-MH-PUN-000006', 'Portal Payment Failure', 'Amount debited but certified 7/12 PDF not downloaded', NULL, 'RESOLVED', NULL, NULL, NULL, NULL),
('GRV-010', NULL, 'CIT-010', 'ULPIN-MH-PUN-000024', 'ULPIN Mapping Error', 'GIS map polygon showing wrong survey number overlay', NULL, 'IN_PROGRESS', NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_link, created_at) VALUES
('NOTIF-001', 'CIT-001', '7/12 Extract Ready', 'Your digitally signed 7/12 extract for ULPIN-MH-PUN-000001 is ready for download.', 'DOCUMENT', TRUE, NULL, NULL),
('NOTIF-002', 'CIT-001', 'e-Ferfar Mutation Approved', 'Mutation FERFAR-2025-0101 for Gat 42 Wagholi has been sanctioned by Circle Officer.', 'MUTATION', TRUE, NULL, NULL),
('NOTIF-003', 'CIT-001', 'Property Card Issued', 'Property Card for CTS-WAG-102 has been generated successfully.', 'DOCUMENT', FALSE, NULL, NULL),
('NOTIF-004', 'CIT-002', 'Bank Lien Registered', 'Notice: Simple mortgage charge by State Bank of India entered in Form 7/12.', 'SECURITY', TRUE, NULL, NULL),
('NOTIF-005', 'CIT-002', 'Annual Land Revenue Due', 'Annual Akar tax of ₹6,200 for Lohegaon Gat 78 is due for current fiscal year.', 'TAX', FALSE, NULL, NULL),
('NOTIF-006', 'CIT-003', 'Court Notice Update', 'Next hearing in SCS/342/2023 scheduled before Civil Court Senior Division on 10-Apr-2025.', 'COURT', TRUE, NULL, NULL),
('NOTIF-007', 'CIT-003', 'Cadastral Survey Scheduled', 'e-Mojani surveyor assigned for Hinjawadi plot measurement.', 'SURVEY', FALSE, NULL, NULL),
('NOTIF-008', 'CIT-004', 'Mutation Sanction Order Passed', 'Kharedi Khat mutation sanctioned for Gat 15 Manjri Khurd.', 'MUTATION', TRUE, NULL, NULL),
('NOTIF-009', 'CIT-004', 'Certified Copy Ready', 'Your certified copy of Ferfar Patrak is available for download.', 'DOCUMENT', FALSE, NULL, NULL),
('NOTIF-010', 'CIT-005', 'Heirship Verified', 'Family tree verification approved by Talathi for Pirangut parcel.', 'MUTATION', TRUE, NULL, NULL),
('NOTIF-011', 'CIT-005', 'NOC Issued', 'Revenue Clearance NOC has been signed by Tehsildar Mulshi.', 'DOCUMENT', FALSE, NULL, NULL),
('NOTIF-012', 'CIT-006', 'Partition Mutation Executed', 'Separate Form 7/12 created for your partitioned share in Gat 12.', 'MUTATION', TRUE, NULL, NULL),
('NOTIF-013', 'CIT-006', 'Layout Approval Notified', 'Municipal planning authority uploaded approved layout drawing.', 'ZONING', FALSE, NULL, NULL),
('NOTIF-014', 'CIT-007', 'Statutory Restriction Protected', 'Section 36A MLRC flag verified on tribal agricultural parcel.', 'SECURITY', TRUE, NULL, NULL),
('NOTIF-015', 'CIT-007', 'Lien Removal In Process', 'Application APP-014 for bank charge cancellation submitted to Talathi.', 'APPLICATION', FALSE, NULL, NULL),
('NOTIF-016', 'CIT-008', 'Cadastral Map Ready', 'High-res Tippan map for Pirangut Gat 74 generated.', 'DOCUMENT', TRUE, NULL, NULL),
('NOTIF-017', 'CIT-008', 'Boundary Demarcation Hearing', 'Mamlatdar Court issued spot inspection summons for 15-Mar-2025.', 'COURT', FALSE, NULL, NULL),
('NOTIF-018', 'CIT-009', 'Form 135D Notice Published', 'Public notice window for Release Deed mutation is now open.', 'MUTATION', TRUE, NULL, NULL),
('NOTIF-019', 'CIT-009', 'CERSAI Search Report Downloaded', 'Search report generated with verification key CER-9921.', 'DOCUMENT', FALSE, NULL, NULL),
('NOTIF-020', 'CIT-010', 'Verification Visit Scheduled', 'Talathi scheduled for spot inspection of Talegaon parcel on 28-Feb.', 'SURVEY', FALSE, NULL, NULL),
('NOTIF-021', 'GOV-001', 'Mutation Pending Sanction', 'Mutation FERFAR-2025-0105 completed notice period and awaits your sanction.', 'OFFICER_ACTION', FALSE, NULL, NULL),
('NOTIF-022', 'GOV-001', 'RTS Revision Appeal Filed', 'New appeal RTS/REV/112/2024 listed for preliminary hearing.', 'OFFICER_ACTION', FALSE, NULL, NULL),
('NOTIF-023', 'GOV-002', 'SRO e-Registration Event', 'Sale deed document pushed from Haveli SRO 5 for ULPIN-MH-PUN-000001.', 'OFFICER_ACTION', TRUE, NULL, NULL),
('NOTIF-024', 'GOV-002', 'Form 135D Notice Service', 'Confirm service of Form 135D notices to co-sharers in Wagholi.', 'OFFICER_ACTION', TRUE, NULL, NULL),
('NOTIF-025', 'GOV-003', 'Pencil Entry Form 6 Created', 'Pencil entry registered for release deed in Lohegaon.', 'OFFICER_ACTION', FALSE, NULL, NULL),
('NOTIF-026', 'GOV-004', 'Family Tree Verification', 'Complete inquiry for waras application in Pirangut.', 'OFFICER_ACTION', TRUE, NULL, NULL),
('NOTIF-027', 'GOV-005', 'Title Search Verification', 'Mortgage deed registration data verified and synced to NLRMP.', 'INTEGRATION', TRUE, NULL, NULL),
('NOTIF-028', 'GOV-006', 'Collectorate Compliance Report', 'Quarterly tribal land protection compliance report compiled for Pune district.', 'REPORT', TRUE, NULL, NULL),
('NOTIF-029', 'GOV-007', 'NLRMP Integration Sync Complete', 'All 14 Pune district tehsils synchronized with State Cadastral DB.', 'SYSTEM', FALSE, NULL, NULL),
('NOTIF-030', 'GOV-008', 'National ULPIN Seeding Milestone', 'Pune district achieved 94.8% ULPIN seeding across all cadastral parcels.', 'NATIONAL', FALSE, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Watchlist
INSERT INTO watchlist (id, citizen_id, parcel_ulpin, label, notify_mutations, notify_encumbrances, notify_court_cases, created_at) VALUES
('WCH-001', 'CIT-001', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.522Z'),
('WCH-002', 'CIT-001', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-003', 'CIT-002', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-004', 'CIT-003', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-005', 'CIT-004', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-006', 'CIT-005', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-007', 'CIT-006', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-008', 'CIT-007', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-009', 'CIT-008', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z'),
('WCH-010', 'CIT-009', NULL, NULL, TRUE, TRUE, TRUE, '2026-09-11T18:12:25.523Z')
ON CONFLICT (citizen_id, parcel_ulpin) DO NOTHING;

-- News & Announcements
INSERT INTO news (id, title, category, summary, content, published_date, source, tag) VALUES
('NEWS-001', 'ULPIN (Bhu-Aadhaar) Coverage Crosses 95% Nationally — 13.5 Crore Parcels Geo-Coded', 'DILRMP', 'Department of Land Resources confirms 28 states have achieved over 90% ULPIN seeding, with nationwide geo-coded parcel coverage at an all-time high.', NULL, '2025-02-15', NULL, NULL),
('NEWS-002', 'e-Courts Integration with Land Records Goes Live Across 18 States', 'Legal Technology', 'Civil Court stay orders and Lis Pendens will now automatically reflect in RoR within 24 hours of court filing through the National Judicial Data Grid.', NULL, '2025-02-10', NULL, NULL),
('NEWS-003', 'Rajasthan Completes Drone-Based Cadastral Re-Survey in 6 Districts', 'Survey & Mapping', 'Survey of India deploys high-resolution LiDAR drones in Udaipur, Ajmer, and 4 other districts to resolve agricultural boundary ambiguities under SVAMITVA.', NULL, '2025-02-01', NULL, NULL),
('NEWS-004', 'CERSAI Linkage Mandatory for All Land-Backed Loans — Double-Mortgage Fraud Drops 62%', 'Banking & Security', 'All scheduled commercial banks now verify parcel ULPIN status through CERSAI before sanctioning agricultural or commercial credit against land.', NULL, '2025-01-28', NULL, NULL),
('NEWS-005', 'Maharashtra Achieves 100% Digital Mutation — Paper-Free e-Ferfar Statewide', 'State Achievement', 'Maharashtra becomes the first state to process all mutation applications digitally with guaranteed 15-day turnaround under Right to Public Services.', NULL, '2025-01-20', NULL, NULL),
('NEWS-006', 'Land Stack Platform Supports 12 Indian Languages for RoR Downloads', 'Citizen Convenience', 'Citizens can now download officially verified translated RoR extracts in Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Odia, Punjabi, Malayalam, Assamese, and English.', NULL, '2025-01-15', NULL, NULL),
('NEWS-007', 'DoLR Launches National State Comparison Dashboard for DILRMP Progress', 'Governance', 'A new national comparison dashboard enables real-time tracking of cadastral digitization, RoR-map integration, and mutation pendency across all 36 states and UTs.', NULL, '2025-01-05', NULL, NULL),
('NEWS-008', 'Tribal Land Protection Alert System Deployed in 12 States Under Forest Rights Act', 'Security & Vigilance', 'Automated lock prevents unauthorized mutation entry on protected tribal and forest holdings without explicit District Collector approval in 12 tribal-majority states.', NULL, '2024-12-22', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Public Notices
INSERT INTO notices (id, notice_number, title, parcel_ulpin, village_code, issue_date, expiry_date, description, authority) VALUES
('NOT-001', NULL, 'Public Notice: Scheduled Server Maintenance on e-Mahabhumi Portal', NULL, NULL, '2025-02-22', NULL, NULL, NULL),
('NOT-002', NULL, 'Advisory: Link Mobile Number & Aadhaar with Form 8A Khata', NULL, NULL, '2025-02-18', NULL, NULL, NULL),
('NOT-003', NULL, 'Gazette: Revision of Agricultural Land Revenue Rates (Akar) for FY 2025-26', NULL, NULL, '2025-02-10', NULL, NULL, NULL),
('NOT-004', NULL, 'Caution Notice: Beware of Fraudulent Third-Party Extract Portals', NULL, NULL, '2025-02-05', NULL, NULL, NULL),
('NOT-005', NULL, 'Circular: Verification of Non-Agricultural Land Use Permissions', NULL, NULL, '2025-01-28', NULL, NULL, NULL),
('NOT-006', NULL, 'Notice: Form 135D Statutory Objection Window Protocol', NULL, NULL, '2025-01-19', NULL, NULL, NULL),
('NOT-007', NULL, 'Order: Mandatory Inspection Protocol for SRO e-Registration Linkage', NULL, NULL, '2025-01-12', NULL, NULL, NULL),
('NOT-008', NULL, 'Notification: Special Lok Adalat for Revenue Dispute Redressal', NULL, NULL, '2025-01-02', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Government Services Catalogue
INSERT INTO government_services (id, title, category, description, icon, route, eligibility, fee, processing_time) VALUES
('SRV-001', 'Record of Rights (RoR) Extract', 'Extracts & RoR', NULL, '📜', '/services', NULL, NULL, NULL),
('SRV-002', 'Land Holding Statement', 'Extracts & RoR', NULL, '📑', '/services', NULL, NULL, NULL),
('SRV-003', 'Urban Property Card', 'Urban Titles', NULL, '🏙️', '/services', NULL, NULL, NULL),
('SRV-004', 'Online Mutation Application', 'Mutations', NULL, '🔄', '/citizen/mutations', NULL, NULL, NULL),
('SRV-005', 'Online Rights Application', 'Mutations', NULL, '✍️', '/citizen/applications', NULL, NULL, NULL),
('SRV-006', 'Cadastral Survey Request', 'Survey & Maps', NULL, '📐', '/services', NULL, NULL, NULL),
('SRV-007', 'Archival Land Records', 'Archives', NULL, '🏛️', '/services', NULL, NULL, NULL),
('SRV-008', 'Cadastral Land Map (Bhu-Naksha)', 'Survey & Maps', NULL, '🗺️', '/government/map', NULL, NULL, NULL),
('SRV-009', 'Mutation Status Tracker', 'Tracking', NULL, '🔍', '/citizen/mutations', NULL, NULL, NULL),
('SRV-010', 'Property Registration Linkage', 'Registration', NULL, '🤝', '/services', NULL, NULL, NULL),
('SRV-011', 'Court Case & Dispute Status', 'Disputes & Courts', NULL, '⚖️', '/services', NULL, NULL, NULL),
('SRV-012', 'Due Diligence 360°', 'Citizen Due Diligence', NULL, '🛡️', '/citizen/due-diligence', NULL, NULL, NULL),
('SRV-013', 'Grievance Redressal Portal', 'Citizen Services', NULL, '📢', '/citizen/grievances', NULL, NULL, NULL),
('SRV-014', 'Certified Copy Issuance', 'Extracts & RoR', NULL, '🔏', '/citizen/applications', NULL, NULL, NULL),
('SRV-015', 'Land Record Search (ULPIN / Bhu-Aadhaar)', 'Search', NULL, '🔎', '/citizen/search', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;


COMMIT;
