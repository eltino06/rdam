import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';

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
      setSolicitud(response.data.data);
    } catch (error) {
      console.error('Error cargando solicitud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Solicitud no encontrada</p>
        <button onClick={() => navigate('/mis-solicitudes')}>Volver</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>🏛️ RDAM</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            {user?.nombreCompleto}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/mis-solicitudes')}
            style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ← Volver
          </button>
          <button
            onClick={logout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {/* Estado y Número */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
            <div>
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
                Solicitud #{solicitud.numeroSolicitud}
              </h2>
              <p style={{ margin: 0, color: '#666' }}>
                Creada el {new Date(solicitud.fechaCreacion).toLocaleDateString('es-AR')}
              </p>
            </div>
            <span style={{
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              background: getEstadoColor(solicitud.estado),
              color: 'white',
            }}>
              {getEstadoTexto(solicitud.estado)}
            </span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

          {/* Información */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
                Tipo de Certificado
              </label>
              <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                {solicitud.tipoCertificado}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
                Monto del Arancel
              </label>
              <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: 'bold' }}>
                ${Number(solicitud.montoArancel).toLocaleString('es-AR')} ARS
              </p>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
                Motivo de la Solicitud
              </label>
              <p style={{ margin: 0, fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
                {solicitud.motivoSolicitud}
              </p>
            </div>

            {solicitud.ciudadanoTelefono && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
                  Teléfono
                </label>
                <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                  {solicitud.ciudadanoTelefono}
                </p>
              </div>
            )}

            {solicitud.ciudadanoDomicilio && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
                  Domicilio
                </label>
                <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                  {solicitud.ciudadanoDomicilio}
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

          <h3 style={{ marginBottom: '20px', color: '#333' }}>Estado de la Solicitud</h3>

          <div style={{ position: 'relative', paddingLeft: '30px' }}>
            {/* Línea vertical */}
            <div style={{
              position: 'absolute',
              left: '9px',
              top: '10px',
              bottom: '10px',
              width: '2px',
              background: '#e0e0e0',
            }}></div>

            {/* Items */}
            <TimelineItem
              title="Solicitud Creada"
              date={solicitud.fechaCreacion}
              active={true}
              completed={true}
            />

            {solicitud.estado !== 'PENDIENTE_REVISION' && (
              <TimelineItem
                title="En Revisión"
                date={solicitud.fechaRevision}
                active={solicitud.estado === 'EN_REVISION'}
                completed={['APROBADA', 'RECHAZADA', 'PENDIENTE_PAGO', 'PAGADA', 'EMITIDA'].includes(solicitud.estado)}
              />
            )}

            {solicitud.estado === 'APROBADA' || solicitud.estado === 'PENDIENTE_PAGO' || solicitud.estado === 'PAGADA' || solicitud.estado === 'EMITIDA' ? (
              <TimelineItem
                title="Aprobada"
                date={solicitud.fechaAprobacion}
                active={solicitud.estado === 'APROBADA'}
                completed={['PENDIENTE_PAGO', 'PAGADA', 'EMITIDA'].includes(solicitud.estado)}
              />
            ) : null}

            {solicitud.estado === 'RECHAZADA' && (
              <TimelineItem
                title="Rechazada"
                date={solicitud.fechaRevision}
                active={true}
                completed={true}
                isRejected={true}
              />
            )}

            {solicitud.estado === 'PENDIENTE_PAGO' || solicitud.estado === 'PAGADA' || solicitud.estado === 'EMITIDA' ? (
              <TimelineItem
                title="Pago Realizado"
                date={solicitud.pagoFecha}
                active={solicitud.estado === 'PENDIENTE_PAGO'}
                completed={['PAGADA', 'EMITIDA'].includes(solicitud.estado)}
              />
            ) : null}

            {solicitud.estado === 'EMITIDA' && (
              <TimelineItem
                title="Certificado Emitido"
                date={solicitud.fechaEmision}
                active={true}
                completed={true}
              />
            )}
          </div>

          {/* Observaciones de Rechazo */}
          {solicitud.estado === 'RECHAZADA' && solicitud.observacionesRechazo && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />
              <div style={{
                background: '#fee',
                border: '1px solid #fcc',
                padding: '20px',
                borderRadius: '8px',
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#c33' }}>
                  Motivo del Rechazo
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  {solicitud.observacionesRechazo}
                </p>
              </div>
            </>
          )}

          {/* Botón de Pago */}
          {solicitud.estado === 'PENDIENTE_PAGO' && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />
              <div style={{
                background: '#e7f3ff',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#004085' }}>
                  Tu solicitud fue aprobada
                </h4>
                <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                  Procede con el pago para continuar con el trámite
                </p>
                <button
                  style={{
                    padding: '14px 28px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => alert('Redirigiendo a plataforma de pagos...')}
                >
                  💳 Pagar Ahora - ${Number(solicitud.montoArancel).toLocaleString('es-AR')}
                </button>
              </div>
            </>
          )}

          {/* Descargar Certificado */}
          {solicitud.estado === 'EMITIDA' && solicitud.certificadoPdfUrl && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />
              <div style={{
                background: '#d4edda',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
                  ✅ Certificado Emitido
                </h4>
                <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                  Tu certificado está listo para descargar
                </p>
                <button
                  style={{
                    padding: '14px 28px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => window.open(solicitud.certificadoPdfUrl, '_blank')}
                >
                  📄 Descargar Certificado
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar Timeline
function TimelineItem({ title, date, active, completed, isRejected = false }: any) {
  return (
    <div style={{ position: 'relative', paddingBottom: '25px' }}>
      {/* Círculo */}
      <div style={{
        position: 'absolute',
        left: '-26px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: completed ? (isRejected ? '#dc3545' : '#28a745') : (active ? '#ffc107' : '#e0e0e0'),
        border: '3px solid white',
        boxShadow: '0 0 0 2px ' + (completed ? (isRejected ? '#dc3545' : '#28a745') : (active ? '#ffc107' : '#e0e0e0')),
      }}></div>

      {/* Contenido */}
      <div>
        <h4 style={{
          margin: '0 0 5px 0',
          color: completed || active ? '#333' : '#999',
          fontSize: '16px',
        }}>
          {title}
        </h4>
        {date && (
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            {new Date(date).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function getEstadoColor(estado: string): string {
  const colors: any = {
    PENDIENTE_REVISION: '#ffc107',
    EN_REVISION: '#17a2b8',
    APROBADA: '#28a745',
    RECHAZADA: '#dc3545',
    PENDIENTE_PAGO: '#ffc107',
    PAGADA: '#28a745',
    EMITIDA: '#007bff',
  };
  return colors[estado] || '#6c757d';
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