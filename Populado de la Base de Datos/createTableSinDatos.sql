-- Tabla Esculturas
CREATE TABLE Esculturas(
	nombre varchar(100) PRIMARY key,
	f_creacion date,
	antecedentes boolean default false, 
	tecnica varchar(100)
);
-- Tabla Eventos
CREATE TABLE Eventos(
	nombre varchar(200),
	lugar varchar(100),
	fecha_inicio date,
    fecha_fin date,
	tematica varchar(100),
	hora_inicio time,
    hora_fin time,
    PRIMARY KEY (nombre, lugar)
);

-- Tabla Artistas
CREATE TABLE Artistas(
	DNI int PRIMARY key,
	NyA varchar(100),
	res_biografia TEXT,
	contacto varchar(100)
    URL_foto varchar(100) NOT NULL
);

-- Tabla Imagenes
CREATE TABLE Imagenes(
	URL varchar(100) PRIMARY key,
	etapa varchar(100),
	nombre_escultura varchar(100) NOT NULL,
	FOREIGN Key (nombre_escultura) References Esculturas(nombre)
);


-- Tabla Visitantes
CREATE TABLE Visitantes (
    email VARCHAR(100) PRIMARY KEY,
    NyA VARCHAR(100),
    contrasena VARCHAR(100)
);

-- Tabla Votan
CREATE TABLE Votan(
    email VARCHAR(100),
    nombre_escultura VARCHAR(100),
    cant_estrellas INT,
    PRIMARY KEY (email, nombre_escultura),
    FOREIGN KEY (email) REFERENCES Visitantes(email),
    FOREIGN KEY (nombre_escultura) REFERENCES Esculturas(nombre),
    CHECK (cant_estrellas BETWEEN 1 AND 5)
);

-- Tabla Hechas_Por
CREATE TABLE Hechas_por (
    DNI INT,
    nombre_escultura VARCHAR(100),
    PRIMARY KEY (DNI, nombre_escultura),
    FOREIGN KEY (DNI) REFERENCES Artistas(DNI),
    FOREIGN KEY (nombre_escultura) REFERENCES Esculturas(nombre)
);

-- Tabla Compiten
CREATE TABLE Compiten (
    nombre_evento VARCHAR(100),
    nombre_escultura VARCHAR(100),
    PRIMARY KEY (nombre_evento, nombre_escultura),
    FOREIGN KEY (nombre_evento) REFERENCES Eventos(nombre),
    FOREIGN KEY (nombre_escultura) REFERENCES Esculturas(nombre)
);