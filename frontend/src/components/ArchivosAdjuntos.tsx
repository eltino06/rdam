import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';

interface Archivo {
  id: string;
  nombre: string;
  url: string;
  tipo: string;
  fechaSubida: string;
}

interface Props {
  solicitudId: string;
  canUpload: boolean;
  estadoSolicitud?: string;
}

export const ArchivosAdjuntos: React.FC<Props> = ({ solicitudId, canUpload, estadoSolicitud }) => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadArchivos();
  }, [solicitudId]);

  const loadArchivos = async () => {
    try {
      const response = await apiClient.get(`/solicitudes/${solicitudId}/archivos`);
      setArchivos(response.data.data || []);
    } catch (error) {
      console.error('Error cargando archivos:', error);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setMensaje({ tipo: 'error', texto: 'El archivo no puede superar 10MB' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setMensaje({ tipo: 'error', texto: 'Solo se permiten imágenes y PDFs' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('archivo', file);
      await apiClient.post(`/solicitudes/${solicitudId}/archivos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMensaje({ tipo: 'success', texto: 'Archivo subido correctamente' });
      await loadArchivos();
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error al subir archivo' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const handleEliminar = async (archivoId: string) => {
    try {
      await apiClient.delete(`/solicitudes/${solicitudId}/archivos/${archivoId}`);
      setMensaje({ tipo: 'success', texto: 'Archivo eliminado' });
      await loadArchivos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar archivo' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const isImage = (tipo: string) => tipo.startsWith('image/');
  const canDownload = !estadoSolicitud || ['PAGADA', 'EMITIDA'].includes(estadoSolicitud);

  const cardStyle: React.CSSProperties = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    padding: '28px',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '24px',
  };

  const archivoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(15,23,42,0.4)',
    borderRadius: '10px',
    border: '1px solid rgba(59,130,246,0.1)',
    transition: 'all 0.3s',
  };

  const btnVerStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: 'rgba(59,130,246,0.1)',
    color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s',
  };

  const btnEliminarStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s',
  };

  return (
    <div style={cardStyle}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)' }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: 'white', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          Archivos Adjuntos
          {archivos.length > 0 && (
            <span style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
              {archivos.length}
            </span>
          )}
        </h3>
        {canUpload && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              padding: '8px 16px',
              background: isUploading ? 'rgba(71,85,105,0.5)' : 'rgba(59,130,246,0.1)',
              color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '8px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {isUploading ? 'Subiendo...' : 'Subir archivo'}
          </button>
        )}
      </div>

      {mensaje && (
        <div style={{
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '16px',
          background: mensaje.tipo === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${mensaje.tipo === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: mensaje.tipo === 'success' ? '#34d399' : '#f87171',
        }}>
          {mensaje.texto}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = '';
        }}
      />

      {canUpload && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#3b82f6' : 'rgba(59,130,246,0.2)'}`,
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: archivos.length > 0 ? '20px' : '0',
            background: dragOver ? 'rgba(59,130,246,0.05)' : 'transparent',
            transition: 'all 0.3s',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            Arrastrá un archivo o <span style={{ color: '#60a5fa' }}>hacé click</span>
          </p>
          <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
            JPG, PNG, GIF o PDF — Máx. 10MB
          </p>
        </div>
      )}

      {archivos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {archivos.map((archivo) => (
            <div key={archivo.id} style={archivoRowStyle}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'rgba(30,41,59,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(59,130,246,0.2)',
              }}>
                {isImage(archivo.tipo) ? (
                  <img
                    src={`http://localhost:3000${archivo.url}`}
                    alt={archivo.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: 'white', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {archivo.nombre}
                </p>
                <p style={{ margin: '2px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                  {new Date(archivo.fechaSubida).toLocaleDateString('es-AR')} — {isImage(archivo.tipo) ? 'Imagen' : 'PDF'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {canDownload ? (
                  <a
                    href={`http://localhost:3000${archivo.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={btnVerStyle}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    </svg>
                    <span>Ver</span>
                  </a>
                ) : (
                  <div
                    style={{
                      ...btnVerStyle,
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    }}
                    title="Disponible después del pago"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Pendiente de pago.</span>
                  </div>
                )}
                {canUpload && (
                  <button onClick={() => handleEliminar(archivo.id)} style={btnEliminarStyle}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {archivos.length === 0 && !canUpload && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          No hay archivos adjuntos en esta solicitud.
        </div>
      )}
    </div>
  );
};