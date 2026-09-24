import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import LoadingState from '../components/common/LoadingState';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const CrewPage = lazy(() => import('../pages/CrewPage'));
const AircraftPage = lazy(() => import('../pages/AircraftPage'));
const FlightPlanningPage = lazy(() => import('../pages/FlightPlanningPage'));
const DutyRecordsPage = lazy(() => import('../pages/DutyRecordsPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const FDTLOverviewPage = lazy(() => import('../pages/fdtl/FDTLOverviewPage'));
const DutyPlannerPage = lazy(() => import('../pages/fdtl/DutyPlannerPage'));
const CrewReadinessPage = lazy(() => import('../pages/fdtl/CrewReadinessPage'));
const CalculationDetailsPage = lazy(() => import('../pages/fdtl/CalculationDetailsPage'));
const DutySequencePage = lazy(() => import('../pages/fdtl/DutySequencePage'));
const FDTLCalendarPage = lazy(() => import('../pages/fdtl/FDTLCalendarPage'));
const ViolationsPage = lazy(() => import('../pages/fdtl/ViolationsPage'));
const ConfigurationPage = lazy(() => import('../pages/fdtl/ConfigurationPage'));

export default function AppRoutes() {
  // Pages are code-split so each route loads on demand.
  return (
    <Suspense fallback={<LoadingState message="Loading…" />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/crew" element={<CrewPage />} />
            <Route path="/aircraft" element={<AircraftPage />} />
            <Route path="/flight-planning" element={<FlightPlanningPage />} />
            <Route path="/fdtl" element={<FDTLOverviewPage />} />
            <Route path="/fdtl/duty-planner" element={<DutyPlannerPage />} />
            <Route path="/fdtl/crew-readiness" element={<CrewReadinessPage />} />
            <Route path="/fdtl/calculation-details" element={<CalculationDetailsPage />} />
            <Route path="/fdtl/duty-sequence" element={<DutySequencePage />} />
            <Route path="/fdtl/calendar" element={<FDTLCalendarPage />} />
            <Route path="/fdtl/violations" element={<ViolationsPage />} />
            <Route path="/fdtl/configuration" element={<ConfigurationPage />} />
            <Route path="/duty-records" element={<DutyRecordsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
