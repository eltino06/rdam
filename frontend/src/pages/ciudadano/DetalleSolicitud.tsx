import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';
import { ArchivosAdjuntos } from '../../components/ArchivosAdjuntos';

export const DetalleSolicitud: React.FC = () => {
  const [solicitud, setSolicitud] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadSolicitud();
  }, [id]);

  const loadSolicitud = async () => {
    try {
      const response = await apiClient.get(`/solicitudes/${id}`);
      setSolicitud(response.data.data || response.data);
    } catch (error) {
      console.error('Error cargando solicitud:', error);
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

  if (!solicitud) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: 'white',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <p>Solicitud no encontrada</p>
        <button
          onClick={() => navigate('/mis-solicitudes')}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
          }}
        >
          Volver
        </button>
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
              }}
            >
              ← Volver
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
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
        {/* Título y estado */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '32px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
              Solicitud #{solicitud.numeroSolicitud}
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              Creada el {new Date(solicitud.fechaCreacion).toLocaleDateString('es-AR')}
            </p>
          </div>
          <span
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '700',
              background: getEstadoColor(solicitud.estado),
              color: 'white',
            }}
          >
            {getEstadoTexto(solicitud.estado)}
          </span>
        </div>

        {/* Info principal */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '32px',
            marginBottom: '24px',
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
              background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)',
            }}
          ></div>

          <h3 style={{ margin: '0 0 24px 0', color: 'white', fontSize: '16px', fontWeight: '700' }}>
            Información de la Solicitud
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 6px 0',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Tipo de Certificado
              </p>
              <p style={{ margin: 0, color: 'white', fontSize: '16px', fontWeight: '600' }}>
                {solicitud.tipoCertificado}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: '0 0 6px 0',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Monto del Arancel
              </p>
              <p style={{ margin: 0, color: '#34d399', fontSize: '16px', fontWeight: '700' }}>
                ${Number(solicitud.montoArancel).toLocaleString('es-AR')} ARS
              </p>
            </div>

            {solicitud.ciudadanoTelefono && (
              <div>
                <p
                  style={{
                    margin: '0 0 6px 0',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Teléfono
                </p>
                <p style={{ margin: 0, color: 'white', fontSize: '16px' }}>
                  {solicitud.ciudadanoTelefono}
                </p>
              </div>
            )}

            {solicitud.ciudadanoDomicilio && (
              <div>
                <p
                  style={{
                    margin: '0 0 6px 0',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Domicilio
                </p>
                <p style={{ margin: 0, color: 'white', fontSize: '16px' }}>
                  {solicitud.ciudadanoDomicilio}
                </p>
              </div>
            )}

            <div style={{ gridColumn: '1 / -1' }}>
              <p
                style={{
                  margin: '0 0 6px 0',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Motivo
              </p>
              <p style={{ margin: 0, color: 'white', fontSize: '15px', lineHeight: '1.6' }}>
                {solicitud.motivoSolicitud}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '32px',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ margin: '0 0 28px 0', color: 'white', fontSize: '16px', fontWeight: '700' }}>
            Estado del Trámite
          </h3>

          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Línea vertical */}
            <div
              style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                bottom: '10px',
                width: '2px',
                background: 'rgba(59, 130, 246, 0.2)',
              }}
            ></div>

            <TimelineItem
              title="Solicitud Creada"
              date={solicitud.fechaCreacion}
              completed={true}
              active={solicitud.estado === 'PENDIENTE_REVISION'}
              color="#3b82f6"
            />

            <TimelineItem
              title="En Revisión"
              date={solicitud.fechaRevision}
              completed={['APROBADA', 'RECHAZADA', 'PENDIENTE_PAGO', 'PAGADA', 'EMITIDA'].includes(
                solicitud.estado,
              )}
              active={solicitud.estado === 'EN_REVISION'}
              color="#3b82f6"
            />

            {solicitud.estado === 'RECHAZADA' ? (
              <TimelineItem
                title="Rechazada"
                date={solicitud.fechaRevision}
                completed={true}
                active={true}
                color="#ef4444"
                isRejected
              />
            ) : (
              <TimelineItem
                title="Aprobada"
                date={solicitud.fechaAprobacion}
                completed={['PENDIENTE_PAGO', 'PAGADA', 'EMITIDA'].includes(solicitud.estado)}
                active={solicitud.estado === 'APROBADA'}
                color="#10b981"
              />
            )}

            <TimelineItem
              title="Pago Realizado"
              date={solicitud.pagoFecha}
              completed={['PAGADA', 'EMITIDA'].includes(solicitud.estado)}
              active={solicitud.estado === 'PENDIENTE_PAGO'}
              color="#f59e0b"
            />

            <TimelineItem
              title="Certificado Emitido"
              date={solicitud.fechaEmision}
              completed={solicitud.estado === 'EMITIDA'}
              active={solicitud.estado === 'EMITIDA'}
              color="#10b981"
              isLast
            />
          </div>
        </div>

        {/* Rechazo */}
        {solicitud.estado === 'RECHAZADA' && solicitud.observacionesRechazo && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
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
                background: '#ef4444',
              }}
            ></div>
            <h4
              style={{
                margin: '0 0 12px 0',
                color: '#f87171',
                fontSize: '15px',
                fontWeight: '700',
              }}
            >
              Motivo del Rechazo
            </h4>
            <p
              style={{
                margin: 0,
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              {solicitud.observacionesRechazo}
            </p>
          </div>
        )}

        {/* Pago pendiente */}
        {solicitud.estado === 'PENDIENTE_PAGO' && (
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{ margin: '0 0 8px 0', color: 'white', fontSize: '18px', fontWeight: '700' }}
            >
              Tu solicitud fue aprobada
            </h4>
            <p style={{ margin: '0 0 24px 0', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              Realiza el pago para continuar con el trámite
            </p>
            <button
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.4)';
              }}
              onClick={() => alert('Redirigiendo a plataforma de pagos...')}
            >
              Pagar ${Number(solicitud.montoArancel).toLocaleString('es-AR')} ARS
            </button>
          </div>
        )}

        {/* Certificado emitido */}
        {solicitud.estado === 'EMITIDA' && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h4
              style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '18px', fontWeight: '700' }}
            >
              Certificado Disponible
            </h4>
            <p style={{ margin: '0 0 24px 0', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              Tu certificado está listo para descargar
            </p>
            <button
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)';
              }}
              onClick={() => window.open(solicitud.certificadoPdfUrl, '_blank')}
            >
              Descargar Certificado
            </button>
          </div>
        )}

        <ArchivosAdjuntos
          solicitudId={solicitud.id}
          canUpload={false}
          estadoSolicitud={solicitud.estado}
        />
      </div>
    </div>
  );
};
function TimelineItem({
  title,
  date,
  completed,
  active,
  color,
  isRejected = false,
  isLast = false,
}: any) {
  return (
    <div style={{ position: 'relative', paddingBottom: isLast ? '0' : '28px' }}>
      {/* Círculo */}
      <div
        style={{
          position: 'absolute',
          left: '-27px',
          top: '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: completed || active ? color : 'rgba(30, 41, 59, 0.8)',
          border: `2px solid ${completed || active ? color : 'rgba(59, 130, 246, 0.2)'}`,
          boxShadow: completed || active ? `0 0 12px ${color}60` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {completed && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Contenido */}
      <h4
        style={{
          margin: '0 0 4px 0',
          color: completed || active ? 'white' : 'rgba(255,255,255,0.4)',
          fontSize: '15px',
          fontWeight: '600',
        }}
      >
        {title}
      </h4>
      {date ? (
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
          {new Date(date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      ) : (
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Pendiente</p>
      )}
    </div>
  );
}

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
