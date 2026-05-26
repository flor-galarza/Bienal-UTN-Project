export class Esculturas {
    nombre;
    f_creacion;
    antecedente;
    tecnica;
    listaImagenes;
    listaArtistas;
    promedio;

    constructor(nombre, f_creacion, antecedente, tecnica, promedio) {
        this.nombre = nombre;
        this.f_creacion = f_creacion;
        this.antecedente = antecedente;
        this.tecnica = tecnica;
        this.listaArtistas = [];
        this.listaImagenes = [];
        this.promedio = promedio;
    
    }
    getNombre() { return this.nombre; }
    getFechaCreacion() { return this.f_creacion; }
    getAntecedente() { return this.antecedente; }
    getTecnica() { return this.tecnica; }
    getArtistas() { return this.listaArtistas; }
    getImagenes() { return this.listaImagenes; }
    addArtista(artista) { this.listaArtistas.push(artista); }
    addImagen(imagen) { this.listaImagenes.push(imagen); }
    getPromedio() { return this.promedio; }
    setPromedio(prom){this.promedio=prom }
}


export class Visitantes {
    email;
    contrasena;
    NyA;
    constructor(email, contrasena, NyA) {
        this.email = email;
        this.contrasena = contrasena;
        this.NyA = NyA;
    }
    getEmail() { return this.email; }
    getContrasena() { return this.contrasena; }
    getNyA() { return this.NyA; }
}

export class Eventos {
    nombre;
    lugar;
    fecha_inicio;
    fecha_fin;
    tematica;
    hora_inicio;
    hora_fin;
    promedio;

    constructor(nombre, lugar, fecha_inicio, fecha_fin, tematica, hora_inicio, hora_fin, promedio) {
        this.nombre = nombre;
        this.lugar = lugar;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.tematica = tematica;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
        this.promedio = promedio;
    }
    getNombre() { return this.nombre; }
    getLugar() { return this.lugar; }
    getFechaInicio() { return this.fecha_inicio; }
    getFechaFin() { return this.fecha_fin; }
    getTematica() { return this.tematica; }
    getHoraInicio() { return this.hora_inicio; }
    getHoraFin() { return this.hora_fin; }
    getPromedio() { return this.promedio; }
}

export class Artistas {
    DNI;
    NyA;
    res_biografia;
    contacto;
    URL_foto;
    promedio;
    nacionalidad;
    constructor(DNI, NyA, res_biografia, contacto, URL_foto, promedio,nacionalidad) {
        this.DNI = DNI;
        this.NyA = NyA;
        this.res_biografia = res_biografia;
        this.contacto = contacto;
        this.URL_foto = URL_foto;
        this.promedio = promedio;
        this.nacionalidad=nacionalidad;
    }
    getDNI() { return this.DNI; }
    getNyA() { return this.NyA; }
    getRes_biografia() { return this.res_biografia; }
    getContacto() { return this.contacto; }
    getURL_foto() { return this.URL_foto; }
    getPromedio() { return this.promedio; }
    getNacionalidad() { return this.nacionalidad; }


}

export class Imagenes {
    url;
    etapa;
    constructor(url, etapa) {
        this.url = url;
        this.etapa = etapa;
    }
    getURL() { return this.url; }
    getEtapa() { return this.etapa; }
}