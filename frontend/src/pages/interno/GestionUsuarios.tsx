import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';

export const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    tipo: 'INTERNO',
    rol: 'OPERADOR',
    cuil: '',
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.rol !== 'ADMIN') {
      navigate('/interno/dashboard');
      return;
    }
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await apiClient.get('/usuarios');
      setUsuarios(response.data.data || response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando) {
        const { password, ...datos } = form;
        await apiClient.patch(`/usuarios/${editando.id}`, password ? form : datos);
        setMensaje({ tipo: 'success', texto: 'Usuario actualizado correctamente' });
      } else {
        await apiClient.post('/usuarios', form);
        setMensaje({ tipo: 'success', texto: 'Usuario creado correctamente' });
      }
      setShowModal(false);
      setEditando(null);
      resetForm();
      await loadUsuarios();
    } catch (error: any) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al guardar usuario',
      });
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  const handleEditar = (usuario: any) => {
    setEditando(usuario);
    setForm({
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      password: '',
      tipo: usuario.tipo,
      rol: usuario.rol,
      cuil: usuario.cuil || '',
    });
    setShowModal(true);
  };

  const handleToggleActivo = async (usuario: any) => {
    try {
      await apiClient.patch(`/usuarios/${usuario.id}`, {
        activo: !usuario.activo,
      });
      setMensaje({
        tipo: 'success',
        texto: `Usuario ${!usuario.activo ? 'activado' : 'desactivado'} correctamente`,
      });
      await loadUsuarios();
    } catch (error: any) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al actualizar usuario',
      });
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  const resetForm = () => {
    setForm({
      nombreCompleto: '',
      email: '',
      password: '',
      tipo: 'INTERNO',
      rol: 'OPERADOR',
      cuil: '',
    });
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombreCompleto?.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email?.toLowerCase().includes(filtro.toLowerCase()) ||
      u.rol?.toLowerCase().includes(filtro.toLowerCase()),
  );

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

      {/* Mensaje */}
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
              mensaje.tipo === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${mensaje.tipo === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color: mensaje.tipo === 'success' ? '#34d399' : '#f87171',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
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
              Gestión de Usuarios
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
              {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? 's' : ''}{' '}
              registrado{usuariosFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Buscador */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{
                  padding: '12px 16px 12px 44px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  width: '240px',
                  transition: 'all 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(59,130,246,0.3)';
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
                  stroke="rgba(59,130,246,0.6)"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setEditando(null);
                setShowModal(true);
              }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                boxShadow: '0 0 25px rgba(59,130,246,0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(59,130,246,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(59,130,246,0.4)';
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: 'Total Usuarios', value: usuarios.length, color: '#3b82f6' },
            {
              label: 'Administradores',
              value: usuarios.filter((u) => u.rol === 'ADMIN').length,
              color: '#a78bfa',
            },
            {
              label: 'Operadores',
              value: usuarios.filter((u) => u.rol === 'OPERADOR').length,
              color: '#34d399',
            },
            {
              label: 'Ciudadanos',
              value: usuarios.filter((u) => u.tipo === 'CIUDADANO').length,
              color: '#fbbf24',
            },
            {
              label: 'Activos',
              value: usuarios.filter((u) => u.activo !== false).length,
              color: '#10b981',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                backdropFilter: 'blur(20px)',
                padding: '20px 24px',
                borderRadius: '12px',
                border: `1px solid ${stat.color}30`,
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
                  background: stat.color,
                }}
              ></div>
              <p
                style={{
                  margin: '0 0 6px 0',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </p>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.5)' }}>
            Cargando...
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
                  {['Nombre', 'Email', 'Tipo', 'Rol', 'Estado', 'Acciones'].map((h) => (
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
                {usuariosFiltrados.map((u) => (
                  <tr
                    key={u.id}
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
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: getRolColor(u.rol) + '20',
                            border: `1px solid ${getRolColor(u.rol)}40`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: '700',
                            color: getRolColor(u.rol),
                            flexShrink: 0,
                          }}
                        >
                          {u.nombreCompleto?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '14px',
                            }}
                          >
                            {u.nombreCompleto}
                          </p>
                          {u.cuil && (
                            <p
                              style={{
                                margin: 0,
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '12px',
                              }}
                            >
                              CUIL: {u.cuil}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '20px 24px',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '14px',
                      }}
                    >
                      {u.email}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background:
                            u.tipo === 'CIUDADANO'
                              ? 'rgba(251,191,36,0.15)'
                              : 'rgba(59,130,246,0.15)',
                          color: u.tipo === 'CIUDADANO' ? '#fbbf24' : '#60a5fa',
                          border: `1px solid ${u.tipo === 'CIUDADANO' ? 'rgba(251,191,36,0.3)' : 'rgba(59,130,246,0.3)'}`,
                        }}
                      >
                        {u.tipo}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: getRolColor(u.rol) + '20',
                          color: getRolColor(u.rol),
                          border: `1px solid ${getRolColor(u.rol)}40`,
                        }}
                      >
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background:
                            u.activo !== false ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: u.activo !== false ? '#34d399' : '#f87171',
                          border: `1px solid ${u.activo !== false ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        }}
                      >
                        {u.activo !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditar(u)}
                          style={{
                            padding: '7px 14px',
                            background: 'rgba(59,130,246,0.1)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59,130,246,0.3)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '12px',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59,130,246,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                          }}
                        >
                          Editar
                        </button>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleToggleActivo(u)}
                            style={{
                              padding: '7px 14px',
                              background:
                                u.activo !== false ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                              color: u.activo !== false ? '#f87171' : '#34d399',
                              border: `1px solid ${u.activo !== false ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '12px',
                              transition: 'all 0.3s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                u.activo !== false ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                u.activo !== false ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)';
                            }}
                          >
                            {u.activo !== false ? 'Desactivar' : 'Activar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
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
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '520px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              maxHeight: '90vh',
              overflowY: 'auto',
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
              style={{ margin: '0 0 8px 0', color: 'white', fontSize: '20px', fontWeight: '700' }}
            >
              {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <p style={{ margin: '0 0 28px 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              {editando
                ? 'Modifica los datos del usuario'
                : 'Completa los datos para crear un nuevo usuario'}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Nombre */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '8px',
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
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '8px',
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

              {/* Password */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  Contraseña {editando ? '(dejar vacío para no cambiar)' : '*'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required={!editando}
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
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  CUIL
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

              {/* Grid tipo y rol */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '28px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Tipo *
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                    }}
                  >
                    <option value="INTERNO" style={{ background: '#1e293b' }}>
                      INTERNO
                    </option>
                    <option value="CIUDADANO" style={{ background: '#1e293b' }}>
                      CIUDADANO
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Rol *
                  </label>
                  <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.2)';
                    }}
                  >
                    <option value="OPERADOR" style={{ background: '#1e293b' }}>
                      OPERADOR
                    </option>
                    <option value="ADMIN" style={{ background: '#1e293b' }}>
                      ADMIN
                    </option>
                    <option value="CIUDADANO" style={{ background: '#1e293b' }}>
                      CIUDADANO
                    </option>
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditando(null);
                    resetForm();
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'rgba(100,116,139,0.2)',
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(100,116,139,0.3)',
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
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    boxShadow: '0 0 20px rgba(59,130,246,0.4)',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.4)';
                  }}
                >
                  {editando ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(30, 41, 59, 0.5)',
  border: '2px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '10px',
  color: 'white',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all 0.3s',
  fontFamily: 'inherit',
};

function getRolColor(rol: string): string {
  const colors: any = {
    ADMIN: '#a78bfa',
    OPERADOR: '#34d399',
    CIUDADANO: '#fbbf24',
  };
  return colors[rol] || '#60a5fa';
}
