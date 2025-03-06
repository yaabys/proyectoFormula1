import express from "express"
import { conn } from "../sql/conexionSQL.mjs"
import { db } from "../../app/firebase/conexionFirebase.mjs"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import axios from "axios"

const router = express.Router() 

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.put("/gestionarTokens", async (req, res) => {
    const { email, numTokens } = req.query

    if (!email || !numTokens) {
        return res.status(400).json({ message: "Faltan parámetros" })
    }

    try {
        const usuariosCollection = collection(db, "usuarios_f1")
        const docRef = doc(usuariosCollection, email.toLowerCase())
        const usuarioDoc = await getDoc(docRef)

        if (!usuarioDoc.exists()) {
            return res.status(404)
        }

        let datosUsuario = usuarioDoc.data()
        let tokensActuales = datosUsuario.tokens
        let tokensRemplazar = parseInt(numTokens)

        let nuevosTokens = tokensActuales - (tokensRemplazar)
        await setDoc(docRef, { ...datosUsuario, tokens: nuevosTokens })

    } catch (error) {
        console.error("Error al restar o sumar tokens:", error)
    }
})

router.post("/obtenerPiloto", async (req, res) => {
    const { idPiloto } = req.body

    try {
        const resultado = await conn.execute("SELECT * FROM pilotos WHERE id = ?", [idPiloto])

        const filas = resultado.rows

        if (filas.length > 0) {
            res.json(filas[0])
        } else {
            res.status(404).json({ message: "Piloto no encontrado" })
        }
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al obtener el piloto" })
    }
})

router.put("/modificarPiloto", async (req, res) => {
    
    const { idPiloto, nombre, edad, nacionalidad, victorias, equipo, apodoAcronimo } = req.body

    try {
        await conn.execute(
            "UPDATE pilotos SET nombreCompleto = ?, edad = ?, nacionalidad = ?, victorias = ?, equipo = ?, apodoAcronimo = ? WHERE id = ?",
            [nombre, edad, nacionalidad, victorias, equipo, apodoAcronimo, idPiloto]
        )
        res.json({ message: "Piloto modificado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al modificar el piloto" })
    }
})

router.post("/obtenerCarrera", async (req, res) => {
    const { idCarrera } = req.body

    try {
        const resultado = await conn.execute("SELECT * FROM Carreras WHERE id = ?", [idCarrera])

        const filas = resultado.rows

        if (filas.length > 0) {
            res.json(filas[0])
        } else {
            res.status(404).json({ message: "Carrera no encontrada" })
        }
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al obtener la carrera" })
    }
})

router.put("/modificarCarrera", async (req, res) => {
    const { idCarrera, nombreCircuito, pais, vueltaRapida, anioCarrera, ganadorCarrera, ganadorEquipo } = req.body

    try {
        await conn.execute(
            "UPDATE Carreras SET nombreCircuito = ?, pais = ?, vueltaRapida = ?, anioCarrera = ?, ganadorCarrera = ?, ganadorEquipo = ? WHERE id = ?",
            [nombreCircuito, pais, vueltaRapida, anioCarrera, ganadorCarrera, ganadorEquipo, idCarrera]
        )

        res.json({ message: "Carrera modificada correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al modificar la carrera" })
    }
})

router.post("/obtenerEquipo", async (req, res) => {
    const { idEquipo } = req.body

    try {
        const resultado = await conn.execute("SELECT * FROM Equipos WHERE id = ?", [idEquipo])

        const filas = resultado.rows

        if (filas.length > 0) {
            res.json(filas[0])
        } else {
            res.status(404).json({ message: "Equipo no encontrado" })
        }
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al obtener el equipo" })
    }
})

router.put("/modificarEquipo", async (req, res) => {
    const { idEquipo, nombre, nacionalidad, base, anioFundacion, fundador } = req.body

    try {
        await conn.execute(
            "UPDATE Equipos SET nombre = ?, nacionalidad = ?, base = ?, anioFundacion = ?, fundador = ? WHERE id = ?",
            [nombre, nacionalidad, base, anioFundacion, fundador, idEquipo]
        )

        res.json({ message: "Equipo modificado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al modificar el equipo" })
    }
})

router.post("/obtenerCampeonatoPilotos", async (req, res) => {
    const { idCampeonatoPiloto } = req.body
    try {
        const resultado = await conn.execute("SELECT * FROM CampeonatoPilotos WHERE id = ?", [idCampeonatoPiloto])
        const filas = resultado.rows
        if (filas.length > 0) {
            res.json(filas[0])
        } else {
            res.status(404).json({ message: "Campeonato no encontrado" })
        }
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al obtener el campeonato" })
    }
})

router.put("/modificarCampeonatoPilotos", async (req, res) => {
    const { idCampeonatoPiloto, anioTemporada, nombrePiloto, posicion, puntos, coche } = req.body

    try {
        await conn.execute(
            "UPDATE CampeonatoPilotos SET anioTemporada = ?, nombrePiloto = ?, posicion = ?, puntos = ?, coche = ? WHERE id = ?",
            [anioTemporada, nombrePiloto, posicion, puntos, coche, idCampeonatoPiloto]
        )
        res.json({ message: "Campeonato modificado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al modificar el campeonato" })
    }
})


router.post("/obtenerCampeonatoConstructores", async (req, res) => {
    const { idCampeonatoConstructores } = req.body

    try {
        const resultado = await conn.execute("SELECT * FROM CampeonatoConstructores WHERE id = ?", [idCampeonatoConstructores])
        const filas = resultado.rows

        if (filas.length > 0) {
            res.json(filas[0])
        } else {
            res.status(404).json({ message: "Campeonato de constructores no encontrado" })
        }
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al obtener el campeonato de constructores" })
    }
})

router.put("/modificarCampeonatoConstructores", async (req, res) => {
    const { idCampeonatoConstructores, anioTemporada, equipo, posicion, puntos, pilotos } = req.body

    try {
        await conn.execute(
            "UPDATE CampeonatoConstructores SET anioTemporada = ?, equipo = ?, posicion = ?, puntos = ?, pilotos = ? WHERE id = ?",
            [anioTemporada, equipo, posicion, puntos, pilotos, idCampeonatoConstructores]
        )

        res.json({ message: "Campeonato de constructores modificado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al modificar el campeonato de constructores" })
    }
})



export default router