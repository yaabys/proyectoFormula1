import express from "express"
import { conn } from "../../service/sql/conexionSQL.mjs"

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.put("/insertarPiloto", async (req, res) => {
    const { nombreCompleto, edad, nacionalidad, victorias, equipo, apodoAcronimo} = req.body

    const rutaFoto = ""

    try {
        await conn.execute(
            "INSERT INTO Pilotos (nombreCompleto, edad, nacionalidad, victorias, equipo, apodoAcronimo,rutaFoto) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nombreCompleto, edad, nacionalidad, victorias, equipo, apodoAcronimo,rutaFoto]
        )
        res.json({ message: "Piloto insertado correctamente" })
    } catch (error) {
        console.error("Error insertando piloto:", error)
        res.status(500).json({ message: "Error en la inserción" })
    }
})

router.put("/insertarCarrera", async (req, res) => {
    const { nombreCircuito, pais, vueltaRapida, anioCarrera, ganadorCarrera, ganadorEquipo } = req.body

    try {
        await conn.execute(
            "INSERT INTO Carreras (nombreCircuito, pais, vueltaRapida, anioCarrera, ganadorCarrera, ganadorEquipo) VALUES (?, ?, ?, ?, ?, ?)",
            [nombreCircuito, pais, vueltaRapida, anioCarrera, ganadorCarrera, ganadorEquipo]
        )
        res.json({ message: "Carrera insertada correctamente" })
    } catch (error) {
        console.error("Error insertando carrera:", error)
        res.status(500).json({ message: "Error en la inserción" })
    }
})

router.put("/insertarEquipo", async (req, res) => { 
    const { nombre, nacionalidad, base, anioFundacion, fundador } = req.body

    const rutaFoto = ""

    try {
        await conn.execute(
            "INSERT INTO Equipos (nombre, nacionalidad, base, anioFundacion, fundador, rutaFoto) VALUES (?, ?, ?, ?, ?, ?)",
            [nombre, nacionalidad, base, anioFundacion, fundador, rutaFoto]
        )
        res.json({ message: "Equipo insertado correctamente" })
    } catch (error) {
        console.error("Error insertando equipo:", error)
        res.status(500).json({ message: "Error en la inserción" })
    }
})

router.put("/insertarCampeonatoPilotos", async (req, res) => {
    const { anioTemporada, nombrePiloto, posicion, puntos, coche } = req.body

    try {
        await conn.execute(
            "INSERT INTO CampeonatoPilotos (anioTemporada, nombrePiloto, posicion, puntos, coche) VALUES (?, ?, ?, ?, ?)",
            [anioTemporada, nombrePiloto, posicion, puntos, coche]
        )
        res.json({ message: "Campeonato de Pilotos insertado correctamente" })
    } catch (error) {
        console.error("Error insertando Campeonato de Pilotos:", error)
        res.status(500).json({ message: "Error en la inserción" })
    }
})

router.put("/insertarCampeonatoPilotos", async (req, res) => {
    const { anioTemporada, nombrePiloto, posicion, puntos, coche } = req.body

    try {
        await conn.execute(
            "INSERT INTO CampeonatoPilotos (anioTemporada, nombrePiloto, posicion, puntos, coche) VALUES (?, ?, ?, ?, ?)",
            [anioTemporada, nombrePiloto, posicion, puntos, coche]
        )
        res.json({ message: "Campeonato de Pilotos insertado correctamente" })
    } catch (error) {
        console.error("Error insertando Campeonato de Pilotos:", error)
        res.status(500).json({ message: "Error en la inserción" })
    }
})

router.put("/insertarCampeonatoConstructores", async (req, res) => {
    const { anioTemporada, equipo, posicion, puntos, pilotos } = req.body

    try {
        await conn.execute(
            "INSERT INTO CampeonatoConstructores (anioTemporada, equipo, posicion, puntos, pilotos) VALUES (?, ?, ?, ?, ?)",
            [anioTemporada, equipo, posicion, puntos, pilotos]
        )
        res.json({ message: "Campeonato de Constructores insertado correctamente" })
    } catch (error) {
        console.error("Error insertando Campeonato de Constructores:", error)
        res.status(500).json({ message: "Error en la inserción" })
    }
})


export default router