import { useState, useEffect } from 'react'

function App() {
  const [nombres, setNombres] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editando, setEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [buscarId, setBuscarId] = useState('');
  const [nombreBuscado, setNombreBuscado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const API_URL = 'http://localhost:3001/api/nombres';

  // Obtener todos los nombres al cargar
  useEffect(() => {
    obtenerNombres();
  }, []);

  const obtenerNombres = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setNombres(data);
      setMensaje(`${data.length} nombres cargados`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error GET:', err);
      setMensaje('Error al cargar nombres');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const agregarNombre = async () => {
    if (!nuevoNombre.trim()) {
      setMensaje('Por favor ingresa un nombre');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nuevoNombre.trim() })
      });
      
      if (!respuesta.ok) throw new Error('Error en la respuesta');
      
      const data = await respuesta.json();
      
      setNombres([...nombres, data]);
      setNuevoNombre('');
      setMensaje(`Nombre "${data.nombre}" agregado (ID: ${data.id})`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error en POST:', error);
      setMensaje('Error al agregar nombre');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const buscarPorId = async () => {
    if (!buscarId.trim() || isNaN(buscarId)) {
      setMensaje('Ingresa un ID válido');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${buscarId}`);
      if (res.status === 404) {
        setNombreBuscado(null);
        setMensaje('Nombre no encontrado');
        setTimeout(() => setMensaje(''), 3000);
        return;
      }
      
      const data = await res.json();
      setNombreBuscado(data);
      setMensaje(`Nombre encontrado: ${data.nombre}`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error al buscar:', error);
      setMensaje('Error al buscar nombre');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const iniciarEdicion = (nombre) => {
    setEditando(nombre.id);
    setNombreEditado(nombre.nombre);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNombreEditado('');
  };

  const actualizarNombre = async (id) => {
    if (!nombreEditado.trim()) {
      setMensaje('El nombre no puede estar vacío');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombreEditado.trim() })
      });

      if (!res.ok) throw new Error('Error en la respuesta');

      const data = await res.json();
      
      setNombres(nombres.map(n => n.id === id ? data : n));
      setEditando(null);
      setMensaje(`Nombre actualizado a "${data.nombre}"`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error en PUT:', error);
      setMensaje('Error al actualizar nombre');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const eliminarNombre = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el nombre "${nombre}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error en la respuesta');

      setNombres(nombres.filter(n => n.id !== id));
      setNombreBuscado(null);
      setMensaje(`Nombre "${nombre}" eliminado`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error en DELETE:', error);
      setMensaje('Error al eliminar nombre');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
  <h1 style={{ color: '#333', marginBottom: '10px' }}>Gestor de Nombres CRUD</h1>
  <p style={{ color: '#666', marginBottom: '20px' }}>Backend corriendo en: http://localhost:3001</p>
  
  {mensaje && (
    <div style={{
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#e8f5e8',
      border: '1px solid #4CAF50',
      borderRadius: '4px',
      color: '#2e7d32'
    }}>
      {mensaje}
    </div>
  )}
  
  <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
    <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ marginTop: '0', color: '#333' }}>Agregar Nuevo Nombre</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Ingresa un nombre"
          onKeyPress={(e) => e.key === 'Enter' && agregarNombre()}
          style={{ 
            flex: 1, 
            padding: '8px 12px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <button 
          onClick={agregarNombre}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Agregar
        </button>
      </div>
    </div>

    <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ marginTop: '0', color: '#333' }}>Buscar Nombre por ID</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="number"
          value={buscarId}
          onChange={(e) => setBuscarId(e.target.value)}
          placeholder="ID del nombre"
          onKeyPress={(e) => e.key === 'Enter' && buscarPorId()}
          style={{ 
            flex: 1, 
            padding: '8px 12px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <button 
          onClick={buscarPorId}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Buscar
        </button>
      </div>
      
      {nombreBuscado && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderLeft: '4px solid #2196F3',
          borderRadius: '4px'
        }}>
          <h3 style={{ marginTop: '0', color: '#333' }}>Resultado de búsqueda:</h3>
          <p><strong>ID:</strong> {nombreBuscado.id}</p>
          <p><strong>Nombre:</strong> {nombreBuscado.nombre}</p>
        </div>
      )}
    </div>
  </div>

  <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
      <h2 style={{ margin: '0', color: '#333' }}>Lista de Nombres ({nombres.length})</h2>
      <button 
        onClick={obtenerNombres}
        style={{ 
          padding: '8px 16px',
          backgroundColor: '#9C27B0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Actualizar Lista
      </button>
    </div>
    
    {nombres.length === 0 ? (
      <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No hay nombres guardados</p>
    ) : (
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginTop: '10px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ 
              padding: '12px 8px', 
              textAlign: 'left', 
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold'
            }}>
              ID
            </th>
            <th style={{ 
              padding: '12px 8px', 
              textAlign: 'left', 
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold'
            }}>
              Nombre
            </th>
            <th style={{ 
              padding: '12px 8px', 
              textAlign: 'left', 
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold'
            }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {nombres.map(nombre => (
            <tr key={nombre.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 8px' }}>{nombre.id}</td>
              <td style={{ padding: '12px 8px' }}>
                {editando === nombre.id ? (
                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && actualizarNombre(nombre.id)}
                    autoFocus
                    style={{ 
                      padding: '6px 8px',
                      border: '1px solid #4CAF50',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  />
                ) : (
                  nombre.nombre
                )}
              </td>
              <td style={{ padding: '12px 8px' }}>
                {editando === nombre.id ? (
                  <>
                    <button 
                      onClick={() => actualizarNombre(nombre.id)}
                      style={{ 
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={cancelarEdicion}
                      style={{ 
                        padding: '6px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => iniciarEdicion(nombre)}
                      style={{ 
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarNombre(nombre.id, nombre.nombre)}
                      style={{ 
                        padding: '6px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>

  <div style={{ 
    marginTop: '20px', 
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#666'
  }}>
    <p style={{ margin: '0' }}>Endpoints: GET, POST, PUT, DELETE en /api/nombres</p>
  </div>
</div>
)
}

export default App