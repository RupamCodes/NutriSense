import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import LogMealPage from './pages/LogMealPage';
import AISuggestionsPage from './pages/AISuggestionsPage';
import NutritionPage from './pages/NutritionPage';
import MealPlansPage from './pages/MealPlansPage';
import HabitsPage from './pages/HabitsPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/layout/AppLayout';
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !user.isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated && user?.isOnboarded) return <Navigate to="/dashboard" replace />;
  if (isAuthenticated && !user?.isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-variant text-body-md">Loading NutriSense...</p>
      </div>
    </div>
  );
}
export default function App() {
  const { initialize, isLoading } = useAuthStore();
  useEffect(() => {
    initialize();
  }, [initialize]);
  if (isLoading) return <LoadingScreen />;
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="/log-meal" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<LogMealPage />} />
      </Route>
      <Route path="/ai-suggestions" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<AISuggestionsPage />} />
      </Route>
      <Route path="/nutrition" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<NutritionPage />} />
      </Route>
      <Route path="/meal-plans" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<MealPlansPage />} />
      </Route>
      <Route path="/habits" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<HabitsPage />} />
      </Route>
      <Route path="/settings" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
