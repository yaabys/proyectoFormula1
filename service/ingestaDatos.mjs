import z from "zebras"
import { conn } from "./sql/conexionSQL.mjs" 

//borrado primero de todas tablas
const deletePilotos = "DELETE FROM pilotos"
await conn.execute(deletePilotos)

const deleteCarreras = "DELETE FROM carreras"
await conn.execute(deleteCarreras)

const deleteEquipos = "DELETE FROM equipos"
await conn.execute(deleteEquipos)

const deleteCampeonatoPilotos = "DELETE FROM CampeonatoPilotos"
await conn.execute(deleteCampeonatoPilotos)

const deleteCampeonatoConstructores = "DELETE FROM CampeonatoConstructores"
await conn.execute(deleteCampeonatoConstructores)

//insercion de todas las tablas
const DF_PILOTOS = z.readCSV("./csv/pilotos_up02-02-2025.csv")
const DF_EDAD = z.parseNums(["edad"],DF_PILOTOS)
const DF_FINALPILOTOS = z.parseNums(["victorias"],DF_EDAD)

const insertPilotos = `INSERT INTO pilotos (nombreCompleto,edad,nacionalidad,victorias,equipo,apodoAcronimo,rutaFoto)
VALUES (?,?,?,?,?,?,?)`
for (const filaPilotos of DF_FINALPILOTOS) {
    const {nombreCompleto,edad,nacionalidad,victorias,equipo,apodoAcronimo,rutaFoto} = filaPilotos
    await conn.execute(insertPilotos,[nombreCompleto,edad,nacionalidad,victorias,equipo,apodoAcronimo,rutaFoto])
}
// ------------------------------------------------------------------------------------------------------------------------------ //
const DF_CARRERAS = z.readCSV("./csv/carreras_up02-02-2025.csv")
const DF_FINALCARRERA = z.parseNums(["anioCarrera"],DF_CARRERAS)

const insertCarreras = `INSERT INTO carreras (nombreCircuito,pais,vueltaRapida,anioCarrera,ganadorCarrera,ganadorEquipo)
VALUES (?,?,?,?,?,?)`
for (const filaCarreras of DF_FINALCARRERA) {
    const {nombreCircuito,pais,vueltaRapida,anioCarrera,ganadorCarrera,ganadorEquipo} = filaCarreras
    await conn.execute(insertCarreras,[nombreCircuito,pais,vueltaRapida,anioCarrera,ganadorCarrera,ganadorEquipo])
}
// ------------------------------------------------------------------------------------------------------------------------------ //
const DF_CAMPPILOTOS = z.readCSV("./csv/campPilotos_up02-02-2025.csv")
const DF_ANIO = z.parseNums(["anioTemporada"],DF_CAMPPILOTOS)
const DF_POSICION = z.parseNums(["anioTemporada"],DF_ANIO)
const DF_FINALCAMPPIL = z.parseNums(["puntos"],DF_POSICION)

const insertCampeonatoPilotos = `INSERT INTO campeonatopilotos (anioTemporada,nombrePiloto,posicion,puntos,coche)
VALUES (?,?,?,?,?)`
for (const filaCampPil of DF_FINALCAMPPIL) {
    const {anioTemporada,nombrePiloto,posicion,puntos,coche} = filaCampPil
    await conn.execute(insertCampeonatoPilotos,[anioTemporada,nombrePiloto,posicion,puntos,coche])
}
// ------------------------------------------------------------------------------------------------------------------------------ //
const DF_CAMPCONSTRUCTORES = z.readCSV("./csv/campConst_up02-02-2025.csv")
const DF_ANIOTEMP = z.parseNums(["anioTemporada"],DF_CAMPCONSTRUCTORES)
const DF_POS = z.parseNums(["posicion"],DF_ANIOTEMP)
const DF_FINALCONST = z.parseNums(["puntos"],DF_POS)

const insertCampeonatoConstructores = `INSERT INTO CampeonatoConstructores (anioTemporada,equipo,posicion,puntos,pilotos)
VALUES (?,?,?,?,?)`
for (const filaCampCons of DF_FINALCONST) {
    const {anioTemporada,equipo,posicion,puntos,pilotos} = filaCampCons
    await conn.execute(insertCampeonatoConstructores,[anioTemporada,equipo,posicion,puntos,pilotos])
}
// ------------------------------------------------------------------------------------------------------------------------------ //
const DF_EQUIPOS = z.readCSV("./csv/equipos_up02-02-2025.csv")
const DF_FINALEQUIPOS = z.parseNums(["anioFundacion"],DF_EQUIPOS)

const insertEquipos = `INSERT INTO equipos (nombre,nacionalidad,base,anioFundacion,fundador,rutaFoto)
VALUES (?,?,?,?,?,?)`
for (const filaEquipos of DF_FINALEQUIPOS) {
    const {nombre,nacionalidad,base,anioFundacion,fundador,rutaFoto} = filaEquipos
    await conn.execute(insertEquipos,[nombre,nacionalidad,base,anioFundacion,fundador,rutaFoto])
}
console.log("Carga de datos realizada")