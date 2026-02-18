import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { solicitudesApi } from '../../api/solicitudes.api';
import { validators } from '../../utils/validators';
import { AddressAutocomplete } from '../../components/AddressAutocomplete';

export const NuevaSolicitud: React.FC = () => {
  const [tipoCertificado, setTipoCertificado] = useState('');
  const [motivoSolicitud, setMotivoSolicitud] = useState('');
  const [ciudadanoTelefono, setCiudadanoTelefono] = useState('');
  const [ciudadanoDomicilio, setCiudadanoDomicilio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tiposCertificado = ['Residencia', 'Antecedentes', 'Nacimiento', 'Matrimonio', 'Defunción'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (ciudadanoTelefono && !validators.isValidPhone(ciudadanoTelefono)) {
      setError('El teléfono ingresado no es válido. Debe contener al menos 8 números.');
      return;
    }

    if (!ciudadanoDomicilio || ciudadanoDomicilio.length < 5) {
      setError('Por favor seleccioná una dirección válida o escribí al menos 5 caracteres.');
      return;
    }

    if (motivoSolicitud.length < 30) {
      setError(`El motivo es muy breve. Por favor detallá un poco más (mínimo 30 caracteres). Llevas ${motivoSolicitud.length}.`);
      return;
    }

    setIsLoading(true);

    try {
      await solicitudesApi.create({
        tipoCertificado,
        motivoSolicitud,
        ciudadanoTelefono: ciudadanoTelefono || undefined,
        ciudadanoDomicilio: ciudadanoDomicilio || undefined,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la solicitud');
      setIsLoading(false);
    }
  };

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
              onClick={() => navigate('/dashboard')}
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
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '40px',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
            Nueva Solicitud
          </h2>
          <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px' }}>
            Completa el formulario para solicitar un nuevo certificado
          </p>
        </div>

        {/* Formulario */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '40px',
          }}
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  marginBottom: '28px',
                  fontSize: '14px',
                  position: 'relative',
                  paddingLeft: '24px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: '#ef4444',
                    borderRadius: '12px 0 0 12px',
                  }}
                ></div>
                {error}
              </div>
            )}

            {/* Tipo de Certificado */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                Tipo de Certificado <span style={{ color: '#f87171' }}>*</span>
              </label>
              <select
                value={tipoCertificado}
                onChange={(e) => setTipoCertificado(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(30, 41, 59, 0.8)';
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="" style={{ background: '#1e293b' }}>
                  Selecciona un tipo
                </option>
                {tiposCertificado.map((tipo) => (
                  <option key={tipo} value={tipo} style={{ background: '#1e293b' }}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Motivo */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                Motivo de la Solicitud <span style={{ color: '#f87171' }}>*</span>
              </label>
              <textarea
                value={motivoSolicitud}
                onChange={(e) => setMotivoSolicitud(e.target.value)}
                placeholder="Describe el motivo por el cual necesitas este certificado..."
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(30, 41, 59, 0.8)';
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '12px', color: motivoSolicitud.length < 30 ? '#f87171' : 'rgba(255,255,255,0.4)' }}>
                {motivoSolicitud.length} / 30 caracteres mínimos
              </div>
            </div>

            {/* Grid 2 columnas */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              {/* Teléfono */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '10px',
                  }}
                >
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={ciudadanoTelefono}
                  onChange={(e) => setCiudadanoTelefono(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(30, 41, 59, 0.8)';
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Domicilio */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '10px',
                  }}
                >
                  Domicilio
                </label>
                <AddressAutocomplete
                  onSelect={(val) => setCiudadanoDomicilio(val)}
                  defaultValue={ciudadanoDomicilio}
                />
              </div>
            </div>

            {/* Info del Arancel */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p style={{ margin: 0, color: '#60a5fa', fontSize: '14px', fontWeight: '700' }}>
                  Información del Arancel
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                El costo del certificado es de{' '}
                <strong style={{ color: 'white' }}>$5,000 ARS</strong>. Podrás realizar el pago una
                vez que tu solicitud sea aprobada.
              </p>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(100, 116, 139, 0.2)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 116, 139, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 116, 139, 0.2)';
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  flex: 2,
                  padding: '16px',
                  background: isLoading
                    ? 'rgba(71, 85, 105, 0.5)'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  boxShadow: isLoading ? 'none' : '0 0 30px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(59, 130, 246, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)';
                }}
              >
                {isLoading ? 'CREANDO...' : 'Crear Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        input::placeholder,
        textarea::placeholder,
        select option:first-child {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};
