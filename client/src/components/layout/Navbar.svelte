<script>
  // @ts-nocheck
  import { goto } from '$app/navigation';
  import logo from '$lib/../public/bienal_logo.png';
  import { onMount } from "svelte"; // Asumí que necesitas importar el logo
  let isNavOpen = false;
  let isDropdownOpen = false;
  let isEscultor = false;
  let isAdmin = false;

  /**
   * @param {string} token
   */
  function decodificarToken(token) {
    try {
      const payload = token.split('.')[1]; // Extraemos el payload del JWT (parte del medio)
      const decoded = atob(payload); // Decodificamos la base64
      return JSON.parse(decoded); // Convertimos el JSON
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  /**
   * @param {string} token
   */
  function verificarPermisos(token) {
    const decoded = decodificarToken(token);
    if (decoded && decoded.permisos) {
      const permisos = decoded.permisos;
      console.log(permisos)
      if (permisos === 'escultor') {
        isEscultor = true; // Establecemos 'isEscultor' si el permiso es "escultor"
      } else {
        isEscultor = false; // Restablecemos 'isEscultor' si el permiso no es "escultor"
      }
      if (permisos === 'admin') {
        isAdmin = true; // Establecemos 'isAdmin' si el permiso es "admin"
      } else {
        isAdmin = false; // Restablecemos 'isAdmin' si el permiso no es "admin"
      }
    } else {
      console.error('El token no contiene permisos válidos');
    }
  }

function irAPerfil() {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token (asegurándote de tener una función de decodificación como decodificarToken)
      const decoded = decodificarToken(token);
      const nombre = decoded.nombre.replace(/ /g, ''); // Eliminar los espacios del nombre
      // Redirigir al perfil del escultor
      window.location.href = `/escultores/${nombre}`;
    } else {
      console.error('Token no encontrado en localStorage');
    }
  }

  function toggleDropdown() {
    const token = localStorage.getItem('token');
    if (token) {
      isDropdownOpen = !isDropdownOpen;
      verificarPermisos(token); // Verificamos la autenticación cada vez que se abre el dropdown
    } else {
      goto('/login'); // Redirige si no hay token
    }
  }

  function cerrarSesion() {
    isDropdownOpen= false
    localStorage.removeItem('token'); // Elimina el token de autenticación
    goto('/login');  // Redirige a la página de inicio de sesión
  }
  function clickAfuera(event) { if (!event.target.closest("#botonperfil")) { isDropdownOpen = false; } }
  
  onMount(() => { document.addEventListener("click", clickAfuera); return () => document.removeEventListener("click", clickAfuera); });
  
  
  function IrCambioContrasena() {
    window.location.href = `/cambiarContrasena`;
  }

  function IrAdmin() {
    window.location.href = `/admin`;
  }
  
</script>

<!-- Main navigation container -->
<nav 
  class="flex-no-wrap relative flex w-full items-center justify-between py-1 shadow-dark-mild lg:flex-wrap lg:justify-start lg:py-2 shadow-lg" 
  style="background: linear-gradient(to top, rgba(0, 0, 0), rgba(0, 0, 0, 0.9));">
  <div class="flex w-full flex-wrap items-center justify-between px-3">

    <!-- Hamburger button for mobile view -->
    <button
      class="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
      type="button"
      on:click={() => isNavOpen = !isNavOpen}
      aria-controls="navbarSupportedContent1"
      aria-expanded={isNavOpen}
      aria-label="Toggle navigation"
    >
      <!-- Hamburger icon -->
      <span class="[&>svg]:w-7 [&>svg]:stroke-black/50 dark:[&>svg]:stroke-neutral-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <!-- Collapsible navigation container -->
    <div
      class={`!visible ${isNavOpen ? 'flex' : 'hidden'} flex-grow basis-[100%] items-center lg:!flex lg:basis-auto`}
      id="navbarSupportedContent1"
    >
      <!-- Logo -->
      <a class="mb-4 me-5 ms-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0" href="https://github.com/FRRe-DS/2024-06-TPI">
        <img
          class="me-2"
          src={logo}
          style="max-height: 35px"
          alt="logo bienal"
          loading="lazy" />
      </a>
      <!-- Left navigation links -->
      <ul class="list-style-none flex flex-row justify-center flex-grow ps-0">
        <li class="mb-4 lg:mb-0 lg:pe-14"> <!-- Ajusta aquí el espacio -->
          <a class="block transition duration-200 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg px-3 py-2 text-black/60 hover:text-black/80 focus:text-black/80 dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80" href="/inicio">Inicio</a>
        </li>
        <li class="mb-4 lg:mb-0 lg:pe-14"> <!-- Ajusta aquí el espacio -->
          <a class="block transition duration-200 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg px-3 py-2 text-black/60 hover:text-black/80 focus:text-black/80 dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80" href="/eventos">Eventos</a>
        </li>
        <li class="mb-4 lg:mb-0 lg:pe-14"> <!-- Ajusta aquí el espacio -->
          <a class="block transition duration-200 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg px-3 py-2 text-black/60 hover:text-black/80 focus:text-black/80 dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80" href="/escultores">Escultores</a>
        </li>
        <li class="mb-4 lg:mb-0 lg:pe-14"> <!-- Ajusta aquí el espacio -->
          <a class="block transition duration-200 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg px-3 py-2 text-black/60 hover:text-black/80 focus:text-black/80 dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80" href="/obras">Obras</a>
        </li>
      </ul>
    </div>

    
      <!-- Icono de perfil -->
      <div class="relative flex items-center space-x-4" id="botonperfil">
        <button on:click={toggleDropdown} class="text-neutral-600 dark:text-white hover:text-pink-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
        </button>
      
      <!-- Menú desplegable para cerrar sesión -->
      {#if isDropdownOpen}
      <div class="absolute right-0 top-full w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-10">
        <!-- Botón QR, solo visible si isEscultor es true -->
        {#if isEscultor}
          <button on:click={irAPerfil} class="block px-4 py-2 text-sm text-neutral-600 dark:text-white hover:bg-pink-500 hover:text-white cursor-pointer">
          Ir al perfil
        </button>
        {/if}
        {#if !isAdmin}
          <button on:click={IrCambioContrasena} class="block px-4 py-2 text-sm text-neutral-600 dark:text-white hover:bg-pink-500 hover:text-white cursor-pointer">
          Cambiar contraseña
        </button>
        {/if}
        {#if isAdmin}
          <button on:click={IrAdmin} class="block px-4 py-2 text-sm text-neutral-600 dark:text-white hover:bg-pink-500 hover:text-white cursor-pointer">
          Administración
        </button>
        {/if}
        <!-- Botón para cerrar sesión -->
        <button on:click={cerrarSesion} class="block px-4 py-2 text-sm text-neutral-600 dark:text-white hover:bg-pink-500 hover:text-white cursor-pointer">
          Cerrar sesión
        </button>
      </div>
      {/if}
    
  </div>
</nav>
