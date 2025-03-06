import express from "express"
import process from "node:process"
import { conn } from "../sql/conexionSQL.mjs"

const router = express.Router() 

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.delete("/borrarPiloto", async (req, res) => {
    const { idPiloto } = req.body

    if (!idPiloto) {
        return res.status(400).json({ message: "Falta el ID del piloto" })
    }

    try {
        await conn.execute("DELETE FROM pilotos WHERE id = ?", [idPiloto])
        res.json({ message: "Piloto eliminado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al eliminar el piloto" })
    }
})

router.delete("/borrarCarrera", async (req, res) => {
    const { idCarrera } = req.body

    if (!idCarrera) {
        return res.status(400).json({ message: "Falta el ID de la carrera" })
    }

    try {
        await conn.execute("DELETE FROM carreras WHERE id = ?", [idCarrera])
        res.json({ message: "Carrera eliminada correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al eliminar la carrera" })
    }
})

router.delete("/borrarEquipo", async (req, res) => {
    const { idEquipo } = req.body

    if (!idEquipo) {
        return res.status(400).json({ message: "Falta el ID del equipo" })
    }

    try {
        await conn.execute("DELETE FROM equipos WHERE id = ?", [idEquipo])
        res.json({ message: "Equipo eliminado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al eliminar el equipo" })
    }
})

router.delete("/borrarCampeonatoConstructores", async (req, res) => {
    const { idCampeonatoConstructores } = req.body

    if (!idCampeonatoConstructores) {
        return res.status(400).json({ message: "Falta el ID del campeonato de constructores" })
    }

    try {
        await conn.execute("DELETE FROM CampeonatoConstructores WHERE id = ?", [idCampeonatoConstructores])
        res.json({ message: "Campeonato de constructores eliminado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al eliminar el campeonato de constructores" })
    }
})

router.delete("/borrarCampeonatoPiloto", async (req, res) => {
    const { idCampeonatoPiloto } = req.body


    if (!idCampeonatoPiloto) {
        return res.status(400).json({ message: "Falta el ID del campeonato de pilotos" })
    }

    try {
        await conn.execute("DELETE FROM CampeonatoPilotos WHERE id = ?", [idCampeonatoPiloto])
        res.json({ message: "Campeonato de pilotos eliminado correctamente" })
    } catch (error) {
        console.error("Error en la base de datos:", error)
        res.status(500).json({ message: "Error al eliminar el campeonato de pilotos" })
    }
})

export default router