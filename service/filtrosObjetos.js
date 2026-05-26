export function ordenarEsculturas(listaEsculturas, criterio, orden) {
    return listaEsculturas.sort((a, b) => {
        let comparison = 0;

        // Comparación según el criterio seleccionado
        switch (criterio) {
            case 'nombre':
                comparison = a.getNombre().localeCompare(b.getNombre());
                break;

            case 'f_creacion':
                comparison = new Date(a.getFechaCreacion()) - new Date(b.getFechaCreacion());
                break;

            case 'promedio':
                comparison = parseFloat(a.getPromedio()) - parseFloat(b.getPromedio());
                break;

            default:
                console.error('Criterio no reconocido: ' + criterio);
                return 0;
        }

        // Ajuste según el orden (ascendente o descendente)
        if (orden === 'DESC') {
            comparison = comparison * -1; // Invierte el orden para descendente
        }

        return comparison;
    });
}

export function ordenarEventos(listaEventos, criterio, orden) {
    return listaEventos.sort((a, b) => {
        let comparison = 0;

        // Comparación según el criterio seleccionado
        switch (criterio) {
            case 'nombre':
                comparison = a.getNombre().localeCompare(b.getNombre());
                break;

            case 'fecha_inicio':
                // Primero comparamos por la fecha de inicio
                const fechaInicioComparacion = new Date(a.getFechaInicio()) - new Date(b.getFechaInicio());

                if (fechaInicioComparacion !== 0) {
                    comparison = fechaInicioComparacion; // Si las fechas son diferentes, usamos esta comparación
                } else {
                    // Si las fechas son iguales, comparamos por hora de inicio
                    const [horaA, minutoA] = a.getHoraInicio().split(':').map(Number);
                    const [horaB, minutoB] = b.getHoraInicio().split(':').map(Number);

                    const totalMinutosA = horaA * 60 + minutoA;
                    const totalMinutosB = horaB * 60 + minutoB;

                    const horaComparacion = totalMinutosA - totalMinutosB;
                    if (horaComparacion !== 0) {
                        comparison = horaComparacion; // Si las horas son diferentes, usamos esta comparación
                    } else {
                        // Si las horas de inicio son iguales, comparamos por hora de fin
                        const [horaA, minutoA] = a.getHoraFin().split(':').map(Number);
                        const [horaB, minutoB] = b.getHoraFin().split(':').map(Number);

                        const totalMinutosA = horaA * 60 + minutoA;
                        const totalMinutosB = horaB * 60 + minutoB;

                        const horaComparacion = totalMinutosA - totalMinutosB;
                        comparison = horaComparacion; // Ajustamos la comparación por hora
                    }
                }
                break;

            
            case 'promedio':
                comparison = parseFloat(a.getPromedio()) - parseFloat(b.getPromedio());
                break;

            default:
                console.error('Criterio no reconocido: ' + criterio);
                return 0;
        }

        // Ajuste según el orden (ascendente o descendente)
        if (orden === 'DESC') {
            comparison = comparison * -1; // Invierte el orden para descendente
        }

        return comparison;
    });
}

export function ordenarArtistas(listaArtistas, criterio, orden) {
    return listaArtistas.sort((a, b) => {
        let comparison = 0;

        // Comparación según el criterio seleccionado
        switch (criterio) {
            case 'nombre':
                comparison = a.getNyA().localeCompare(b.getNyA());
                break;
            
            case 'promedio':
                comparison = parseFloat(a.getPromedio()) - parseFloat(b.getPromedio());
                break;

            default:
                console.error('Criterio no reconocido: ' + criterio);
                return 0;
        }

        // Ajuste según el orden (ascendente o descendente)
        if (orden === 'DESC') {
            comparison = comparison * -1; // Invierte el orden para descendente
        }

        return comparison;
    });
}

export function buscarEsculturas(listaEsculturas, busqueda) {
    busqueda = busqueda.toLowerCase(); // Convertir la búsqueda a minúsculas
    const resultados = [];

    listaEsculturas.forEach(escultura => {
        // Validar que la escultura no sea undefined y que tenga los métodos necesarios
        if (escultura && typeof escultura.getNombre === 'function' && typeof escultura.getTecnica === 'function') {
            // Verificar coincidencias en el nombre y técnica
            const nombreEscultura = escultura.getNombre() || ""; // Default a vacío si no está definido
            const tecnicaEscultura = escultura.getTecnica() || ""; // Default a vacío si no está definido

            if (nombreEscultura.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, '')) ||
                tecnicaEscultura.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, ''))) {
                resultados.push(escultura);
                return;
            }


            // Verificar coincidencias en la lista de artistas
            const artistas = escultura.getArtistas(); // Obtener la lista de artistas
            if (Array.isArray(artistas)) {
                for (const artista of artistas) {
                    // Validar que el artista tenga nombre y apellido
                    if (artista && artista.NyA) {
                        if (artista.NyA.toLowerCase().replace(/\s+/g, '').includes(busqueda.toLowerCase().replace(/\s+/g, ''))) {
                            resultados.push(escultura);
                            break; // No es necesario seguir buscando más artistas
                        }
                    }
                }
            }
        }
    });

    return resultados;
}

export function buscarEventos(listaEventos, busqueda) {
    busqueda = busqueda.toLowerCase(); // Convertir la búsqueda a minúsculas
    const resultados = [];

    listaEventos.forEach(evento => {
        // Validar que la escultura no sea undefined y que tenga los métodos necesarios
        if (evento && typeof evento.getNombre === 'function' && typeof evento.getLugar === 'function' 
            && typeof evento.getTematica === 'function') {
            // Verificar coincidencias en el nombre y técnica
            const nombreEvento = evento.getNombre() || ""; // Default a vacío si no está definido
            const lugarEvento = evento.getLugar() || ""; // Default a vacío si no está definido
            const tematicaEvento = evento.getTematica() || ""; // Default a vacío si no está definido

            if (nombreEvento.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, '')) ||
                lugarEvento.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, '')) ||
                tematicaEvento.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, ''))) {
                resultados.push(evento);
                return;
            }
        }
    });

    return resultados;
}

export function buscarArtistas(listaArtistas, busqueda) {
    busqueda = busqueda.toLowerCase(); // Convertir la búsqueda a minúsculas
    const resultados = [];

    listaArtistas.forEach(artista => {
        // Validar que la escultura no sea undefined y que tenga los métodos necesarios
        if (artista && typeof artista.getNyA === 'function' && typeof artista.getRes_biografia === 'function'
            && typeof artista.getContacto === 'function') {
            // Verificar coincidencias en el nombre y técnica
            const nombreArtista = artista.getNyA() || ""; // Default a vacío si no está definido
            const biografiaArtista = artista.getRes_biografia() || ""; // Default a vacío si no está definido
            const contactoArtista = artista.getContacto() || ""; // Default a vacío si no está definido

            if (nombreArtista.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, '')) ||
                biografiaArtista.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, '')) ||
                contactoArtista.toLowerCase().replace(/\s+/g, '').includes(busqueda.replace(/\s+/g, ''))) {
                resultados.push(artista);
                return;
            }
        }
    });

    return resultados;
}

export function eventoProximo(listaEventos) {
    const ahora = new Date();
    return listaEventos
        .filter(evento => {
            // Crear el objeto Date desde fecha_inicio
            const fechaHoraEvento = new Date(evento.fecha_inicio);
            // Extraer hora, minutos y segundos de hora_inicio
            const [hora, minutos, segundos] = evento.hora_inicio.split(":").map(Number);
            // Ajustar la hora, minutos y segundos en el objeto Date
            fechaHoraEvento.setUTCHours(hora, minutos, segundos || 0);
            // Devolver solo los eventos futuros
            return fechaHoraEvento > ahora;
        })
        .sort((a, b) => {
            // Crear el objeto Date desde fecha_inicio
            const fechaHoraEventoA = new Date(a.fecha_inicio);
            // Extraer hora, minutos y segundos de hora_inicio
            const [horaA, minutosA, segundosA] = a.hora_inicio.split(":").map(Number);
            // Ajustar la hora, minutos y segundos en el objeto Date
            fechaHoraEventoA.setUTCHours(horaA, minutosA, segundosA || 0);

            // Crear el objeto Date desde fecha_inicio
            const fechaHoraEventoB = new Date(b.fecha_inicio);
            // Extraer hora, minutos y segundos de hora_inicio
            const [horaB, minutosB, segundosB] = b.hora_inicio.split(":").map(Number);
            // Ajustar la hora, minutos y segundos en el objeto Date
            fechaHoraEventoA.setUTCHours(horaB, minutosB, segundosB || 0);
            // Ordenar los eventos futuros por fecha y hora
            const fechaHoraA = new Date(fechaHoraEventoA);
            const fechaHoraB = new Date(fechaHoraEventoB);
            return fechaHoraA - fechaHoraB;
        })[0]; // Devolver el primer evento (el más cercano)
}