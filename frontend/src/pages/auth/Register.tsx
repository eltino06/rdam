import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { validators } from '../../utils/validators';

export const Register: React.FC = () => {
  const [form, setForm] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    confirmarPassword: '',
    cuil: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();


  // ... inside component ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!validators.isValidName(form.nombreCompleto)) {
      setError('El nombre completo debe tener al menos 3 letras y no contener números o símbolos.');
      return;
    }

    if (form.cuil && !validators.isValidCuil(form.cuil)) {
      setError('El CUIL debe tener 11 dígitos numéricos.');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/register', {
        nombreCompleto: form.nombreCompleto,
        email: form.email,
        password: form.password,
        cuil: form.cuil || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            background: 'rgba(30, 41, 59, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            textAlign: 'center',
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

          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h2 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '24px', fontWeight: '700' }}>
            ¡Registro exitoso!
          </h2>
          <p
            style={{
              margin: '0 0 8px 0',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '15px',
              lineHeight: '1.6',
            }}
          >
            Tu cuenta fue creada correctamente.
          </p>
          <p style={{ margin: '0 0 32px 0', color: '#34d399', fontSize: '14px' }}>
            📧 Revisá tu email, te enviamos un mensaje de bienvenida.
          </p>

          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(59, 130, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.4)';
            }}
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '24px',
      }}
    >
      <div className="auth-card">
        {/* IZQUIERDA - Branding */}
        <div className="auth-branding">
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
              backgroundSize: '40px 40px',
            }}
          ></div>

          <div
            style={{
              width: '70px',
              height: '70px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset',
            }}
          >
            <svg
              width="36"
              height="36"
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

          <h1
            style={{
              fontSize: '32px',
              fontWeight: '900',
              color: 'white',
              marginBottom: '12px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            RDAM
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              lineHeight: '1.5',
              position: 'relative',
              zIndex: 1,
              fontWeight: '500',
            }}
          >
            Sistema de Certificados Digitales
          </p>
          <div
            style={{
              width: '80px',
              height: '3px',
              background: 'rgba(255,255,255,0.3)',
              margin: '16px auto 0',
              borderRadius: '2px',
              position: 'relative',
              zIndex: 1,
            }}
          ></div>

          <div style={{ marginTop: '32px', position: 'relative', zIndex: 1, width: '100%' }} className="cert-list">
            {['Residencia', 'Antecedentes', 'Nacimiento', 'Matrimonio', 'Defunción'].map((cert) => (
              <div
                key={cert}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.6)',
                  }}
                ></div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  Certificado de {cert}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DERECHA - Formulario */}
        <div className="auth-form-container">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '20px', fontWeight: '700' }}>
              Crear Cuenta
            </h2>
            <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
              Registrate para solicitar certificados
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  position: 'relative',
                  paddingLeft: '18px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: '#ef4444',
                    borderRadius: '10px 0 0 10px',
                  }}
                ></div>
                {error}
              </div>
            )}

            {/* Nombre */}
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '6px',
                }}
              >
                Nombre Completo *
              </label>
              <input
                type="text"
                value={form.nombreCompleto}
                onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
                placeholder="Juan Carlos Pérez"
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '6px',
                }}
              >
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="usuario@ejemplo.com"
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* CUIL */}
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '6px',
                }}
              >
                CUIL <span style={{ color: 'rgba(255,255,255,0.4)' }}>(opcional)</span>
              </label>
              <input
                type="text"
                value={form.cuil}
                onChange={(e) => setForm({ ...form, cuil: e.target.value })}
                placeholder="20-12345678-9"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '6px',
                }}
              >
                Contraseña *
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Confirmar Password */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '6px',
                }}
              >
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                value={form.confirmarPassword}
                onChange={(e) => setForm({ ...form, confirmarPassword: e.target.value })}
                placeholder="Repetí la contraseña"
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: isLoading
                  ? 'rgba(71,85,105,0.5)'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: isLoading ? 'none' : '0 0 25px rgba(59,130,246,0.4)',
                transition: 'all 0.3s',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                marginBottom: '16px',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(59,130,246,0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(59,130,246,0.4)';
              }}
            >
              {isLoading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </button>

            {/* Link al login */}
            <p
              style={{
                margin: 0,
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '13px',
              }}
            >
              ¿Ya tenés cuenta?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Iniciá sesión
              </span>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.3); }

        .auth-card {
          width: 100%;
          max-width: 700px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.2);
          border: 1px solid rgba(59,130,246,0.2);
        }

        .auth-branding {
          padding: 40px 32px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .auth-form-container {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .auth-card {
            grid-template-columns: 1fr;
            max-width: 400px;
          }

          .auth-branding {
            padding: 24px;
            min-height: 120px;
          }

          .auth-branding h1 {
            font-size: 24px !important;
          }

          .auth-branding svg {
            width: 24px;
            height: 24px;
          }
          
          .auth-branding > div:nth-child(2) { /* Logo container */
             width: 50px !important;
             height: 50px !important;
             margin-bottom: 12px !important;
             border-radius: 14px !important;
          }

          .cert-list {
            display: none; /* Opcional: Ocultar lista de certificados en móvil para ahorrar espacio */
          }
        }
      `}</style>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(30, 41, 59, 0.5)',
  border: '2px solid rgba(59,130,246,0.2)',
  borderRadius: '10px',
  color: 'white',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all 0.3s',
  fontFamily: 'inherit',
};
