<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import axios from 'axios';

  let artistas = [];  // Inicializamos un array vacío para los artistas.

  // Función para obtener artistas desde la API
  async function fetchArtistas(query = "", criterio = 'nombre', orden = 'ASC') {
    try {
      const res = await axios.get(`http://localhost:3001/api/escultores`, {
        params: {
          search: query,     // Parámetro de búsqueda
          sortBy: criterio,  // Criterio de ordenación (nombre, f_creacion, promedio)
          order: orden       // Orden (asc o desc)
        }
      });
      // Extraemos solo los nombres y el DNI de los artistas
      artistas = res.data.map(artista => ({
        nombre: artista.escultorName, // Asegúrate de que 'escultorName' sea el campo correcto en la respuesta
        dni: artista.dni,             // Asegúrate de que 'DNI' sea el campo correcto en la respuesta
        email:artista.contactoEmail,
        nacionalidad:artista.nacionalidad,
        url: artista.escultorPantalla
      
      }));
    } catch (error) {
      console.log(error);
      artistas = []; // Si hay un error, asignamos un array vacío
    }
  }

  // Llamar la función de fetch cuando el componente se monte
  onMount(() => {
      fetchArtistas();
  });

  // Función para redirigir a las páginas de edición o alta de artistas
  const editarArtista = (dni) => {
      window.location.href = `/admin/artistas/${dni}`; // Redirige a la página de edición con el ID del artista
  };

  // Función para borrar un artista
  const eliminarArtista = async (dni) => {
    try {
        const res = await axios.post('http://localhost:3001/api/borrarArtista', { dni });

        // Verificar que el artista fue borrado exitosamente
        if (res.status === 200) {
            alert('Artista borrado con éxito');
            // Recargar la lista de artistas después de eliminar uno
            fetchArtistas();
        }
    } catch (error) {
        console.error('Error al borrar el artista:', error);
        alert('Error al borrar el artista');
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
  <h1>Lista de Artistas</h1>
</div>

<div class="container">
  <div class="botones-izquierda">
    <button class="btn-azul" on:click={() => redirigir('/admin/artistas/alta_artista')}>Agregar Artista</button>
    <button class="btn-rojo" on:click={volver}>Volver</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>DNI</th>
        <th>Email</th>
        <th>Nacionalidad</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each artistas as { nombre, dni, email, nacionalidad, url }}
        <tr>
          <td>{nombre}</td>
          <td>{dni}</td>
          <td>{email}</td>
          <td>{nacionalidad}</td>
          <td class="acciones">
            <button class="btn-editar" on:click={() => editarArtista(url)}>✏️</button>
            <button class="btn-eliminar" on:click={() => eliminarArtista(dni)}>❌</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
