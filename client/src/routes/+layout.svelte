<!-- src/routes/+layout.svelte -->
<script>
  // @ts-nocheck
  let logo = "https://raw.githubusercontent.com/FRRe-DS/2024-06-TPI/main/client/src/public/bienal_logo_corto.png";
  let anio = 2024;
  import Navbar from '../components/layout/Navbar.svelte';
  import Footer from '../components/layout/Footer.svelte';
</script>

<svelte:head>
  <title>Bienal {anio}</title>
  <link rel="icon" type="image/x-icon" href={logo} style="max-height: 16px; max-width: 16px" class="bg-" />
</svelte:head>

<main>
  <!-- Navbar fijo en la parte superior -->
  <Navbar />

  <!-- Contenido de la página -->
  <div class="content">
    <slot></slot> <!-- Aquí se insertará el contenido de las páginas hijas -->
  </div>

  <!-- Footer siempre al final del contenido -->
  <Footer />

</main>

<style>
  /* Agrega estilos generales aquí */
  
  @tailwind base;
  @tailwind components;
  @tailwind utilities;


:global(body) {
  font-family: 'Roboto', sans-serif;
}

/* Contenedor principal con Flexbox */
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* El contenedor ocupará al menos toda la altura de la pantalla */
  }

  /* Contenedor para el contenido que se expandirá según el tamaño del contenido */
  .content {
    flex-grow: 1; /* Hace que el contenido ocupe todo el espacio disponible */
  }
</style>
