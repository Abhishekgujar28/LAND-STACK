import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to safely load JSON data if needed
function loadJson(relPath) {
  try {
    const candidates = [
      path.resolve(__dirname, '../../../src/data', relPath),
      path.resolve(__dirname, '../../../frontend/src/data', relPath),
      path.resolve(__dirname, './json', relPath)
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    }
  } catch (err) {
    console.error(`Error reading ${relPath}:`, err.message);
  }
  return [];
}

export const mockStore = {
  states: loadJson('jurisdictions/states.json'),
  districts: loadJson('jurisdictions/districts.json'),
  tehsils: loadJson('jurisdictions/tehsils.json'),
  villages: loadJson('jurisdictions/villages.json'),
  departments: loadJson('departments/departments.json'),
  roles: loadJson('users/governmentRoles.json'),
  citizens: loadJson('users/citizens.json'),
  governmentUsers: loadJson('users/governmentUsers.json'),
  parcels: loadJson('parcels/parcels.json'),
  ownership: loadJson('parcels/ownership.json'),
  encumbrances: loadJson('parcels/encumbrances.json'),
  restrictions: loadJson('parcels/restrictions.json'),
  zoning: loadJson('parcels/zoning.json'),
  taxRecords: loadJson('parcels/taxRecords.json'),
  courtCases: loadJson('parcels/courtCases.json'),
  parcelDocuments: loadJson('parcels/parcelDocuments.json'),
  mutations: loadJson('mutations/mutations.json'),
  mutationTimeline: loadJson('mutations/mutationTimeline.json'),
  talathiQueue: loadJson('mutations/talathiQueue.json'),
  tehsildarQueue: loadJson('mutations/tehsildarQueue.json'),
  sroAudits: loadJson('mutations/sroAudits.json'),
  applications: loadJson('applications/applications.json'),
  applicationTypes: loadJson('applications/applicationTypes.json'),
  documents: loadJson('documents/documents.json'),
  grievances: loadJson('grievances/grievances.json'),
  notifications: loadJson('notifications/notifications.json'),
  watchlist: loadJson('watchlist/watchlist.json'),
  news: loadJson('news/news.json'),
  notices: loadJson('notices/notices.json'),
  services: loadJson('services/governmentServices.json'),
  nationalAnalytics: loadJson('analytics/national.json'),
  nationalBenchmarks: loadJson('analytics/nationalBenchmarks.json'),
  statePMU: loadJson('analytics/statePMU.json'),
  statesAnalytics: loadJson('analytics/states.json'),
  districtsAnalytics: loadJson('analytics/districts.json'),
  tehsilsAnalytics: loadJson('analytics/tehsils.json'),
  adminSystem: loadJson('analytics/adminSystem.json'),
  districtRankings: loadJson('analytics/districtRankings.json')
};
