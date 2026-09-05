import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import CitizenLayout from './layouts/CitizenLayout';
import GovernmentLayout from './layouts/GovernmentLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import HelpPage from './pages/public/HelpPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import CitizenLoginPage from './pages/auth/CitizenLoginPage';
import GovernmentLoginPage from './pages/auth/GovernmentLoginPage';
import OtpPage from './pages/auth/OtpPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ParcelSearchPage from './pages/citizen/ParcelSearchPage';
import Parcel360Page from './pages/citizen/Parcel360Page';
import MyParcelsPage from './pages/citizen/MyParcelsPage';
import MutationPage from './pages/citizen/MutationPage';
import ApplicationsPage from './pages/citizen/ApplicationsPage';
import DocumentsPage from './pages/citizen/DocumentsPage';
import WatchlistPage from './pages/citizen/WatchlistPage';
import NotificationsPage from './pages/citizen/NotificationsPage';
import GrievancesPage from './pages/citizen/GrievancesPage';
import DueDiligencePage from './pages/citizen/DueDiligencePage';
import ProfilePage from './pages/citizen/ProfilePage';

// Government — 7 Distinct Role Workspaces
import TalathiDashboard from './pages/government/revenue/TalathiDashboard';
import TehsildarDashboard from './pages/government/revenue/TehsildarDashboard';
import RevenueDashboard from './pages/government/revenue/RevenueDashboard';
import RegistrationDashboard from './pages/government/registration/RegistrationDashboard';
import DeedVerificationPage from './pages/government/registration/DeedVerificationPage';
import DistrictDashboard from './pages/government/district/DistrictDashboard';
import TehsilOverviewPage from './pages/government/district/TehsilOverviewPage';
import StateDashboard from './pages/government/state/StateDashboard';
import StateAnalyticsPage from './pages/government/state/StateAnalyticsPage';
import NationalDashboard from './pages/government/national/NationalDashboard';
import StateBenchmarkPage from './pages/government/national/StateBenchmarkPage';
import AdminDashboard from './pages/government/admin/AdminDashboard';
import UserManagementPage from './pages/government/admin/UserManagementPage';
import SystemHealthPage from './pages/government/admin/SystemHealthPage';

// Government — Shared Pages
import GovernmentDashboard from './pages/government/GovernmentDashboard';
import WorkQueuePage from './pages/government/WorkQueuePage';
import ParcelManagementPage from './pages/government/ParcelManagementPage';
import MutationManagementPage from './pages/government/MutationManagementPage';
import CasesPage from './pages/government/CasesPage';
import MapPage from './pages/government/MapPage';
import AnalyticsPage from './pages/government/AnalyticsPage';
import DataQualityPage from './pages/government/DataQualityPage';
import IntegrationsPage from './pages/government/IntegrationsPage';
import AuditPage from './pages/government/AuditPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ======== Public Routes ======== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* ======== Authentication Routes ======== */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/citizen" element={<CitizenLoginPage />} />
            <Route path="/login/government" element={<GovernmentLoginPage />} />
            <Route path="/login/otp" element={<OtpPage />} />
            <Route path="/login/role" element={<RoleSelectionPage />} />
            <Route path="/login/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* ======== Citizen Portal Routes ======== */}
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route index element={<Navigate to="/citizen/dashboard" replace />} />
            <Route path="dashboard" element={<CitizenDashboard />} />
            <Route path="search" element={<ParcelSearchPage />} />
            <Route path="parcels" element={<MyParcelsPage />} />
            <Route path="parcels/:id" element={<Parcel360Page />} />
            <Route path="mutations" element={<MutationPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="due-diligence" element={<DueDiligencePage />} />
            <Route path="grievances" element={<GrievancesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* ======== Government Portal Routes (7 Workspaces) ======== */}
          <Route path="/government" element={<GovernmentLayout />}>
            <Route index element={<Navigate to="/government/dashboard" replace />} />
            <Route path="dashboard" element={<GovernmentDashboard />} />

            {/* Role 1: Talathi / Patwari Field Verification */}
            <Route path="talathi" element={<TalathiDashboard />} />

            {/* Role 2: Tehsildar Statutory Decision Bench */}
            <Route path="tehsildar" element={<TehsildarDashboard />} />

            {/* Department Hub: Revenue & Land Records */}
            <Route path="revenue" element={<RevenueDashboard />} />
            <Route path="revenue/talathi" element={<TalathiDashboard />} />
            <Route path="revenue/tehsildar" element={<TehsildarDashboard />} />
            <Route path="revenue/work-queue" element={<WorkQueuePage />} />
            <Route path="revenue/mutations" element={<MutationManagementPage />} />
            <Route path="revenue/cases" element={<CasesPage />} />

            {/* Role 3: Sub-Registrar Officer (SRO) Registration */}
            <Route path="registration" element={<RegistrationDashboard />} />
            <Route path="registration/deed-verification" element={<DeedVerificationPage />} />

            {/* Role 4: District Collector Command Cockpit */}
            <Route path="district" element={<DistrictDashboard />} />
            <Route path="district/tehsil-overview" element={<TehsilOverviewPage />} />

            {/* Role 5: State PMU Head Command Center */}
            <Route path="state" element={<StateDashboard />} />
            <Route path="state/analytics" element={<StateAnalyticsPage />} />

            {/* Role 6: DoLR / National Cadastral Monitor */}
            <Route path="national" element={<NationalDashboard />} />
            <Route path="national/benchmarks" element={<StateBenchmarkPage />} />

            {/* Role 7: System & Security Administrator */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<UserManagementPage />} />
            <Route path="admin/system-health" element={<SystemHealthPage />} />

            {/* Shared Operations Pages */}
            <Route path="work-queue" element={<WorkQueuePage />} />
            <Route path="parcels" element={<ParcelManagementPage />} />
            <Route path="mutations" element={<MutationManagementPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="data-quality" element={<DataQualityPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="audit" element={<AuditPage />} />
          </Route>

          {/* ======== Fallback Catch-all Route ======== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
