-- =====================================================================
-- Migration 003: Comprehensive Maharashtra Seed Data (Rural + Urban)
-- =====================================================================

-- 1. States
INSERT INTO states (code, name, local_name) VALUES
('MH', 'Maharashtra', 'महाराष्ट्र')
ON CONFLICT (code) DO NOTHING;

-- 2. Districts
INSERT INTO districts (code, state_code, name, local_name) VALUES
('DIST-PUN', 'MH', 'Pune', 'पुणे'),
('DIST-MUM-SUB', 'MH', 'Mumbai Suburban', 'मुंबई उपनगर'),
('DIST-SAT', 'MH', 'Satara', 'सातारा')
ON CONFLICT (code) DO NOTHING;

-- 3. Tehsils
INSERT INTO tehsils (code, district_code, name, local_name) VALUES
('TEH-HVL', 'DIST-PUN', 'Haveli', 'हवेली'),
('TEH-PUN-CTY', 'DIST-PUN', 'Pune City', 'पुणे शहर'),
('TEH-AND', 'DIST-MUM-SUB', 'Andheri', 'अंधेरी'),
('TEH-KRD', 'DIST-SAT', 'Karad', 'कराड')
ON CONFLICT (code) DO NOTHING;

-- 4. Villages
INSERT INTO villages (code, tehsil_code, name, local_name, pin_code) VALUES
('VIL-WAG', 'TEH-HVL', 'Wagholi', 'वाघोली', '412207'),
('VIL-LHG', 'TEH-HVL', 'Lohegaon', 'लोहगाव', '411047'),
('VIL-WDS', 'TEH-HVL', 'Wadgaon Sheri', 'वडगाव शेरी', '411014'),
('VIL-MRL', 'TEH-AND', 'Marol', 'मरोळ', '400059')
ON CONFLICT (code) DO NOTHING;

-- 5. Application Types
INSERT INTO application_types (code, name, sla_days, fee) VALUES
('EXTRACT_712', 'Digitally Signed 7/12 Extract', 1, 15.00),
('EXTRACT_8A', 'Digitally Signed 8A Holding', 1, 15.00),
('PROPERTY_CARD', 'City Survey Property Card', 3, 25.00),
('MUTATION', 'e-Ferfar Mutation Request', 30, 100.00),
('WARAS_MUTATION', 'Heirship (Waras) Mutation', 30, 50.00),
('PARTITION_MUTATION', 'Family Partition Mutation', 30, 100.00),
('LIEN_REMOVAL', 'Bank Lien Removal (Boja Kami)', 15, 50.00),
('MOJANI', 'Cadastral Boundary Measurement', 30, 1000.00),
('CERTIFIED_COPY', 'Certified Copy of Ferfar', 3, 20.00),
('NA_NOC', 'Non-Agricultural Conversion NOC', 45, 500.00)
ON CONFLICT (code) DO NOTHING;

-- 6. Officers
INSERT INTO officers (id, name, email, role, department_code, designation, state_code, district_code, tehsil_code, village_code, active_context, is_active) VALUES
('off-tahsildar-01', 'Sanjay Deshmukh', 'tahsildar.haveli@mahabhumi.gov.in', 'TAHSILDAR', 'REV', 'Tahsildar & Executive Magistrate', 'MH', 'DIST-PUN', 'TEH-HVL', NULL, 'REV:TAHSILDAR:TEH-HVL', TRUE),
('off-talathi-01', 'Prakash Shinde', 'talathi.wagholi@mahabhumi.gov.in', 'TALATHI', 'REV', 'Talathi Saja Wagholi', 'MH', 'DIST-PUN', 'TEH-HVL', 'VIL-WAG', 'REV:TALATHI:VIL-WAG', TRUE),
('off-sdo-01', 'Vaishali More', 'sdo.pune@mahabhumi.gov.in', 'SDO', 'REV', 'Sub-Divisional Officer', 'MH', 'DIST-PUN', 'TEH-HVL', NULL, 'REV:SDO:DIST-PUN', TRUE),
('off-sro-01', 'Mahesh Patil', 'sro.haveli@igrmaharashtra.gov.in', 'SUB_REGISTRAR', 'REG', 'Sub-Registrar Class-1 Haveli', 'MH', 'DIST-PUN', 'TEH-HVL', NULL, 'REG:SUB_REGISTRAR:TEH-HVL', TRUE),
('off-admin-01', 'Rajesh Kulkarni', 'admin@landstack.gov.in', 'ADMIN', 'IT', 'State Land Console Administrator', 'MH', NULL, NULL, NULL, 'IT:ADMIN:STATE', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. Officer Assignments
INSERT INTO officer_assignments (id, officer_id, role, jurisdiction_type, jurisdiction_code, state_code, district_code, tehsil_code, village_code, is_active) VALUES
('asgn-1', 'off-talathi-01', 'TALATHI', 'VILLAGE', 'VIL-WAG', 'MH', 'DIST-PUN', 'TEH-HVL', 'VIL-WAG', TRUE),
('asgn-2', 'off-talathi-01', 'TALATHI', 'VILLAGE', 'VIL-WDS', 'MH', 'DIST-PUN', 'TEH-HVL', 'VIL-WDS', TRUE),
('asgn-3', 'off-tahsildar-01', 'TAHSILDAR', 'TEHSIL', 'TEH-HVL', 'MH', 'DIST-PUN', 'TEH-HVL', NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. Citizens
INSERT INTO citizens (id, name, local_name, state_code, mobile, email, address, kyc_verified) VALUES
('c1', 'Aarav Patil', 'आरव पाटील', 'MH', '+919876543210', 'aarav.patil@example.com', 'Flat 402, Ganga Carnation, Koregaon Park, Pune 411001', TRUE),
('c2', 'Sunita Kulkarni', 'सुनिता कुलकर्णी', 'MH', '+919822012345', 'sunita.kulkarni@example.com', 'Plot 12, Sahakar Nagar, Pune 411009', TRUE),
('c3', 'Rajesh Gaikwad', 'राजेश गायकवाड', 'MH', '+919423067890', 'rajesh.gaikwad@example.com', 'Gaikwad Vasti, Lohegaon, Pune 411047', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 9. Parcels
INSERT INTO parcels (ulpin, survey_number, gat_number, state_code, district_code, tehsil_code, village_code, village_name, area, area_unit, land_use, classification, latitude, longitude, current_owner, status) VALUES
('IN-MH-PUN-0001-12345', '45', '45/2A', 'MH', 'DIST-PUN', 'TEH-HVL', 'VIL-WDS', 'Wadgaon Sheri', 0.4200, 'Hectare', 'Agricultural / Jirayat', 'Occupant Class-1 (भोगवटादार वर्ग-१)', 18.5529, 73.9312, 'Aarav Patil', 'CLEAR'),
('IN-MH-PUN-0001-12348', '78', '78/1', 'MH', 'DIST-PUN', 'TEH-HVL', 'VIL-WAG', 'Wagholi', 1.2500, 'Hectare', 'Agricultural / Bagayat', 'Occupant Class-1 (भोगवटादार वर्ग-१)', 18.5793, 73.9812, 'Late Govind Deshmukh', 'CLEAR'),
('ULPIN-MH-PUN-000001', '42', 'Gat 42', 'MH', 'DIST-PUN', 'TEH-HVL', 'VIL-WAG', 'Wagholi', 0.8500, 'Hectare', 'Agricultural', 'Occupant Class-1', 18.5810, 73.9850, 'Aarav Patil', 'CLEAR')
ON CONFLICT (ulpin) DO NOTHING;

-- 10. Mutations
INSERT INTO mutations (id, mutation_number, parcel_ulpin, type, applicant_id, applicant_name, buyer_name, seller_name, status, filing_date, sla_days, village_code, tehsil_code, district_code, state_code) VALUES
('MUT-001', 'FERFAR-2025-0101', 'ULPIN-MH-PUN-000001', 'Sale Deed / Kharedi Khat', 'c1', 'Aarav Patil', 'Aarav Patil', 'Ramesh Jadhav', 'APPROVED', '2025-01-05', 30, 'VIL-WAG', 'TEH-HVL', 'DIST-PUN', 'MH'),
('MUT-PU-HVL-2026-00456', 'FERFAR-2026-0456', 'IN-MH-PUN-0001-12345', 'Sale Mutation (Kharedi Khat)', 'c1', 'Rohan Kadam', 'Rohan Kadam', 'Aarav Patil', 'FIELD_VERIFIED', '2026-08-20', 30, 'VIL-WDS', 'TEH-HVL', 'DIST-PUN', 'MH')
ON CONFLICT (id) DO NOTHING;
