import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';
import { ArchivosAdjuntos } from '../../components/ArchivosAdjuntos';

export const GestionarSolicitud: React.FC = () => {
  const [solicitud, setSolicitud] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActuando, setIsActuando] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
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
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccion = async (accion: string, datos?: any) => {
    setIsActuando(true);
    try {
      await apiClient.patch(`/solicitudes/${id}/${accion}`, datos || {});
      setMensaje({ tipo: 'success', texto: getMensajeExito(accion) });
      setShowRechazarModal(false);
      setShowConfirmModal(null);
      await loadSolicitud();
    } catch (error: any) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al procesar la acción',
      });
    } finally {
      setIsActuando(false);
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  const getMensajeExito = (accion: string) => {
    const mensajes: any = {
      'iniciar-revision': 'Solicitud marcada como En Revisión',
      aprobar: 'Solicitud aprobada correctamente',
      rechazar: 'Solicitud rechazada',
      emitir: 'Certificado emitido correctamente',
    };
    return mensajes[accion] || 'Acción completada';
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
          onClick={() => navigate('/interno/solicitudes')}
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
            <p style={{ margin: '5px 0 0 52px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
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
      {/* Mensaje de éxito/error */}
      {mensaje && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            right: '24px',
            zIndex: 999,
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            background:
              mensaje.tipo === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${mensaje.tipo === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            color: mensaje.tipo === 'success' ? '#34d399' : '#f87171',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 10px 30px ${mensaje.tipo === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '400px',
          }}
        >
          {mensaje.tipo === 'success' ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {mensaje.texto}
        </div>
      )}
      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
        {/* Header solicitud */}
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

        {/* Info ciudadano + solicitud */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Datos del ciudadano */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '28px',
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
            <h3
              style={{ margin: '0 0 20px 0', color: 'white', fontSize: '15px', fontWeight: '700' }}
            >
              Datos del Ciudadano
            </h3>
            <InfoRow
              label="Nombre"
              value={solicitud.ciudadanoNombre || solicitud.ciudadano?.nombreCompleto || '—'}
            />
            <InfoRow
              label="Email"
              value={solicitud.ciudadanoEmail || solicitud.ciudadano?.email || '—'}
            />
            <InfoRow label="Teléfono" value={solicitud.ciudadanoTelefono || '—'} />
            <InfoRow label="Domicilio" value={solicitud.ciudadanoDomicilio || '—'} isLast />
          </div>

          {/* Datos de la solicitud */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '28px',
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
            <h3
              style={{ margin: '0 0 20px 0', color: 'white', fontSize: '15px', fontWeight: '700' }}
            >
              Datos de la Solicitud
            </h3>
            <InfoRow label="Tipo" value={solicitud.tipoCertificado} />
            <InfoRow
              label="Arancel"
              value={`$${Number(solicitud.montoArancel).toLocaleString('es-AR')} ARS`}
              valueColor="#34d399"
            />
            <InfoRow label="Estado Pago" value={solicitud.estadoPago || '—'} />
            <InfoRow label="Motivo" value={solicitud.motivoSolicitud} isLast />
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
            <h4 style={{ margin: '0 0 10px 0', color: '#f87171', fontWeight: '700' }}>
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

        {/* Acciones */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '32px',
          }}
        >
          <h3 style={{ margin: '0 0 24px 0', color: 'white', fontSize: '16px', fontWeight: '700' }}>
            Acciones Disponibles
          </h3>

          {solicitud.estado === 'PENDIENTE_REVISION' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <ActionButton
                label="Iniciar Revisión"
                color="#3b82f6"
                border="rgba(59,130,246,0.3)"
                bg="rgba(59,130,246,0.1)"
                onClick={() => setShowConfirmModal('iniciar-revision')}
                disabled={isActuando}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              />
            </div>
          )}

          {solicitud.estado === 'EN_REVISION' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <ActionButton
                label="Aprobar Solicitud"
                color="#34d399"
                border="rgba(52,211,153,0.3)"
                bg="rgba(52,211,153,0.1)"
                onClick={() => setShowConfirmModal('aprobar')}
                disabled={isActuando}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
              />
              <ActionButton
                label="Rechazar Solicitud"
                color="#f87171"
                border="rgba(239,68,68,0.3)"
                bg="rgba(239,68,68,0.1)"
                onClick={() => setShowRechazarModal(true)}
                disabled={isActuando}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                }
              />
            </div>
          )}

          {solicitud.estado === 'PAGADA' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <ActionButton
                label="Emitir Certificado"
                color="#a78bfa"
                border="rgba(167,139,250,0.3)"
                bg="rgba(167,139,250,0.1)"
                onClick={() => setShowConfirmModal('emitir')}
                disabled={isActuando}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                }
              />
            </div>
          )}

          {['APROBADA', 'RECHAZADA', 'PENDIENTE_PAGO', 'EMITIDA'].includes(solicitud.estado) && (
            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: '10px',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
              }}
            >
              No hay acciones disponibles para este estado.
            </div>
          )}
        </div>

        { }
        <ArchivosAdjuntos
          solicitudId={solicitud.id}
          canUpload={solicitud.estado === 'EN_REVISION'}
          allowAlwaysView={true}
        />
      </div>{' '}
      {/* cierre del content */}
      {/* Modal Confirmar */}
      {showConfirmModal && (
        <Modal
          titulo={
            showConfirmModal === 'iniciar-revision'
              ? 'Iniciar Revisión'
              : showConfirmModal === 'aprobar'
                ? 'Aprobar Solicitud'
                : 'Emitir Certificado'
          }
          mensaje={
            showConfirmModal === 'iniciar-revision'
              ? '¿Confirmas que vas a revisar esta solicitud?'
              : showConfirmModal === 'aprobar'
                ? '¿Confirmas la aprobación? El ciudadano podrá proceder con el pago.'
                : '¿Confirmas la emisión del certificado?'
          }
          colorBoton={
            showConfirmModal === 'aprobar'
              ? '#10b981'
              : showConfirmModal === 'emitir'
                ? '#8b5cf6'
                : '#3b82f6'
          }
          onConfirm={() => handleAccion(showConfirmModal!)}
          onCancel={() => setShowConfirmModal(null)}
          isLoading={isActuando}
        />
      )}
      {/* Modal Rechazar */}
      {showRechazarModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
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

            <h3
              style={{ margin: '0 0 8px 0', color: 'white', fontSize: '20px', fontWeight: '700' }}
            >
              Rechazar Solicitud
            </h3>
            <p style={{ margin: '0 0 24px 0', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              Indica el motivo del rechazo. El ciudadano será notificado.
            </p>

            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Describe el motivo del rechazo..."
              rows={4}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '24px',
                transition: 'all 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ef4444';
                e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowRechazarModal(false);
                  setObservaciones('');
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(100, 116, 139, 0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAccion('rechazar', { observacionesRechazo: observaciones })}
                disabled={!observaciones.trim() || isActuando}
                style={{
                  flex: 1,
                  padding: '14px',
                  background:
                    !observaciones.trim() || isActuando
                      ? 'rgba(71, 85, 105, 0.5)'
                      : 'linear-gradient(135deg, #dc2626, #ef4444)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: !observaciones.trim() || isActuando ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: !observaciones.trim() ? 'none' : '0 0 20px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (observaciones.trim() && !isActuando) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
                }}
              >
                {isActuando ? 'Procesando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        textarea::placeholder { color: rgba(255, 255, 255, 0.3); }
      `}</style>
    </div>
  );
};

// Componentes auxiliares
function InfoRow({ label, value, valueColor, isLast = false }: any) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        paddingBottom: isLast ? '0' : '14px',
        marginBottom: isLast ? '0' : '14px',
        borderBottom: isLast ? 'none' : '1px solid rgba(59, 130, 246, 0.1)',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600' }}>
        {label}
      </span>
      <span
        style={{
          color: valueColor || 'white',
          fontSize: '13px',
          fontWeight: '600',
          textAlign: 'right',
          maxWidth: '60%',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ActionButton({ label, color, border, bg, onClick, disabled, icon }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '14px 24px',
        background: disabled ? 'rgba(71, 85, 105, 0.3)' : bg,
        color: disabled ? 'rgba(255,255,255,0.3)' : color,
        border: `1px solid ${disabled ? 'rgba(71, 85, 105, 0.3)' : border}`,
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '700',
        fontSize: '15px',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 25px ${border}`;
          e.currentTarget.style.background = border;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = bg;
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function Modal({ titulo, mensaje, colorBoton, onConfirm, onCancel, isLoading }: any) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '440px',
          width: '100%',
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
            background: `linear-gradient(90deg, #1e3a8a, ${colorBoton})`,
          }}
        ></div>

        <h3 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '20px', fontWeight: '700' }}>
          {titulo}
        </h3>
        <p
          style={{
            margin: '0 0 28px 0',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
        >
          {mensaje}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(100, 116, 139, 0.2)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px',
              background: isLoading ? 'rgba(71, 85, 105, 0.5)' : colorBoton,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: `0 0 20px ${colorBoton}60`,
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 0 30px ${colorBoton}80`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 0 20px ${colorBoton}60`;
            }}
          >
            {isLoading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
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
