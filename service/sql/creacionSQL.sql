CREATE TABLE IF NOT EXISTS Equipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    nacionalidad TEXT NOT NULL,
    base TEXT NOT NULL,
    anioFundacion INTEGER NOT NULL,
    fundador TEXT,
    rutaFoto TEXT
);

CREATE TABLE IF NOT EXISTS Pilotos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCompleto TEXT NOT NULL,
    edad INTEGER NOT NULL,
    nacionalidad TEXT NOT NULL,
    victorias INTEGER DEFAULT 0,
    equipo TEXT,
    apodoAcronimo TEXT,
    rutaFoto TEXT
);

CREATE TABLE IF NOT EXISTS Carreras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCircuito TEXT NOT NULL,
    pais TEXT NOT NULL,
    vueltaRapida TEXT,
    anioCarrera INTEGER NOT NULL,
    ganadorCarrera TEXT,
    ganadorEquipo TEXT,
);

CREATE TABLE IF NOT EXISTS CampeonatoPilotos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anioTemporada INTEGER NOT NULL,
    nombrePiloto TEXT,
    posicion INTEGER NOT NULL,
    puntos INTEGER NOT NULL,
    coche TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS CampeonatoConstructores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anioTemporada INTEGER NOT NULL,
    equipo TEXT,
    posicion INTEGER NOT NULL,
    puntos INTEGER NOT NULL,
    pilotos TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCompleto TEXT NOT NULL,
    userName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordUsuario TEXT NOT NULL,
    rutaFoto TEXT NOT NULL
);