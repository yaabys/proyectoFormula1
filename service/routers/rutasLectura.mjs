import express from "express"
import { conn } from "../sql/conexionSQL.mjs"
import { db } from "../../app/firebase/conexionFirebase.mjs"
import { collection, doc, getDoc} from "firebase/firestore"
import axios from "axios"

const router = express.Router() 

router.use(express.json())
router.use(express.urlencoded({extended:true}))

//este tipo de peticiones a la api seran gratuitas

router.get("/devolverTokens", async (req, res) => {
        const { email } = req.query

        const usuariosCollection = collection(db, "usuarios_f1")
        const docRef = doc(usuariosCollection, email.toLowerCase())
        const usuarioDoc = await getDoc(docRef)
        
        const datosUsuario = usuarioDoc.data()

        let tokens = 0

        if(datosUsuario.tokens){
            tokens = datosUsuario.tokens
        } else {
            tokens = 0
        }

        return res.json({ tokens })
})

router.get("/pilotos", async (req, res) =>{
    let sql = "SELECT * FROM pilotos"
    const result = await conn.execute(sql)
    const todosPilotos = result.rows  
    res.json(todosPilotos)
})

router.get("/equipos", async (req, res) =>{
    let sql = "SELECT * FROM equipos"
    const result = await conn.execute(sql)
    const todosEquipos = result.rows  
    res.json(todosEquipos)
})

router.get("/carreras", async (req, res) =>{
    let sql = "SELECT * FROM carreras"
    const result = await conn.execute(sql)
    const todasCarreras = result.rows  
    res.json(todasCarreras)
})

router.get("/campeonatosPilotos", async (req, res) =>{
    let sql = "SELECT * FROM campeonatopilotos"
    const result = await conn.execute(sql)
    const todosCampPilotos = result.rows  
    res.json(todosCampPilotos)
})

router.get("/campeonatosConstructores", async (req, res) =>{
    let sql = "SELECT * FROM campeonatoconstructores"
    const result = await conn.execute(sql)
    const todosCampConst = result.rows  
    res.json(todosCampConst)
})

//este tipo de peticiones a la api seran de "pago" con tokens
router.get("/buscarPiloto", async (req, res) => {
    try {
        let { apodo } = req.query

        if (!apodo) {
            return res.status(400).json({ message: "Falta el apodo" })
        }

        const sql = "SELECT * FROM pilotos WHERE apodoAcronimo LIKE ?"
        const valores = [`${apodo}%`]

        const { rows: pilotos } = await conn.execute({ sql, args: valores })

        if (pilotos.length === 0) {
            return res.status(404).json({ message: "Piloto no encontrado" })
        }

        res.json(pilotos)
    } catch (error) {
        console.error("Error en buscarPiloto:", error)
        res.status(500).json({ message: "Error en el servidor" })
    }
})


router.get("/buscarEquipo", async (req, res) => {
    try {
        let nombre = req.query.nombre
        if (!nombre) {
            return res.status(400).json({ message: "Falta el nombre del equipo" })
        }
        
        const sql = "SELECT * FROM equipos WHERE nombre LIKE ?"
        const valorBusqueda = [`${nombre}%`]

        const { rows: equipos } = await conn.execute({ sql, args: valorBusqueda })

        if (equipos.length === 0) {
            return res.status(404).json({ message: "Equipo no encontrado" })
        }
        
        res.json(equipos)
    } catch (error) {
        console.error("Error en buscarEquipo:", error)
    }
})

router.get("/buscarCarreras", async (req, res) => {
    try {
        let { nombreCircuito, anioCarrera } = req.query

        if (!nombreCircuito && !anioCarrera) {
            return res.status(400).json({ message: "Falta el nombre de la carrera o el año" })
        }

        let sql = ""
        let valores = []

        if (nombreCircuito && anioCarrera) {
            sql = "SELECT * FROM carreras WHERE nombreCircuito LIKE ? AND anioCarrera = ?"
            valores = [`${nombreCircuito}%`, anioCarrera]
        } else if (nombreCircuito) {
            sql = "SELECT * FROM carreras WHERE nombreCircuito LIKE ?"
            valores = [`${nombreCircuito}%`]
        } else {
            sql = "SELECT * FROM carreras WHERE anioCarrera = ?"
            valores = [anioCarrera]
        }
        const { rows: carreras } = await conn.execute({ sql, args: valores })

        if (carreras.length === 0) {
            return res.status(404).json({ message: "Carrera no encontrada" })
        }

        res.json(carreras)
    } catch (error) {
        console.error("Error en buscarCarreras:", error)
    }
})

router.get("/buscarCampeonatoPilotos", async (req, res) => {
    try {
        let { nombrePiloto, anioTemporada } = req.query

        if (!nombrePiloto && !anioTemporada) {
            return res.status(400).json({ message: "Falta el nombre del piloto o el año del campeonato" })
        }

        let sql = ""
        let valores = []

        if (nombrePiloto && anioTemporada) {
            sql = "SELECT * FROM CampeonatoPilotos WHERE nombrePiloto LIKE ? AND anioTemporada = ?"
            valores = [`${nombrePiloto}%`, anioTemporada]
        } else if (nombrePiloto) {
            sql = "SELECT * FROM CampeonatoPilotos WHERE nombrePiloto LIKE ?"
            valores = [`${nombrePiloto}%`]
        } else {
            sql = "SELECT * FROM CampeonatoPilotos WHERE anioTemporada = ?"
            valores = [anioTemporada]
        }

        const { rows: campeonatos } = await conn.execute({ sql, args: valores })

        if (campeonatos.length === 0) {
            return res.status(404).json({ message: "Campeonato de piloto no encontrado" })
        }

        res.json(campeonatos)
    } catch (error) {
        console.error("Error en buscarCampeonatoPilotos:", error)
    }
})

router.get("/buscarCampeonatoConstructores", async (req, res) => {
    try {
        let { nombreEquipo, anioTemporada } = req.query

        if (!nombreEquipo && !anioTemporada) {
            return res.status(400).json({ message: "Falta el nombre del equipo o el año de la temporada" })
        }

        let sql = ""
        let valores = []

        if (nombreEquipo && anioTemporada) {
            sql = "SELECT * FROM CampeonatoConstructores WHERE equipo LIKE ? AND anioTemporada = ?"
            valores = [`${nombreEquipo}%`, anioTemporada]
        } else if (nombreEquipo) {
            sql = "SELECT * FROM CampeonatoConstructores WHERE equipo LIKE ?"
            valores = [`${nombreEquipo}%`]
        } else {
            sql = "SELECT * FROM CampeonatoConstructores WHERE anioTemporada = ?"
            valores = [anioTemporada]
        }

        const { rows: campeonatos } = await conn.execute({ sql, args: valores })

        if (campeonatos.length === 0) {
            return res.status(404).json({ message: "Campeonato no encontrado" })
        }

        res.json(campeonatos)
    } catch (error) {
        console.error("Error en buscarCampeonatoConstructores:", error)
    }
})

router.get("/devolverUsuarioCompleto", async (req, res) => {
    const { email } = req.query
    try {
        const sql = "SELECT * FROM Usuarios WHERE email = ?"
        //como el email es unico simplemente no hace falta que luego filtremos con un array[0]
        const valores = [`${email}`]
        const { rows: usuario } = await conn.execute({ sql, args: valores })

        const tokenResponse = await axios.get(`http://localhost:3001/api/devolverTokens`, {
            params: { email }
        })
        //aqui juntamos tanto la consulta sql como la consulta con axios
        const usuarioConTokens = {
            ...usuario,
            tokens: tokenResponse.data.tokens
        }

        res.json(usuarioConTokens)
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

router.get("/mostrarUsuarios",async (req,res) =>{
    let sql = "SELECT * FROM Usuarios"
    const result = await conn.execute(sql)
    const todosPilotos = result.rows  
    res.json(todosPilotos)
})

export default router