<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import "flag-icons/css/flag-icons.min.css";
  
    /**
     * @type {any[]}
     */
    let cards = []; // Resultado de las esculturas
  
    // Función para realizar la búsqueda
    async function fetchEscultores() {
      try {
        const res = await axios.get(`http://localhost:3001/api/escultores`, {
          params: {
            search: "",
            sortBy: "promedio",
            order: "DESC"
          }
        });
        cards = res.data.slice(0, 10);
      } catch (error) {
        console.log(error);
      }
    }
  
    onMount(() => {
      fetchEscultores();
    });
  </script>
  
  <style>
    .contenedor {
        display: grid;
        grid-template-columns: repeat(5, 1fr); /* 5 tarjetas por fila en pantallas grandes */
        gap: 30px;
        justify-content: center;
        padding: 16px;
    }
  
    .tarjeta {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  
    .tarjeta:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  
    .imagen {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
  
    .contenido {
        padding: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
  
    .nombre {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 8px;
    }
  
    .correo {
        font-size: 0.9rem;
        color: #666;
    }
  
    /* Media Queries */
    @media (max-width: 1024px) {
        .contenedor {
            grid-template-columns: repeat(3, 1fr); /* 3 tarjetas por fila */
            gap: 20px;
        }
  
        .tarjeta .imagen {
            height: 180px;
        }
    }
  
    @media (max-width: 768px) {
        .contenedor {
            grid-template-columns: repeat(2, 1fr); /* 2 tarjetas por fila */
            gap: 15px;
        }
  
        .tarjeta {
            width: 100%;
        }
  
        .tarjeta .imagen {
            height: 160px;
        }
    }
  
    @media (max-width: 480px) {
        .contenedor {
            grid-template-columns: 1fr; /* Una tarjeta por fila */
            gap: 10px;
        }
  
        .tarjeta {
            width: 100%; /* Ocupa todo el ancho del contenedor */
        }
  
        .tarjeta .imagen {
            height: 150px;
        }
    }
  </style>
  
  <div class="contenedor">
    {#each cards as tarjeta}
      <a href="/escultores/{tarjeta.escultorPantalla}">
        <div class="tarjeta">
          <img src={tarjeta.escultorFoto} alt="Foto de {tarjeta.escultorName}" class="imagen" />
          <div class="contenido">
            <div class="nombre">{tarjeta.escultorName}</div>
            <div class="correo">{tarjeta.contactoEmail}</div>
          </div>
        </div>
      </a>
    {/each}
  </div>
  