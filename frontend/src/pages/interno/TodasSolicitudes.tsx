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
    if (estadoParam) {
      setFiltroEstado(estadoParam);
    }
    loadSolicitudes();
  }, [searchParams]);

  const loadSolicitudes = async () => {
    try {
      const response = await solicitudesApi.getAll();
      let data = response.data;

      // Filtrar por estado si existe
      const estadoParam = searchParams.get('estado');
      if (estadoParam) {
        data = data.filter((s: any) => s.estado === estadoParam);
      }

      setSolicitudes(data);
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
    ? solicitudes.filter(s => s.estado === filtroEstado)
    : solicitudes;

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
            onClick={() => navigate('/interno/dashboard')}
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
            ← Dashboard
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Todas las Solicitudes</h2>
          
          {/* Filtro de Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => handleFiltroChange(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE_REVISION">Pendiente Revisión</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
            <option value="PENDIENTE_PAGO">Pendiente Pago</option>
            <option value="PAGADA">Pagada</option>
            <option value="EMITIDA">Emitida</option>
          </select>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando...</p>
          </div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
            <h3 style={{ color: '#666' }}>No hay solicitudes</h3>
            <p style={{ color: '#999' }}>
              {filtroEstado ? 'No hay solicitudes con este estado' : 'Aún no se han recibido solicitudes'}
            </p>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
                    Número
                  </th>
                  <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
                    Ciudadano
                  </th>
                  <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
                    Tipo
                  </th>
                  <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
                    Estado
                  </th>
                  <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
                    Fecha
                  </th>
                  <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>
                      {solicitud.numeroSolicitud}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      {solicitud.ciudadanoNombre}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      {solicitud.tipoCertificado}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: getEstadoColor(solicitud.estado),
                        color: 'white',
                      }}>
                        {getEstadoTexto(solicitud.estado)}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      {new Date(solicitud.fechaCreacion).toLocaleDateString('es-AR')}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <button
                        onClick={() => navigate(`/interno/solicitudes/${solicitud.id}`)}
                        style={{
                          padding: '8px 16px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
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