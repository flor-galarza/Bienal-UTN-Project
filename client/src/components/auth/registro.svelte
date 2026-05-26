<script>
  let nombreapellido = '';
  let correo = '';
  let contraseña = '';
  let confirmcontraseña = '';
  const registrarUsuario = async () => {
  if (!nombreapellido || !correo || !contraseña|| !confirmcontraseña) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  if (confirmcontraseña!==contraseña) {
    alert('La contraseña y su confirmación no coinciden. Inténtelo de nuevo.');
    confirmcontraseña='';
    contraseña='';
    return;
  }

  console.log('Datos enviados:', { nombreapellido, correo, contraseña }); // Para depuración

  try {
    const response = await fetch('http://localhost:3001/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombreapellido,
        correo,
        contraseña,
      }),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data); // Para depuración

    if (data.success && data.token) {
      console.log(data.token)
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'usuario');
      console.log('usuario');
      window.location.href = '/inicio'; // Redirigir al login
    } else  if(response.status === 409) { alert(data.message); }
      else{ 
        alert(data.message || 'Error al registrar usuario');
    }
  } catch (error) {
    console.error('Error al intentar registrar usuario:', error);
    alert('Hubo un error al intentar registrar el usuario.');
  }
};
const cancelar = () => {
  if (confirm("¿Estás seguro de que deseas cancelar el registro?")) {
    window.location.href = '/login';
  }
};
</script>

<section class="form-container">
  <form on:submit|preventDefault={registrarUsuario} class="form">
    <div class="logo text-center">
      <h2>Registro</h2>
    </div>  
    <input type="text" placeholder="Nombre y Apellido" bind:value={nombreapellido} class="input" />
    <input type="email" placeholder="Correo electrónico" bind:value={correo} class="input" />
    <input type="password" placeholder="Contraseña" bind:value={contraseña} class="input" />
    <input type="password" placeholder="Confirmar contraseña" bind:value={confirmcontraseña} class="input" />
    <div class="button-group">
      <button type="submit" class="button">Registrarse</button>
      <button type="button" class="cancel-button" on:click={cancelar}>
        Cancelar
      </button>
    </div>
  </form>
</section>

<style>
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
