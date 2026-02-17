import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate();;

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.tipo === 'CIUDADANO') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/interno/dashboard';
      }
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px',
    }}>
      {/* Container principal - Horizontal */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        background: 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.2)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
      }}>
        {/* LADO IZQUIERDO - Branding */}
        <div style={{
          padding: '30px 30px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Patrón de fondo sutil */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}></div>

          {/* Logo */}
          <div style={{
            width: '70px',
            height: '70px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
              borderRadius: '20px 20px 0 0',
            }}></div>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{position: 'relative', zIndex: 1}}>
              <path d="M3 21h18" />
              <path d="M9 8h1" />
              <path d="M9 12h1" />
              <path d="M9 16h1" />
              <path d="M14 8h1" />
              <path d="M14 12h1" />
              <path d="M14 16h1" />
              <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
            </svg>
          </div>

          {/* Texto */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            color: 'white',
            marginBottom: '12px',
            letterSpacing: '-0.04em',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            RDAM
          </h1>

          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            lineHeight: '1.5',
            maxWidth: '250px',
            position: 'relative',
            zIndex: 1,
            fontWeight: '500',
          }}>
            Sistema de Certificados Digitales
          </p>

          <div style={{
            width: '80px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.3)',
            margin: '16px auto 0',
            borderRadius: '2px',
            position: 'relative',
            zIndex: 1,
          }}></div>
        </div>

        {/* LADO DERECHO - Formulario */}
        <div style={{
          padding: '30px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '6px',
            }}>
              Iniciar Sesión
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
            }}>
              Ingresa tus credenciales
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '13px',
                position: 'relative',
                paddingLeft: '18px',
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: '#ef4444',
                  borderRadius: '10px 0 0 10px',
                }}></div>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '6px',
              }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px',
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
                  required
                />
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '6px',
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px',
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
                  required
                />
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: isLoading 
                  ? 'rgba(71, 85, 105, 0.5)' 
                  : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: isLoading ? 'none' : '0 0 25px rgba(59, 130, 246, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(59, 130, 246, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.4)';
              }}
            >
              {isLoading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
            </button>
     </form>

            {/* Link al registro */}
            <p style={{ margin: '16px 0 0 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              ¿No tenés cuenta?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
              >
                Registrate
              </span>
            </p>

            {/* Usuarios de prueba */}
            <div style={{
              marginTop: '20px',
            padding: '14px',
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '10px',
            border: '1px solid rgba(59, 130, 246, 0.1)',
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '9px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              CREDENCIALES DE PRUEBA
            </p>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' }}>
              <p style={{ margin: '3px 0' }}><strong style={{color: '#60a5fa'}}>Ciudadano:</strong> ciudadano@test.com</p>
              <p style={{ margin: '3px 0' }}><strong style={{color: '#60a5fa'}}>Operador:</strong> operador@rdam.gob.ar</p>
              <p style={{ margin: '3px 0' }}><strong style={{color: '#60a5fa'}}>Admin:</strong> admin@rdam.gob.ar</p>
              <p style={{ margin: '6px 0 0 0', fontSize: '10px' }}>
                <span style={{color: 'rgba(255, 255, 255, 0.5)'}}>Pass: </span>
                <code style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '3px 6px',
                  borderRadius: '5px',
                  color: '#60a5fa',
                  fontFamily: 'monospace',
                }}>Usuario123!</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};