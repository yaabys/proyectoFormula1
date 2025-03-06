import express from "express"
import process from "node:process"
import { comprobarSesion } from "./rutasRegistrar.mjs"
import axios from "axios"

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.post("/editarPiloto", async (req, res) => { //para mandarlo a la plantilla del piloto
    const { idPiloto,passAdmin } = req.body
    if (comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN) {
        try {
            const respuesta = await axios.post("http://localhost:3001/api/obtenerPiloto", {
                idPiloto
            })

            const piloto = respuesta.data
            res.render("editarPiloto", { piloto })
        } catch (error) {
            console.error("Error al obtener el piloto:", error)
            res.redirect("/pilotos")
        }
    } else {
        res.redirect("/index")
    }
})

router.post("/modificarPiloto", async (req, res) => { //modificar piloto como tal
    if (comprobarSesion(req)) {
        const { idPiloto, nombre, edad, nacionalidad, victorias, equipo, apodoAcronimo } = req.body

        try {
            await axios.put("http://localhost:3001/api/modificarPiloto", {
                idPiloto,
                nombre,
                edad,
                nacionalidad,
                victorias,
                equipo,
                apodoAcronimo
            })

            res.redirect("/pilotos")
        } catch (error) {
            console.error("Error al modificar el piloto:", error)
            res.redirect("/pilotos")
        }
    } else {
        res.redirect("/index")
    }
})

router.post("/editarCarrera", async (req, res) => {
    const { idCarrera,passAdmin } = req.body
    if (comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN) {
        try {
            const respuesta = await axios.post("http://localhost:3001/api/obtenerCarrera", {
                idCarrera
            })
            const carrera = respuesta.data
            res.render("editarCarrera", { carrera })
        } catch (error) {
            console.error("Error al obtener la carrera:", error)
            res.redirect("/carreras")
        }
    } else {
        res.redirect("/index")
    }
})

router.post("/modificarCarrera", async (req, res) => {
    if (!comprobarSesion(req)) {
        return res.redirect("/index")
    }

    const { idCarrera, nombreCircuito, pais, vueltaRapida, anioCarrera, ganadorCarrera, ganadorEquipo } = req.body

    try {
        await axios.put("http://localhost:3001/api/modificarCarrera", {
            idCarrera,
            nombreCircuito,
            pais,
            vueltaRapida,
            anioCarrera,
            ganadorCarrera,
            ganadorEquipo
        })

        res.redirect("/carreras")
    } catch (error) {
        console.error("Error al modificar la carrera:", error)
        res.redirect("/carreras")
    }
})

router.post("/editarEquipo", async (req, res) => {
    const { idEquipo,passAdmin } = req.body
    if (comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN) {
        try {
            const respuesta = await axios.post("http://localhost:3001/api/obtenerEquipo", {
                idEquipo
            })
            const equipo = respuesta.data
            res.render("editarEquipo", { equipo })
        } catch (error) {
            console.error("Error al obtener el equipo:", error)
            res.redirect("/equipos")
        }
    } else {
        res.redirect("/index")
    }
})

router.post("/modificarEquipo", async (req, res) => {
    if (!comprobarSesion(req)) {
        return res.redirect("/index")
    }

    const { idEquipo, nombre, nacionalidad, base, anioFundacion, fundador } = req.body

    try {
        await axios.put("http://localhost:3001/api/modificarEquipo", {
            idEquipo,
            nombre,
            nacionalidad,
            base,
            anioFundacion,
            fundador
        })

        res.redirect("/equipos")
    } catch (error) {
        console.error("Error al modificar el equipo:", error)
        res.redirect("/equipos")
    }
})

router.post("/editarCampeonatoPilotos", async (req, res) => {
    const { idCampeonatoPiloto,passAdmin } = req.body
    if(comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN){

        try {
            const respuesta = await axios.post("http://localhost:3001/api/obtenerCampeonatoPilotos", { idCampeonatoPiloto })
            const campeonato = respuesta.data
            res.render("editarCampeonatoPilotos", { campeonato })
        } catch (error) {
            console.error("Error al obtener el campeonato:", error)
            res.redirect("/campeonatosPilotos")
        }
    } else {
        return res.redirect("/index")
    }
})

router.post("/modificarCampeonatoPilotos", async (req, res) => {
    if (!comprobarSesion(req)) {
        return res.redirect("/index")
    }

    const { idCampeonatoPiloto, anioTemporada, nombrePiloto, posicion, puntos, coche } = req.body
    try {
        await axios.put("http://localhost:3001/api/modificarCampeonatoPilotos", {
            idCampeonatoPiloto,
            anioTemporada,
            nombrePiloto,
            posicion,
            puntos,
            coche
        })
        res.redirect("/campeonatosPilotos")
    } catch (error) {
        console.error("Error al modificar el campeonato:", error)
        res.redirect("/campeonatosPilotos")
    }
})

router.post("/editarCampeonatoConstructores", async (req, res) => {
    const { idCampeonatoConstructores,passAdmin } = req.body
    if(comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN){
        try {
            const respuesta = await axios.post("http://localhost:3001/api/obtenerCampeonatoConstructores", { idCampeonatoConstructores })
            const campeonato = respuesta.data
            res.render("editarCampeonatoConstructores", { campeonato })
        } catch (error) {
            console.error("Error al obtener el campeonato de constructores:", error)
            res.redirect("/campeonatosConstructores")
        }
    } else {
        res.redirect("/index")
    }
})

router.post("/modificarCampeonatoConstructores", async (req, res) => {
    if (!comprobarSesion(req)) {
        return res.redirect("/index")
    }

    const { idCampeonatoConstructores, anioTemporada, equipo, posicion, puntos, pilotos } = req.body

    try {
        await axios.put("http://localhost:3001/api/modificarCampeonatoConstructores", {
            idCampeonatoConstructores, anioTemporada, equipo, posicion, puntos, pilotos
        })

        res.redirect("/campeonatosConstructores")
    } catch (error) {
        console.error("Error al modificar el campeonato de constructores:", error)
        res.redirect("/campeonatosConstructores")
    }
})

export default router

