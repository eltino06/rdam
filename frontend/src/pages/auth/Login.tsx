import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codigo, setCodigo] = useState('');
  const [step, setStep] = useState<'login' | 'codigo'>('login');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.tipo === 'CIUDADANO') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/interno/dashboard';
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); //
    setError('');
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.requiresCode) {
        setStep('codigo');
        setCountdown(600); // 10 minutos
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verificar-codigo', { email, codigo });
      const { access_token, user: userData } = response.data.data;
      await login(email, password, access_token, userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código inválido o expirado');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = () => {
    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #203450 0%, #1a2942 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '24px',
      }}
    >
      <div className="auth-card">
        {/* IZQUIERDA */}
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

          {step === 'codigo' && (
            <div
              style={{
                marginTop: '32px',
                padding: '20px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '14px',
                position: 'relative',
                zIndex: 1,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p style={{ margin: 0, color: 'white', fontSize: '13px', fontWeight: '700' }}>
                  Verificación activa
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '12px',
                  lineHeight: '1.5',
                }}
              >
                Código enviado a <strong>{email}</strong>
              </p>
              {countdown > 0 && (
                <p
                  style={{
                    margin: '8px 0 0 0',
                    color: '#fbbf24',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                >
                  Expira en: {formatCountdown()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* DERECHA */}
        <div className="auth-form-container">
          {step === 'login' ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: '20px', fontWeight: '700' }}>
                  Iniciar Sesión
                </h2>
                <p
                  style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}
                >
                  Ingresá tus credenciales
                </p>
              </div>

              <form onSubmit={handleLogin}>
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

                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '6px',
                    }}
                  >
                    Correo Electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    <div
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                  </div>
                </div>

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
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                    <div
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={btnStyle(isLoading)}
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
                  {isLoading ? 'ENVIANDO CÓDIGO...' : 'CONTINUAR'}
                </button>
              </form>

              <p
                style={{
                  margin: '16px 0 0 0',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '13px',
                }}
              >
                ¿No tenés cuenta?{' '}
                <span
                  onClick={() => navigate('/register')}
                  style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }}
                >
                  Registrate
                </span>
              </p>

              {/* Credenciales de prueba */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  borderRadius: '10px',
                  border: '1px solid rgba(59,130,246,0.1)',
                }}
              >
                <p
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '9px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                  }}
                >
                  CREDENCIALES DE PRUEBA
                </p>
                <div
                  style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}
                >
                  <p style={{ margin: '3px 0' }}>
                    <strong style={{ color: '#60a5fa' }}>Ciudadano:</strong>{' '}
                    rdamcertificados@gmail.com
                  </p>
                  <p style={{ margin: '3px 0' }}>
                    <strong style={{ color: '#60a5fa' }}>Operador:</strong> operador@rdam.gob.ar
                  </p>
                  <p style={{ margin: '3px 0' }}>
                    <strong style={{ color: '#60a5fa' }}>Admin:</strong> admin@rdam.gob.ar
                  </p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pass: </span>
                    <code
                      style={{
                        background: 'rgba(59,130,246,0.1)',
                        padding: '3px 6px',
                        borderRadius: '5px',
                        color: '#60a5fa',
                        fontFamily: 'monospace',
                      }}
                    >
                      Usuario123!
                    </code>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(139,92,246,0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h2 style={{ margin: 0, color: 'white', fontSize: '20px', fontWeight: '700' }}>
                  Verificación
                </h2>
                <p
                  style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}
                >
                  Ingresá el código enviado a tu email
                </p>
              </div>

              <form onSubmit={handleVerificarCodigo}>
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
                    Código de 6 dígitos
                  </label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    style={{
                      ...inputStyle,
                      textAlign: 'center',
                      fontSize: '28px',
                      fontWeight: '800',
                      letterSpacing: '12px',
                      paddingLeft: '14px',
                      color: '#a78bfa',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || codigo.length !== 6}
                  style={{
                    ...btnStyle(isLoading || codigo.length !== 6),
                    background:
                      isLoading || codigo.length !== 6
                        ? 'rgba(71,85,105,0.5)'
                        : 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
                    boxShadow:
                      isLoading || codigo.length !== 6 ? 'none' : '0 0 25px rgba(139,92,246,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    if (codigo.length === 6 && !isLoading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isLoading ? 'VERIFICANDO...' : 'VERIFICAR CÓDIGO'}
                </button>
              </form>

              <button
                onClick={() => {
                  setStep('login');
                  setError('');
                  setCodigo('');
                }}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '10px',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                ← Volver al login
              </button>
            </>
          )}
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
          padding: 40px 30px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .auth-form-container {
          padding: 30px;
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
        }
      `}</style>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px 12px 42px',
  background: 'rgba(30,41,59,0.5)',
  border: '2px solid rgba(59,130,246,0.2)',
  borderRadius: '10px',
  color: 'white',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all 0.3s',
  fontFamily: 'inherit',
};

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '13px',
  background: disabled
    ? 'rgba(71,85,105,0.5)'
    : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: disabled ? 'not-allowed' : 'pointer',
  boxShadow: disabled ? 'none' : '0 0 25px rgba(59,130,246,0.4)',
  transition: 'all 0.3s',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
});
