import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { solicitudesApi } from '../../api/solicitudes.api';

export const DashboardInterno: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await solicitudesApi.getDashboardInterno();
      setDashboard(response.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
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
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>🏛️ RDAM - Panel Interno</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            {user?.nombreCompleto} - {user?.rol}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/interno/solicitudes')}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Ver Todas las Solicitudes
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
      <div style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Dashboard - Gestión de Solicitudes</h2>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Total de Solicitudes
            </p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
              {dashboard?.total || 0}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Pendientes de Revisión
            </p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
              {dashboard?.pendientesRevision || 0}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Pagadas - Sin Emitir
            </p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
              {dashboard?.pagadasSinEmitir || 0}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Emitidas Hoy
            </p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
              {dashboard?.emitidasHoy || 0}
            </p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Acciones Rápidas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button
              onClick={() => navigate('/interno/solicitudes?estado=PENDIENTE_REVISION')}
              style={{
                padding: '20px',
                background: '#ffc107',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'left',
              }}
            >
              📋 Revisar Pendientes
            </button>
            <button
              onClick={() => navigate('/interno/solicitudes?estado=PAGADA')}
              style={{
                padding: '20px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'left',
              }}
            >
              📄 Emitir Certificados
            </button>
            <button
              onClick={() => navigate('/interno/solicitudes')}
              style={{
                padding: '20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'left',
              }}
            >
              🔍 Ver Todas
            </button>
            {user?.rol === 'ADMIN' && (
              <button
                onClick={() => navigate('/interno/usuarios')}
                style={{
                  padding: '20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textAlign: 'left',
                }}
              >
                👥 Gestión de Usuarios
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};