<script>
  import { onMount } from 'svelte';

  let userRole;
  let accesoPermitido = false; // Variable para controlar el acceso

  onMount(() => {
    userRole = localStorage.getItem('role');

    // Verifica si el usuario tiene el rol adecuado
    if (userRole === 'admin') {
      accesoPermitido = true; // Permite el acceso si es administrador
    } else {
      alert('Acceso denegado. Redirigiendo a la página principal.');
      window.location.href = '/inicio';
    }
  });

   function redirigir(ruta) {
    window.location.href = ruta; // Redirige a la ruta especificada
   }
</script>

{#if accesoPermitido}
<section>
  <h1>Bienvenido, Administrador</h1>
  <p>Selecciona una opción para gestionar:</p>
  <div class="panel-opciones">
    <button class="opcion" on:click={() => redirigir('/admin/esculturas')}>
      <img src="/escultura_opc.png" alt="Esculturas" />
      <span>Gestionar Esculturas</span>
    </button>
    <button class="opcion" on:click={() => redirigir('/admin/artistas')}>
      <img src="/escultor_opc.png" alt="Artistas" />
      <span>Gestionar Artistas</span>
    </button>
    <button class="opcion" on:click={() => redirigir('/admin/eventos')}>
      <img src="/evento_opc.png" alt="Eventos" />
      <span>Gestionar Eventos</span>
    </button>
  </div>
</section>
{/if}

<style>
  section {
    text-align: center;
    margin-top: 50px;
  }

  .panel-opciones {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }

  .opcion {
    width: 120px;
    height: 120px;
    background-color: #007BFF;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.3s;
  }

  .opcion:hover {
    transform: scale(1.1);
    background-color: #0056b3;
  }

  .opcion img {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }

  .opcion span {
    font-size: 14px;
    font-weight: bold;
  }
</style>
