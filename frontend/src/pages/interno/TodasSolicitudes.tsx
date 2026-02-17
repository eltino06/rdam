import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { solicitudesApi } from '../../api/solicitudes.api';

export const TodasSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam) setFiltroEstado(estadoParam);
    loadSolicitudes();
  }, [searchParams]);

  const loadSolicitudes = async () => {
    try {
      const response = await solicitudesApi.getAll();
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltroChange = (estado: string) => {
    setFiltroEstado(estado);
    if (estado) {
      navigate(`/interno/solicitudes?estado=${estado}`);
    } else {
      navigate('/interno/solicitudes');
    }
  };

  const solicitudesFiltradas = filtroEstado
    ? solicitudes.filter((s) => s.estado === filtroEstado)
    : solicitudes;

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
              RDAM — Panel Interno
            </h1>
            <p style={{ margin: '5px 0 0 52px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              {user?.nombreCompleto} · <span style={{ color: '#60a5fa' }}>{user?.rol}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/interno/dashboard')}
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
              ← Dashboard
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
        {/* Título y filtro */}
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
              Todas las Solicitudes
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
              {solicitudesFiltradas.length} solicitud{solicitudesFiltradas.length !== 1 ? 'es' : ''}{' '}
              encontrada{solicitudesFiltradas.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Filtro de Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => handleFiltroChange(e.target.value)}
            style={{
              padding: '12px 20px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: '600',
            }}
          >
            <option value="" style={{ background: '#1e293b' }}>
              Todos los estados
            </option>
            <option value="PENDIENTE_REVISION" style={{ background: '#1e293b' }}>
              Pendiente Revisión
            </option>
            <option value="EN_REVISION" style={{ background: '#1e293b' }}>
              En Revisión
            </option>
            <option value="APROBADA" style={{ background: '#1e293b' }}>
              Aprobada
            </option>
            <option value="RECHAZADA" style={{ background: '#1e293b' }}>
              Rechazada
            </option>
            <option value="PENDIENTE_PAGO" style={{ background: '#1e293b' }}>
              Pendiente Pago
            </option>
            <option value="PAGADA" style={{ background: '#1e293b' }}>
              Pagada
            </option>
            <option value="EMITIDA" style={{ background: '#1e293b' }}>
              Emitida
            </option>
          </select>
        </div>

        {/* Chips de estado rápido */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            {
              label: 'Todos',
              value: '',
              color: 'rgba(255,255,255,0.6)',
              border: 'rgba(255,255,255,0.2)',
            },
            {
              label: 'Pendiente Revisión',
              value: 'PENDIENTE_REVISION',
              color: '#fbbf24',
              border: 'rgba(251,191,36,0.3)',
            },
            {
              label: 'En Revisión',
              value: 'EN_REVISION',
              color: '#60a5fa',
              border: 'rgba(59,130,246,0.3)',
            },
            {
              label: 'Aprobada',
              value: 'APROBADA',
              color: '#34d399',
              border: 'rgba(52,211,153,0.3)',
            },
            {
              label: 'Rechazada',
              value: 'RECHAZADA',
              color: '#f87171',
              border: 'rgba(239,68,68,0.3)',
            },
            {
              label: 'Pendiente Pago',
              value: 'PENDIENTE_PAGO',
              color: '#fbbf24',
              border: 'rgba(251,191,36,0.3)',
            },
            { label: 'Pagada', value: 'PAGADA', color: '#34d399', border: 'rgba(52,211,153,0.3)' },
            {
              label: 'Emitida',
              value: 'EMITIDA',
              color: '#a78bfa',
              border: 'rgba(167,139,250,0.3)',
            },
          ].map((chip) => (
            <button
              key={chip.value}
              onClick={() => handleFiltroChange(chip.value)}
              style={{
                padding: '6px 16px',
                background: filtroEstado === chip.value ? `${chip.border}` : 'transparent',
                color: chip.color,
                border: `1px solid ${chip.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = chip.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  filtroEstado === chip.value ? chip.border : 'transparent';
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Tabla */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.5)' }}>
            Cargando...
          </div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '80px',
              textAlign: 'center',
            }}
          >
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
                stroke="rgba(59,130,246,0.4)"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              No hay solicitudes
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              {filtroEstado
                ? 'No hay solicitudes con este estado'
                : 'Aún no se han recibido solicitudes'}
            </p>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.8)' }}>
                  {['Número', 'Ciudadano', 'Tipo', 'Estado', 'Fecha', 'Acciones'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.map((s) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid rgba(59,130,246,0.1)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59,130,246,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td
                      style={{
                        padding: '20px 24px',
                        fontWeight: '700',
                        color: '#60a5fa',
                        fontSize: '14px',
                      }}
                    >
                      {s.numeroSolicitud}
                    </td>
                    <td style={{ padding: '20px 24px', color: 'white', fontSize: '14px' }}>
                      {s.ciudadanoNombre || s.ciudadano?.nombreCompleto || '—'}
                    </td>
                    <td
                      style={{
                        padding: '20px 24px',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '14px',
                      }}
                    >
                      {s.tipoCertificado}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: getEstadoColor(s.estado),
                          color: 'white',
                        }}
                      >
                        {getEstadoTexto(s.estado)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '20px 24px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '14px',
                      }}
                    >
                      {new Date(s.fechaCreacion).toLocaleDateString('es-AR')}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <button
                        onClick={() => navigate(`/interno/solicitudes/${s.id}`)}
                        style={{
                          padding: '8px 18px',
                          background: 'rgba(59,130,246,0.1)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59,130,246,0.3)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59,130,246,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                        }}
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
