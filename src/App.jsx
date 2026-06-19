import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import { useApp } from './context/AppContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { resolvePage } from './utils/pageRouter.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

function ProtectedApp() {
  const { activePage } = useApp();
  const ActivePage = resolvePage(activePage);
  return (
    <AppShell>
      <ActivePage />
    </AppShell>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  const { bootstrap } = useAuth();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
        <Route path="/reset-password/:token" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <ProtectedApp />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
