<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  let esculturas = [];  // Inicializamos un array vacío para las esculturas.

  // Función para obtener esculturas desde la API
  async function fetchEsculturas(query = "", criterio = 'promedio', orden = 'DESC') {
    try {
      const res = await axios.get(`http://localhost:3001/api/esculturas`, {
        params: {
          search: query,     // Parámetro de búsqueda
          sortBy: criterio,  // Criterio de ordenación (titulo, f_creacion, promedio)
          order: orden       // Orden (asc o desc)
        }
      });

      // Extraemos solo los campos necesarios de las esculturas
      esculturas = res.data.map(escultura => ({
        nombreEscultura: escultura.obraName,        // Título de la escultura
        id: escultura.id,               // ID de la escultura
        fechaCreacion: escultura.f_creacion, // Fecha de creación
        promedio: escultura.promedio     // Promedio o puntuación
      }));
    } catch (error) {
      console.log(error);
      esculturas = []; // Si hay un error, asignamos un array vacío
    }
  }

  // Llamar la función de fetch cuando el componente se monte
  onMount(() => {
    fetchEsculturas();
  });

  // Función para redirigir a las páginas de edición o alta de esculturas
  const editarEscultura = (id) => {
    console.log(`Editar escultura con ID: ${id}`);
    window.location.href = `/admin/esculturas/mod_escultura/${id}`; // Redirige a la página de edición con el ID de la escultura
  };

  // Función para borrar una escultura
  const eliminarEscultura = async (nombreEscultura) => {
    try {
      const res = await axios.post('http://localhost:3001/api/borrarEscultura', { nombreEscultura });

      // Verificar que la escultura fue borrada exitosamente
      if (res.status === 200) {
        alert('Escultura borrada con éxito');
        // Recargar la lista de esculturas después de eliminar una
        fetchEsculturas();
      }
    } catch (error) {
      console.error('Error al borrar la escultura:', error);
      alert('Error al borrar la escultura');
    }
  };

  const redirigir = (ruta) => {
    window.location.href = ruta; // Redirige a la ruta especificada
  };

  const confirmar = () => {
    console.log('Acción confirmada');
    // Lógica para confirmar
  };

  const volver = () => {
    window.location.href = '/admin';
  };
</script>

<style>
  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
  }

  .header {
    text-align: center;
    margin: 20px auto;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
    font-weight: bold;
  }

  .container {
    display: flex;
    align-items: flex-start;
  }

  .botones-izquierda {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 20px;
    margin-top: 20px;
    gap: 10px;
  }

  .btn-azul {
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-verde {
    background-color: #27ae60;
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-rojo {
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-azul:hover {
    background-color: #2980b9;
  }

  .btn-verde:hover {
    background-color: #2ecc71;
  }

  .btn-rojo:hover {
    background-color: #c0392b;
  }

  table {
    width: 70%;
    margin: 0 auto;
    border-collapse: collapse;
    background: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }

  td {
    color: #333;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  .acciones {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .btn-editar {
    background-color: #fbc531;
    border: none;
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 4px;
    font-weight: bold;
    color: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-eliminar {
    background-color: #e84118;
    border: none;
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 4px;
    font-weight: bold;
    color: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-editar:hover {
    background-color: #f5c327;
  }

  .btn-eliminar:hover {
    background-color: #d63031;
  }
</style>

<div class="header">
  <h1>Lista de Esculturas</h1>
</div>

<div class="container">
  <div class="botones-izquierda">
    <button class="btn-azul" on:click={() => redirigir('/admin/esculturas/alta_escultura')}>Agregar Escultura</button>
    <button class="btn-verde" on:click={confirmar}>Confirmar</button>
    <button class="btn-rojo" on:click={volver}>Volver</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Fecha de Creación</th>
        <th>Promedio</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each esculturas as { id, nombreEscultura, fechaCreacion, promedio }}
        <tr>
          <td>{nombreEscultura}</td>
          <td>{fechaCreacion}</td>
          <td>{promedio}</td>
          <td class="acciones">
            <button class="btn-editar" on:click={() => editarEscultura(nombreEscultura)}>✏️</button>
            <button class="btn-eliminar" on:click={() => eliminarEscultura(nombreEscultura)}>❌</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
