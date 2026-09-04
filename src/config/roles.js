/**
 * User roles in Land Stack platform
 */
export const ROLES = {
  CITIZEN: 'CITIZEN',
  TALATHI: 'TALATHI',
  PATWARI: 'PATWARI',
  TEHSILDAR: 'TEHSILDAR',
  SRO: 'SRO', // Sub-Registrar Officer
  COLLECTOR: 'COLLECTOR',
  STATE_PMU: 'STATE_PMU',
  NATIONAL_MONITOR: 'NATIONAL_MONITOR',
  ADMIN: 'ADMIN',
};

export const ROLE_DEFINITIONS = [
  { id: ROLES.CITIZEN, name: 'Citizen / Landholder', portal: 'citizen', description: 'Access personal land records, 7/12, 8A, applications, and due diligence' },
  { id: ROLES.TALATHI, name: 'Talathi (Village Officer)', portal: 'government', description: 'Maintains village Form 6, 7/12, pencil entries, and field verifications' },
  { id: ROLES.PATWARI, name: 'Patwari / Revenue Inspector', portal: 'government', description: 'Village inspections, boundary verifications, and crop surveys' },
  { id: ROLES.TEHSILDAR, name: 'Tehsildar & Executive Magistrate', portal: 'government', description: 'Sanctions e-Ferfar mutations, hears quasi-judicial RTS revenue cases' },
  { id: ROLES.SRO, name: 'Sub-Registrar Officer (SRO)', portal: 'government', description: 'Registers conveyances, deeds, and synchronizes with Land Stack registry' },
  { id: ROLES.COLLECTOR, name: 'District Collector', portal: 'government', description: 'District administration, Section 36A permissions, and revenue vigilance' },
  { id: ROLES.STATE_PMU, name: 'State Project Management Unit (PMU)', portal: 'government', description: 'State-wide digitization monitoring, cadastral integrations, and SLAs' },
  { id: ROLES.NATIONAL_MONITOR, name: 'National Cadastral Monitor (DoLR)', portal: 'government', description: 'National land record modernization programme benchmarks and ULPIN metrics' },
  { id: ROLES.ADMIN, name: 'System Administrator', portal: 'government', description: 'System configuration, role assignment, audit logs, and security controls' },
];

export default ROLES;
