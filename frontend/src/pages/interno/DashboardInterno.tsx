import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { solicitudesApi } from '../../api/solicitudes.api';

export const DashboardInterno: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await solicitudesApi.getDashboardInterno();
      setDashboard(response.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: 'white',
        }}
      >
        Cargando...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2c4a6e 0%, #3a5a7e 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid #4A90E2',
          boxShadow: '0 4px 20px rgba(74, 144, 226, 0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M3 21h18" />
                  <path d="M9 8h1" />
                  <path d="M9 12h1" />
                  <path d="M14 8h1" />
                  <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
                </svg>
              </div>
              RDAM — Panel Interno
            </h1>
            <p
              style={{
                margin: '5px 0 0 52px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
              }}
            >
              {user?.nombreCompleto} · <span style={{ color: '#60a5fa' }}>{user?.rol}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/interno/solicitudes')}
              style={{
                padding: '10px 20px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
              }}
            >
              Ver Solicitudes
            </button>
            <button
              onClick={logout}
              style={{
                padding: '10px 20px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
            Dashboard
          </h2>
          <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
            Resumen general de solicitudes
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {[
            {
              label: 'Total Solicitudes',
              value: dashboard?.total || 0,
              color: '#3b82f6',
              border: 'rgba(59, 130, 246, 0.2)',
              icon: (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              ),
            },
            {
              label: 'Pendientes de Revisión',
              value: dashboard?.pendientesRevision || 0,
              color: '#fbbf24',
              border: 'rgba(251, 191, 36, 0.2)',
              icon: (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
            },
            {
              label: 'Pagadas - Sin Emitir',
              value: dashboard?.pagadasSinEmitir || 0,
              color: '#34d399',
              border: 'rgba(52, 211, 153, 0.2)',
              icon: (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              ),
            },
            {
              label: 'Emitidas Hoy',
              value: dashboard?.emitidasHoy || 0,
              color: '#a78bfa',
              border: 'rgba(167, 139, 250, 0.2)',
              icon: (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: `linear-gradient(135deg, ${stat.color}25 0%, ${stat.color}10 100%)`,
                backdropFilter: 'blur(20px)',
                padding: '28px',
                borderRadius: '16px',
                border: `1px solid ${stat.color}50`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.border = `2px solid ${stat.color}`;
                e.currentTarget.style.boxShadow = `0 20px 60px ${stat.color}90, 0 0 80px ${stat.color}60`;
                e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}50 0%, ${stat.color}30 100%)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.border = `1px solid ${stat.color}50`;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}25 0%, ${stat.color}10 100%)`;
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: stat.color,
                }}
              ></div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
              >
                <div>
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '13px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {stat.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    background: `${stat.border}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '32px',
          }}
        >
          <h3 style={{ margin: '0 0 24px 0', color: 'white', fontSize: '18px', fontWeight: '700' }}>
            Acciones Rápidas
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                label: 'Revisar Pendientes',
                path: '/interno/solicitudes?estado=PENDIENTE_REVISION',
                color: '#fbbf24',
                border: 'rgba(251, 191, 36, 0.3)',
                bg: 'rgba(251, 191, 36, 0.1)',
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
              {
                label: 'Emitir Certificados',
                path: '/interno/solicitudes?estado=PAGADA',
                color: '#34d399',
                border: 'rgba(52, 211, 153, 0.3)',
                bg: 'rgba(52, 211, 153, 0.1)',
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                ),
              },
              {
                label: 'Ver Todas',
                path: '/interno/solicitudes',
                color: '#60a5fa',
                border: 'rgba(59, 130, 246, 0.3)',
                bg: 'rgba(59, 130, 246, 0.1)',
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                ),
              },
              ...(user?.rol === 'ADMIN'
                ? [
                  {
                    label: 'Gestión de Usuarios',
                    path: '/interno/usuarios',
                    color: '#a78bfa',
                    border: 'rgba(167, 139, 250, 0.3)',
                    bg: 'rgba(167, 139, 250, 0.1)',
                    icon: (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                  },
                ]
                : []),
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{
                  padding: '20px',
                  background: action.bg,
                  color: action.color,
                  border: `1px solid ${action.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  textAlign: 'left',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${action.border}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
