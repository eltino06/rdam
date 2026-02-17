import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/auth/Login';
import { DashboardCiudadano } from './pages/ciudadano/DashboardCiudadano';
import { NuevaSolicitud } from './pages/ciudadano/NuevaSolicitud';
import { MisSolicitudes } from './pages/ciudadano/MisSolicitudes';
import { DetalleSolicitud } from './pages/ciudadano/DetalleSolicitud';
import { useAuth } from './hooks/useAuth';
import { DashboardInterno } from './pages/interno/DashboardInterno';
import { TodasSolicitudes } from './pages/interno/TodasSolicitudes';
import { GestionarSolicitud } from './pages/interno/GestionarSolicitud';
import { GestionUsuarios } from './pages/interno/GestionUsuarios';
import { Register } from './pages/auth/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardCiudadano />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitudes/nueva"
            element={
              <ProtectedRoute>
                <NuevaSolicitud />
              </ProtectedRoute>
            }
          />
          <Route
  path="/interno/solicitudes/:id"
  element={
    <ProtectedRoute>
      <GestionarSolicitud />
    </ProtectedRoute>
  }
/>
<Route
  path="/interno/usuarios"
  element={
    <ProtectedRoute>
      <GestionUsuarios />
    </ProtectedRoute>
  }
/>
          <Route
            path="/mis-solicitudes"
            element={
              <ProtectedRoute>
                <MisSolicitudes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitudes/:id"
            element={
              <ProtectedRoute>
                <DetalleSolicitud />
              </ProtectedRoute>
            }
          />
          <Route
  path="/interno/dashboard"
  element={
    <ProtectedRoute>
      <DashboardInterno />
    </ProtectedRoute>
  }
/>
<Route
  path="/interno/solicitudes"
  element={
    <ProtectedRoute>
      <TodasSolicitudes />
    </ProtectedRoute>
  }
/>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}