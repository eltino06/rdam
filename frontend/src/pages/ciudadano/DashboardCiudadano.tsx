import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { solicitudesApi } from '../../api/solicitudes.api';

export const DashboardCiudadano: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await solicitudesApi.getDashboardCiudadano();
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
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
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
              RDAM
            </h1>
            <p
              style={{
                margin: '5px 0 0 52px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
              }}
            >
              {user?.nombreCompleto}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/mis-solicitudes')}
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
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Mis Solicitudes
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
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px',
        }}
      >
        {/* Header con botón */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
              Dashboard
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px' }}>
              Gestiona tus solicitudes de certificados
            </p>
          </div>
          <button
            onClick={() => navigate('/solicitudes/nueva')}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(59, 130, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)';
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva Solicitud
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              }}
            ></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p
                  style={{
                    margin: '0 0 8px 0',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Solicitudes Activas
                </p>
                <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: 'white' }}>
                  {dashboard?.totalActivas || 0}
                </p>
              </div>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
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
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              }}
            ></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p
                  style={{
                    margin: '0 0 8px 0',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Pendiente de Pago
                </p>
                <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: '#fbbf24' }}>
                  {dashboard?.pendientePago || 0}
                </p>
              </div>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(251, 191, 36, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
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
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #10b981, #34d399)',
              }}
            ></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p
                  style={{
                    margin: '0 0 8px 0',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Certificados Emitidos
                </p>
                <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: '#34d399' }}>
                  {dashboard?.emitidas || 0}
                </p>
              </div>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Solicitudes Recientes */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px', fontWeight: '700' }}>
              Solicitudes Recientes
            </h3>
            <button
              onClick={() => navigate('/mis-solicitudes')}
              style={{
                padding: '8px 16px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.3s',
              }}
            >
              Ver Todas
            </button>
          </div>

          {dashboard?.recientes && dashboard.recientes.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                    <th
                      style={{
                        padding: '16px 32px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Número
                    </th>
                    <th
                      style={{
                        padding: '16px 32px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Tipo
                    </th>
                    <th
                      style={{
                        padding: '16px 32px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Estado
                    </th>
                    <th
                      style={{
                        padding: '16px 32px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recientes.map((solicitud: any) => (
                    <tr
                      key={solicitud.id}
                      style={{
                        borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      onClick={() => navigate(`/solicitudes/${solicitud.id}`)}
                    >
                      <td
                        style={{
                          padding: '20px 32px',
                          fontWeight: '700',
                          color: '#60a5fa',
                          fontSize: '14px',
                        }}
                      >
                        {solicitud.numeroSolicitud}
                      </td>
                      <td style={{ padding: '20px 32px', color: 'white', fontSize: '14px' }}>
                        {solicitud.tipoCertificado}
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: getEstadoColor(solicitud.estado),
                            color: 'white',
                          }}
                        >
                          {getEstadoTexto(solicitud.estado)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '20px 32px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '14px',
                        }}
                      >
                        {new Date(solicitud.fechaCreacion).toLocaleDateString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.4)"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '12px',
                  fontSize: '18px',
                }}
              >
                No hay solicitudes
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  marginBottom: '28px',
                  fontSize: '14px',
                }}
              >
                Comienza creando tu primera solicitud
              </p>
              <button
                onClick={() => navigate('/solicitudes/nueva')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
                }}
              >
                Crear Primera Solicitud
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getEstadoColor(estado: string): string {
  const colors: any = {
    PENDIENTE_REVISION: 'rgba(251, 191, 36, 0.8)',
    EN_REVISION: 'rgba(59, 130, 246, 0.8)',
    APROBADA: 'rgba(16, 185, 129, 0.8)',
    RECHAZADA: 'rgba(239, 68, 68, 0.8)',
    PENDIENTE_PAGO: 'rgba(251, 191, 36, 0.8)',
    PAGADA: 'rgba(16, 185, 129, 0.8)',
    EMITIDA: 'rgba(59, 130, 246, 0.8)',
  };
  return colors[estado] || 'rgba(100, 116, 139, 0.8)';
}

function getEstadoTexto(estado: string): string {
  const textos: any = {
    PENDIENTE_REVISION: 'Pendiente Revisión',
    EN_REVISION: 'En Revisión',
    APROBADA: 'Aprobada',
    RECHAZADA: 'Rechazada',
    PENDIENTE_PAGO: 'Pendiente Pago',
    PAGADA: 'Pagada',
    EMITIDA: 'Emitida',
  };
  return textos[estado] || estado;
}
