import express from "express"
import process from "node:process"
import { comprobarSesion } from "./rutasRegistrar.mjs"
import axios from "axios"

const router = express.Router() 

router.use(express.json())
router.use(express.urlencoded({extended:true}))


router.post("/borrarPiloto", async(req,res) => {
    const { idPiloto,passAdmin } = req.body
    if(comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN){   

        await axios.delete("http://localhost:3001/api/borrarPiloto",{
            data: { idPiloto }
        })
    
            res.redirect("/pilotos")
        } else {
            res.redirect("/index")
    }
})

router.post("/borrarCarrera", async (req, res) => {
    const { idCarrera,passAdmin } = req.body
    if (comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN) {

        await axios.delete("http://localhost:3001/api/borrarCarrera", {
            data: { idCarrera }
        })

        res.redirect("/carreras")
    } else {
        res.redirect("/index")
    }
})

router.post("/borrarEquipo", async (req, res) => {
    const { idEquipo,passAdmin } = req.body
    if (comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN) {

        await axios.delete("http://localhost:3001/api/borrarEquipo", {
            data: { idEquipo }
        })

        res.redirect("/equipos")
    } else {
        res.redirect("/index")
    }
})

router.post("/borrarCampeonatoConstructores", async (req, res) => {
    const { idCampeonatoConstructores,passAdmin } = req.body
    if (comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN) {

        await axios.delete("http://localhost:3001/api/borrarCampeonatoConstructores", {
            data: { idCampeonatoConstructores }
        })

        res.redirect("/campeonatosConstructores")
    } else {
        res.redirect("/index")
    }
})

router.post("/borrarCampeonatoPiloto", async (req, res) => {
    const { idCampeonatoPiloto,passAdmin } = req.body
    if (comprobarSesion(req) && passAdmin === process.env.PASS_ADMIN) {

        await axios.delete("http://localhost:3001/api/borrarCampeonatoPiloto", {
            data: { idCampeonatoPiloto }
        })

        res.redirect("/campeonatosPilotos")
    } else {
        res.redirect("/index")
    }
})

export default router

