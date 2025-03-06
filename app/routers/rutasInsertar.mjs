import express from "express"
import { conn } from "../../service/sql/conexionSQL.mjs"
import path from "path"
import session from "express-session"
import axios from "axios"
import { comprobarSesion } from "./rutasRegistrar.mjs"
import { upload } from "../middleware/subidaArchivos.mjs"
import process from "process"

const router = express.Router() 
/*https://medium.com/@diego.coder/subida-de-archivos-con-node-js-express-y-multer-55e99219d754 codigo de aqui*/
router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.post("/upload", upload.single("file"), async (req, res) => { 

    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ninguna imagen" })
    }

    const emailUsuario = req.session.usuario.email
    if (!emailUsuario) {
        return res.status(401).json({ message: "No hay usuario en sesión" })
    }

    const nuevaRutaFoto = req.file.filename

    try {
        await conn.execute("UPDATE usuarios SET rutaFoto = ? WHERE email = ?", [nuevaRutaFoto, emailUsuario])
        console.log("Imagen guardada en la BD:", nuevaRutaFoto)

        res.redirect("/perfil")
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al actualizar la foto" })
    }
})


router.post("/volver", (req,res) => {
    res.render("insercion")
})

router.post("/volverPrincipal", async (req,res) =>{
    res.redirect("/")
})

router.get("/insercion", (req, res) => {
    if (comprobarSesion(req)) {
        res.render("insercion")
    }else {
        res.render("index")
    }
})

router.post("/escogerInsercion", (req,res) => {
    const {categoria, passAdmin} = req.body

    if(passAdmin === process.env.PASS_ADMIN){
        switch (categoria) {
            case "piloto":
                return res.redirect("/insertarPiloto")
            case "carrera":
                return res.redirect("/insertarCarrera")
            case "equipo":
                return res.redirect("/insertarEquipo")
            case "campeonatosPilotos":
                return res.redirect("/insertarCampeonatosPilotos")
            case "campeonatosConstructores":
                return res.redirect("/insertarCampeonatosConstructores")
            default:
                return res.redirect("/insercion")
        }
    } else {
        res.render("insercion")
    }
})

router.get("/insertarPiloto", (req,res) => {
    if (comprobarSesion(req)) {
        res.render("insercionPiloto")
    }else {
        res.render("index")
    }
})

router.get("/insertarCarrera", (req,res) => {
    if (comprobarSesion(req)) {
        res.render("insercionCarrera")
    }else {
        res.render("index")
    }}
)

router.get("/insertarEquipo", (req,res) => {
    if (comprobarSesion(req)) {
        res.render("insercionEquipo")
    }else {
        res.render("index")
    }
})

router.get("/insertarCampeonatosPilotos", (req,res) => {
    if (comprobarSesion(req)) {
        res.render("insercionCampeonatoPiloto")
    }else {
        res.render("index")
    }
})

router.get("/insertarCampeonatosConstructores", (req,res) => {
    if (comprobarSesion(req)) {
        res.render("insercionCampeonatoConstructores")
    }else {
        res.render("index")
    }
})

//inserciones a traves de la API
router.post("/insertarPiloto", async (req,res) => {
    const { nombreCompleto, edad, nacionalidad, victorias, equipo, apodoAcronimo} = req.body
    const rutaFoto = ""
        try {
            await axios.put("http://localhost:3001/api/insertarPiloto", {
                nombreCompleto,
                edad,
                nacionalidad,
                victorias,
                equipo,
                apodoAcronimo,
                rutaFoto
            })
            res.redirect("insertarPiloto")
        } catch (error) {
            console.error("Error insertando piloto:", error)
            res.redirect("paginaPrincipal")
        }
})

router.post("/insertarCarrera", async (req, res) => {
    const { nombreCircuito, pais, vueltaRapida, anioCarrera, ganadorCarrera, ganadorEquipo } = req.body
    const rutaFoto = ""

    try {
        await axios.put("http://localhost:3001/api/insertarCarrera", {
            nombreCircuito,
            pais,
            vueltaRapida,
            anioCarrera,
            ganadorCarrera,
            ganadorEquipo
        })
        res.redirect("insertarCarrera")
    } catch (error) {
        console.error("Error insertando carrera:", error)
        res.redirect("/")
    }
})

router.post("/insertarEquipo", async (req, res) => {
    const { nombre, nacionalidad, base, anioFundacion, fundador } = req.body
    const rutaFoto = ""

    try {
        await axios.put("http://localhost:3001/api/insertarEquipo", {
            nombre,
            nacionalidad,
            base,
            anioFundacion,
            fundador
        })

        res.redirect("/insertarEquipo")
    } catch (error) {
        console.error("Error insertando equipo:", error)
        res.redirect("/")
    }
})

router.post("/insertarCampeonatosPilotos", async (req, res) => {
    const { anioTemporada, nombrePiloto, posicion, puntos, coche } = req.body

    try {
        await axios.put("http://localhost:3001/api/insertarCampeonatoPilotos", {
            anioTemporada,
            nombrePiloto,
            posicion,
            puntos,
            coche
        })

        res.redirect("insertarCampeonatosPilotos")
    } catch (error) {
        console.error("Error insertando Campeonato de Pilotos:", error)
        res.redirect("/")
    }
})

router.post("/insertarCampeonatosConstructores", async (req, res) => {
    const { anioTemporada, equipo, posicion, puntos, pilotos } = req.body

    try {
        await axios.put("http://localhost:3001/api/insertarCampeonatoConstructores", {
            anioTemporada,
            equipo,
            posicion,
            puntos,
            pilotos
        })

        res.redirect("insertarCampeonatosConstructores")
    } catch (error) {
        console.error("Error insertando Campeonato de Constructores:", error)
        res.redirect("/")
    }
})



export default router