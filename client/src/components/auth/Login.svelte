<script>
  // @ts-nocheck
  import { onMount } from 'svelte';

  let correo = '';
  let contraseña = '';
  let mounted = false;

  onMount(() => {
    mounted = true;
    if (localStorage.getItem('token')) {
      window.location.href = '/inicio';
    }
  });

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

  const iniciarSesion = async () => {
    if (!correo || !contraseña) {
      alert('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
          contraseña: contraseña,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        if (data.role === 'admin') {
          window.location.href = '/admin';
        } else if (data.role === 'escultor') {
          let nombre = decodificarToken(data.token).nombre.replace(/ /g, '');
          window.location.href = `/escultores/${nombre}`;
        } else {
          window.location.href = '/inicio';
        }
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      alert('Hubo un error al intentar iniciar sesión');
    }
  };
</script>

<section class="gradient-form">
  <div class="container">
    <div class="content">
      <div class="form-wrapper">
        <!-- Columna izquierda -->
        <div class="form-content">
          <div class="logo text-center">
            <img
              src="https://raw.githubusercontent.com/FRRe-DS/2024-06-TPI/main/client/src/public/bienal_logo.png"
              alt="logo"
            />
            <h2>Iniciar Sesión</h2>
          </div>
          <form on:submit|preventDefault={iniciarSesion}>
            <div class="input-wrapper">
              <input
                type="text"
                placeholder="Correo"
                bind:value={correo}
                class="input"
              />
            </div>
            <div class="input-wrapper">
              <input
                type="password"
                placeholder="Contraseña"
                bind:value={contraseña}
                class="input"
              />
            </div>
            <button type="submit" class="button">Iniciar sesión</button>
          </form>
        </div>
        <!-- Columna derecha -->
        <div class="info-panel">
          <h4>¡Bienvenido a la Bienal!</h4>
          <p>
            Si quiere votar a las esculturas y no tiene cuenta, 
            <a href="/registro">regístrese aquí</a>. <br />
            Si es un escultor y no tiene perfil, comuníquese con administración.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  :root {
    --bg-color: #f4f4f4;
    --text-color: #333;
    --form-bg: white;
    --input-border: #ccc;
    --gradient-start: #50c9c3;
    --gradient-end: #3f8d87;
    --button-hover-start: #3f8d87;
    --button-hover-end: #50c9c3;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-color: #444; /* Fondo general en modo oscuro */
      --text-color: #f4f4f4; /* Texto claro */
      --form-bg: #1e1e1e; /* Fondo del formulario */
      --input-border: #444; /* Bordes de los inputs */
      --gradient-start: #0066cc;
      --gradient-end: #00bcd4;
      --button-hover-start: #0066cc;
      --button-hover-end: #00bcd4;
    }
  }

  /* Contenedor principal */
  .gradient-form {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: var(--bg-color);
    color: var(--text-color);
  }

  .container {
    width: 90%;
    max-width: 1200px;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background: var(--form-bg);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .form-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .form-content {
    padding: 2rem;
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .logo img {
    width: 120px;
    margin-bottom: 1rem;
  }

  .logo h2 {
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: var(--text-color);
  }

  .input-wrapper {
    margin-bottom: 1.5rem;
  }

  .input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--input-border);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--form-bg);
    color: var(--text-color);
  }

  .button {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .button:hover {
    background: linear-gradient(to right, var(--button-hover-start), var(--button-hover-end));
  }

  .info-panel {
    flex: 1 1 50%;
    background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
    padding: 2rem;
    color: white;
    text-align: center;

    /* Flexbox para centrar contenido */
    display: flex;
    flex-direction: column; /* Alinear elementos verticalmente */
    justify-content: center; /* Centrado vertical */
    align-items: center; /* Centrado horizontal */
  }

  .info-panel a {
    color: #fff;
    font-weight: bold;
    text-decoration: underline;
  }

  /* Responsivo para móviles */
  @media (max-width: 768px) {
    .form-wrapper {
      flex-direction: column;
    }

    .form-content,
    .info-panel {
      flex: 1 1 100%;
    }
  }
</style>

