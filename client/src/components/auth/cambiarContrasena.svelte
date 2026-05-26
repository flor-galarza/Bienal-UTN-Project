<script>
  // @ts-nocheck
  import { writable } from 'svelte/store';

  let contraseña_actual = '';
  let contraseña_nueva1 = '';
  let contraseña_nueva2 = '';
  let mostrarContrasena = writable(false); // Controla si la contraseña es visible

  const toggleVisibilidad = () => {
    mostrarContrasena.update(value => !value);
  };


  const cambiarContraseña = async () => {
    if (!contraseña_actual || !contraseña_nueva1 || !contraseña_nueva2) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  function decodificarToken(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  } 
  const token = localStorage.getItem('token');
  const email = token ? decodificarToken(token).correo : '';
  
  if (contraseña_nueva1 !== contraseña_nueva2) {
    alert('Las contraseñas nuevas no coinciden.');
    return;
  }

  console.log('Datos enviados:', { email, contraseña_actual, contraseña_nueva1 }); // Para depuración

  try {
    const response = await fetch('http://localhost:3001/api/cambiarContrasena', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        contraseña_actual,
        contraseña_nueva1
      }),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data); // Para depuración

    if (data.success) {
      alert('Contraseña cambiada correctamente.');
      window.history.back();
    } else  if(response.status === 409) { alert(data.message); }
      else{ 
        alert(data.message || 'Error al cambiar la contraseña');
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    alert('Hubo un error al intentar cambiar la contraseña.');
  }
};
const cancelar = () => {
  if (confirm("¿Estás seguro de que deseas cancelar el cambio de contraseña?")) {
    window.history.back();
  }
};
</script>

<section class="form-container">
  <form on:submit|preventDefault={cambiarContraseña} class="form">
    <div class="logo text-center">
      <h2>Cambio de Contraseña</h2>
    </div>
    <p class="texto-blanco">Contraseña actual</p>
    <div class="input-group">
      {#if $mostrarContrasena}
        <input
          type="text"
          placeholder="..."
          bind:value={contraseña_actual}
          class="input"
        />
      {:else}
        <input
          type="password"
          placeholder="..."
          bind:value={contraseña_actual}
          class="input"
        />
      {/if}
      <button type="button" class="eye-button" on:click={toggleVisibilidad}>
        {#if $mostrarContrasena}
          👁️
        {:else}
          👁️‍🗨️
        {/if}
      </button>
    </div>
    <p class="texto-blanco">Contraseña nueva</p>
    <div class="input-group">
      {#if $mostrarContrasena}
        <input
          type="text"
          placeholder="..."
          bind:value={contraseña_nueva1}
          class="input"
        />
      {:else}
        <input
          type="password"
          placeholder="..."
          bind:value={contraseña_nueva1}
          class="input"
        />
      {/if}
      <button type="button" class="eye-button" on:click={toggleVisibilidad}>
        {#if $mostrarContrasena}
          👁️
        {:else}
          👁️‍🗨️
        {/if}
      </button>
    </div>
    <p class="texto-blanco">Repetir contraseña nueva</p>
    <div class="input-group">
      {#if $mostrarContrasena}
        <input
          type="text"
          placeholder="..."
          bind:value={contraseña_nueva2}
          class="input"
        />
      {:else}
        <input
          type="password"
          placeholder="..."
          bind:value={contraseña_nueva2}
          class="input"
        />
      {/if}
      <button type="button" class="eye-button" on:click={toggleVisibilidad}>
        {#if $mostrarContrasena}
          👁️
        {:else}
          👁️‍🗨️
        {/if}
      </button>
    </div>

    <div class="button-group">
      <button type="submit" class="button">Aceptar</button>
      <button type="button" class="cancel-button" on:click={cancelar}>
        Cancelar
      </button>
    </div>
  </form>
</section>

<style>
  .texto-blanco {
    color: white;
  }

  .input-group {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .input {
    flex: 1;
    padding-right: 2.5rem; /* Espacio para el botón */
  }
  
  .eye-button {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
  }
  /* Contenedor principal centrado */
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Toda la altura de la ventana */
    background: var(--bg-color, #f4f4f4); /* Fondo claro */
    padding: 1rem;
  }

  h2 {
    margin-bottom: 1.5rem;
    font-size: 2rem;
    color: var(--primary-color, #333);
    font-weight: normal; /* Establece el peso de la fuente a normal */
  }

  .logo h2 {
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: white;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .input {
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .input:focus {
    border-color: var(--primary-color, #0066cc);
    box-shadow: 0 0 6px rgba(0, 102, 204, 0.3);
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  /* Botón de registrarse */
  .button {
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(to right, #0066cc, #00bcd4); /* Gradiente azul */
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .button:hover {
    background: linear-gradient(to right, var(--button-hover-start, #005bb5), var(--button-hover-end, #0097a7));
  }

  /* Botón cancelar: gradiente rojo con estilo independiente */
  .cancel-button {
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(to right, #5f0404, #fc0101) !important; /* Gradiente rojo */
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .cancel-button:hover {
    background: linear-gradient(to right, #9b1515, #fc0101) !important; /* Gradiente rojo oscuro */
  }

  .button, .cancel-button {
    flex: 1; /* Hace que ambos botones crezcan uniformemente */
    text-align: center;
  }

  /* Modo oscuro */
  @media (prefers-color-scheme: dark) {
    .form-container {
      background: linear-gradient(to bottom, #333, #222);
    }

    h2 {
      color: #fff;
      font-style: normal;
    }

    .form {
      background: #1e1e1e;
    }

    .input {
      background: #1e1e1e;
      color: #fff;
      border: 1px solid #666;
    }

    .input:focus {
      border-color: #00bcd4;
    }

    .button {
      background: linear-gradient(to right, #004c99, #008ba3);
    }
  }
</style>
