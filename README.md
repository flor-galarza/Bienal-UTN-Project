# Plataforma Web: Bienal de Esculturas del Chaco

Este proyecto es una plataforma web integral desarrollada para la **Bienal de Esculturas del Chaco**, que permite gestionar eventos, artistas, obras y votaciones en tiempo real. 

**¡El proyecto está en vivo! Puedes visitarlo aquí:**
- **Frontend (Aplicación Web):** [https://bienal-utn-project.vercel.app/](https://bienal-utn-project.vercel.app/)
- **Backend (API):** [https://bienal-utn-project.onrender.com](https://bienal-utn-project.onrender.com)

---

## 💻 Habilidades y Tecnologías Implementadas

El desarrollo de este sistema me permitió aplicar y consolidar una arquitectura completa (Full Stack), abarcando desde el diseño de la base de datos hasta el despliegue en la nube.

### Frontend
- **Svelte & SvelteKit:** Framework principal para la construcción de una interfaz rápida, reactiva y optimizada (SSR/SSG).
- **Vite:** Empaquetador extremadamente rápido para un entorno de desarrollo ágil.
- **TailwindCSS:** Para un diseño moderno, responsive y mobile-first.
- **Integración de APIs:** Consumo de endpoints RESTful usando `axios`.

### Backend
- **Node.js & Express:** Creación de una API RESTful robusta y escalable.
- **JWT (JSON Web Tokens):** Implementación de un sistema de autenticación seguro basado en roles (Administrador, Escultor, Visitante).
- **Bcrypt:** Hasheo y salting de contraseñas para máxima seguridad de los datos de los usuarios.
- **Multer & Sharp:** Gestión, procesamiento y optimización de imágenes (conversión a WebP) antes de subirlas.
- **Node-Cache:** Implementación de caché en memoria para reducir llamadas a la base de datos y mejorar la latencia.

### Base de Datos & Despliegue
- **MySQL (Aiven Cloud):** Modelado relacional, creación de *Stored Procedures* avanzados y optimización de *Collations* para búsquedas complejas.
- **Vercel:** Despliegue continuo del Frontend con soporte nativo para SvelteKit.
- **Render:** Alojamiento en la nube del servidor de Node.js.

---

## 🔑 Cuentas de Prueba

Para probar todas las funcionalidades del sistema según el tipo de rol, puedes utilizar los siguientes usuarios (o registrar uno nuevo tú mismo en la plataforma):

1. **🧑‍💻 Administrador** (Acceso a ABM de eventos, obras y usuarios)
   - **Email:** `taylorswift@gmail.com`
   - **Contraseña:** `thetorturedpoetsdepartment`

2. **🧑‍🎨 Escultor** (Acceso a perfil de artista y gestión de sus obras)
   - **Email:** `escultor@bienal.com`
   - **Contraseña:** `123456`
   *(Nota para el desarrollador: Recuerda registrar este usuario en producción)*

3. **🙋 Visitante** (Acceso para votar y ver la galería)
   - **Email:** `visitante@bienal.com`
   - **Contraseña:** `123456`
   *(Nota para el desarrollador: Recuerda registrar este usuario en producción)*

---

## 🛠️ Ejecución en Entorno Local

Si deseas correr el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/flor-galarza/Bienal-UTN-Project.git
cd Bienal-UTN-Project
```

### 2. Levantar el Backend (API)
```bash
cd service
npm install
node backend.js
```

### 3. Levantar el Frontend
Abre otra terminal en la raíz del proyecto:
```bash
cd client
npm install
npm run dev
```

---
*Desarrollado como Proyecto Integrador para la cátedra Diseño de Sistemas (UTN) - Grupo 6 (2024)*
