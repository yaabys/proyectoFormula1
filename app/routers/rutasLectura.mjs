import express from "express"
import { comprobarSesion } from "./rutasRegistrar.mjs"
import axios from "axios"

const router = express.Router() 

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.get("/", async (req, res) =>{
    if (comprobarSesion(req)) {
        const emailSession = req.session.usuario.email

        try {
            const responseTokens = await axios.get("http://localhost:3001/api/devolverTokens", {
                params: { email: emailSession }
            })

            const tokens = responseTokens.data.tokens

            res.render("paginaPrincipal.ejs", { tokens })
        } catch (error) {
            res.render("index.ejs")
        }
    } else {
        res.render("index.ejs")
    }
})

router.get("/perfil", async (req, res) => {
    if (comprobarSesion(req)) {
        try {
            const emailUsuario = req.session.usuario.email
            const response = await axios.get("http://localhost:3001/api/devolverUsuarioCompleto", {
                params: { email: emailUsuario }
            })

            const data = response.data

            const usuario = {
                ...data[0],
                tokens: data.tokens
            }

            res.render("perfil", { usuario })
        } catch (error) {
            console.error("Error al obtener perfil:", error)
            res.render("index")
        }
    } else {
        res.render("index.ejs")
    }
})


// Array de preguntas
const preguntasBase = [
    { pregunta: "¿Quién es el piloto con más títulos mundiales en la historia de la Fórmula 1?", opciones: ["Michael Schumacher", "Lewis Hamilton", "Ayrton Senna", "Juan Manuel Fangio"], respuesta: "Lewis Hamilton" },
    { pregunta: "¿En qué año se celebró la primera carrera de la Fórmula 1 como campeonato mundial?", opciones: ["1945", "1950", "1955", "1960"], respuesta: "1950" },
    { pregunta: "¿Cuál es la escudería más laureada en la historia de la Fórmula 1?", opciones: ["Mercedes", "Ferrari", "McLaren", "Red Bull"], respuesta: "Ferrari" },
    { pregunta: "¿Quién ganó el campeonato mundial de 2023?", opciones: ["Lewis Hamilton", "Max Verstappen", "Charles Leclerc", "Fernando Alonso"], respuesta: "Max Verstappen" },
    { pregunta: "¿Qué circuito es conocido como 'El templo de la velocidad'?", opciones: ["Silverstone", "Mónaco", "Monza", "Spa-Francorchamps"], respuesta: "Monza" },
    { pregunta: "¿Cuántos títulos mundiales ganó Ayrton Senna?", opciones: ["2", "3", "4", "5"], respuesta: "3" },
    { pregunta: "¿Cuál es el circuito más icónico y difícil de adelantar?", opciones: ["Silverstone", "Mónaco", "Suzuka", "Interlagos"], respuesta: "Mónaco" },
    { pregunta: "¿Qué equipo logró 8 campeonatos de constructores consecutivos entre 2014 y 2021?", opciones: ["Ferrari", "Mercedes", "Red Bull", "McLaren"], respuesta: "Mercedes" },
    { pregunta: "¿Qué piloto sufrió un grave accidente en Bahréin 2020 pero logró salir ileso?", opciones: ["Kevin Magnussen", "Lance Stroll", "Romain Grosjean", "Pierre Gasly"], respuesta: "Romain Grosjean" },
    { pregunta: "¿En qué equipo debutó Fernando Alonso en la Fórmula 1?", opciones: ["McLaren", "Renault", "Minardi", "Ferrari"], respuesta: "Minardi" },
    { pregunta: "¿Quién es el piloto más joven en ganar una carrera de F1?", opciones: ["Sebastian Vettel", "Lewis Hamilton", "Max Verstappen", "Charles Leclerc"], respuesta: "Max Verstappen" },
    { pregunta: "¿Cuántas carreras hay en la temporada 2024 de F1?", opciones: ["20", "22", "23", "24"], respuesta: "24" },
    { pregunta: "¿Cuál es el equipo más reciente en ganar su primer campeonato de constructores?", opciones: ["Mercedes", "Red Bull", "McLaren", "Aston Martin"], respuesta: "Red Bull" },
    { pregunta: "¿Qué equipo tiene la famosa unidad de potencia 'HRC'?", opciones: ["Ferrari", "Mercedes", "Red Bull", "Alpine"], respuesta: "Red Bull" },
    { pregunta: "¿Qué circuito tiene la recta más larga de la F1?", opciones: ["Bahréin", "Azerbaiyán", "China", "México"], respuesta: "Azerbaiyán" },
    { pregunta: "¿Qué piloto fue apodado 'El Kaiser'?", opciones: ["Sebastian Vettel", "Niki Lauda", "Michael Schumacher", "Alain Prost"], respuesta: "Michael Schumacher" },
    { pregunta: "¿Qué piloto ganó el GP de Brasil 2008 pero perdió el campeonato en la última curva?", opciones: ["Felipe Massa", "Lewis Hamilton", "Kimi Räikkönen", "Robert Kubica"], respuesta: "Felipe Massa" },
    { pregunta: "¿Cuál de estos pilotos ganó un campeonato con Brawn GP en 2009?", opciones: ["Rubens Barrichello", "Jenson Button", "Mark Webber", "Fernando Alonso"], respuesta: "Jenson Button" },
    { pregunta: "¿Qué piloto rompió la racha de títulos de Mercedes en 2021?", opciones: ["Charles Leclerc", "Max Verstappen", "Fernando Alonso", "Sergio Pérez"], respuesta: "Max Verstappen" },
    { pregunta: "¿Qué piloto es conocido por su icónica frase 'Leave me alone, I know what I'm doing'?", opciones: ["Sebastian Vettel", "Fernando Alonso", "Kimi Räikkönen", "Valtteri Bottas"], respuesta: "Kimi Räikkönen" }
]

//QUIZ
router.get("/quiz", (req, res) => {
    function obtenerPreguntasAleatorias() {
        return preguntasBase.sort(() => Math.random() - 0.5).slice(0, 10)
    }
        if (comprobarSesion(req)) {
            res.render("quiz.ejs", { preguntas: obtenerPreguntasAleatorias() })
        } else {
            res.redirect("/")
        }
})

router.get("/pilotos", async (req,res) => {
    if (comprobarSesion(req)) {
        try {
            const response = await axios.get("http://localhost:3001/api/pilotos")

            const pilotos = response.data

            res.render("pilotos.ejs", { pilotos })
        } catch (error) {
            res.render("index.ejs", { pilotos })
        }
    } else {
        res.render("index.ejs" ,{ pilotos })
    }
})

router.get("/carreras", async (req,res) => {
    if (comprobarSesion(req)) {
        try {
            const response = await axios.get("http://localhost:3001/api/carreras")

            const carreras = response.data

            res.render("carreras.ejs", { carreras })
        } catch (error) {
            res.render("index.ejs")
        }
    } else {
        res.render("index.ejs")
    }
})

router.get("/equipos", async (req,res) => {
    if (comprobarSesion(req)) {
        try {
            const response = await axios.get("http://localhost:3001/api/equipos")
            const equipos = response.data

            res.render("equipos.ejs", { equipos })
        } catch (error) {
            res.render("index.ejs")
        }
    } else {
        res.render("index.ejs")
    }
})

router.get("/campeonatosConstructores", async (req,res) => {
    if (comprobarSesion(req)) {
        try {
            const response = await axios.get("http://localhost:3001/api/campeonatosConstructores")

            const campeonatos = response.data

            res.render("campeonatosConstructores.ejs", { campeonatos })
        } catch (error) {
            res.render("index.ejs")
        }
    } else {
        res.render("index")
    }
})

router.get("/campeonatosPilotos", async (req,res) => {
    if (comprobarSesion(req)) {
        try {
            const response = await axios.get("http://localhost:3001/api/campeonatosPilotos")

            const campeonatos = response.data

            res.render("campeonatosPilotos", { campeonatos })
        } catch (error) {
            res.renderres.render("index")
        }
    } else {
        res.render("index")
    }
})

router.post("/verificarQuiz", async (req, res) => {
    if (!comprobarSesion(req)) {
        return res.redirect("/")
    }

    let respuestasUsuario = req.body
    let preguntasCorrectas = 0

    preguntasBase.forEach((pregunta, index) => {
        if (respuestasUsuario[`pregunta${index}`] === pregunta.respuesta) {
            preguntasCorrectas++
        }
    })

    let tokensGanados = preguntasCorrectas * 5
    const emailSession = req.session.usuario.email
    const result = await axios.get("http://localhost:3001/api/devolverTokens", {
        params: { email: emailSession }
    })

    const responseTokens = result.data.tokens
    
    req.session.usuario.tokens = (responseTokens) + tokensGanados

    axios.put("http://localhost:3001/api/gestionarTokens", null, {
        params: { email: emailSession, numTokens: -tokensGanados }
    })

    res.render("resultados.ejs", { correctas: preguntasCorrectas, tokensGanados, tokensTotales: req.session.usuario.tokens })
})



router.post("/buscarPiloto", async (req, res) => {
    const apodo = req.body.piloto
    const emailSession = req.session.usuario.email

    if (!comprobarSesion(req)) {
        return res.redirect("http://localhost:3000/pilotos")
    }
    try {
        const response = await axios.get("http://localhost:3001/api/buscarPiloto", {
            params: {apodo: apodo} //aqui paso el email de session porque dos awaits daban fallo entonces lo hacemos de la parte del servidor
        })
        //aqui no utilizamos el await porque no funcionaba y a parte porque entendemos
        //que hagas la consulta que hagas aunque sea erronea que te siga restando
        //porque consumes nuestra energia
        axios.put("http://localhost:3001/api/gestionarTokens", null, {
            params: { email: emailSession, numTokens: 5 }
        })

        const pilotos = response.data

        res.render("pilotos", { pilotos })

    } catch (error) { //si falla que se cargue todo otra vez
        console.error("Error en buscarPiloto:", error)
        const response = await axios.get("http://localhost:3001/api/pilotos")
        res.render("pilotos", { pilotos: response.data })
    }
})

router.post("/buscarEquipo", async (req, res) => {
    const nombre = req.body.equipo
    const emailSession = req.session.usuario.email

    if (!comprobarSesion(req)) {
        return res.redirect("http://localhost:3000/equipos")
    }
    try {
        const response = await axios.get("http://localhost:3001/api/buscarEquipo", {
            params: { nombre, emailSession }
        })

        axios.put("http://localhost:3001/api/gestionarTokens", null, {
            params: { email: emailSession, numTokens: 5 }
        })

        const equipos = response.data
        res.render("equipos", { equipos })
    } catch (error) {
        console.error("Error en buscarEquipo:", error)
        const response = await axios.get("http://localhost:3001/api/equipos")
        res.render("equipos", { equipos: response.data })
    }
})

router.post("/buscarCarreras", async (req, res) => {
    const emailSession = req.session.usuario.email
    if (!comprobarSesion(req)){
        return res.redirect("http://localhost:3000/carreras")
    }
    try {
        let response
        // para depende de lo que me busque hay que hacer dos if y luego meter los paramas asi
        if (req.body.nombreCircuito && req.body.anioCarrera){ //si estan las dos
            response = await axios.get("http://localhost:3001/api/buscarCarreras", { 
                params : {email: emailSession,nombreCircuito: req.body.nombreCircuito,anioCarrera: req.body.anioCarrera}
            })
        } else if(req.body.anioCarrera){ //si solo hay carrera
            response = await axios.get("http://localhost:3001/api/buscarCarreras", { 
                params : {email: emailSession,anioCarrera: req.body.anioCarrera}
            })
        } else { //si solo hay circuito
            response = await axios.get("http://localhost:3001/api/buscarCarreras", { 
                params : {email: emailSession,nombreCircuito: req.body.nombreCircuito}
            })
        }

        const carreras = response.data

        axios.put("http://localhost:3001/api/gestionarTokens", null, {
            params: { email: emailSession, numTokens: 5 }
        })

        res.render("carreras.ejs", { carreras })
    } catch (error) {
        console.error("Error en buscarCarreras:", error)
        const response = await axios.get("http://localhost:3001/api/carreras")
        res.render("carreras", { carreras: response.data })
    }
})

router.post("/buscarCampeonatoPilotos", async (req, res) => {
    const emailSession = req.session.usuario.email
    if (!comprobarSesion(req)) {
        return res.redirect("http://localhost:3000/campeonatosPilotos")
    }

    try {
        let response
        if (req.body.nombrePiloto && req.body.anioTemporada) {
            response = await axios.get("http://localhost:3001/api/buscarCampeonatoPilotos", { 
                params: { email: emailSession, nombrePiloto: req.body.nombrePiloto, anioTemporada: req.body.anioTemporada }
            })
        } else if (req.body.nombrePiloto) {
            response = await axios.get("http://localhost:3001/api/buscarCampeonatoPilotos", { 
                params: { email: emailSession, nombrePiloto: req.body.nombrePiloto }
            })
        } else if (req.body.anioTemporada) {
            response = await axios.get("http://localhost:3001/api/buscarCampeonatoPilotos", { 
                params: { email: emailSession, anioTemporada: req.body.anioTemporada }
            })
        }

        const campeonatos = response.data

        axios.put("http://localhost:3001/api/gestionarTokens", null, {
            params: { email: emailSession, numTokens: 5 }
        })

        res.render("campeonatosPilotos", { campeonatos })
    } catch (error) {
        console.error("Error en buscarCampeonatoPilotos:", error)
        const response = await axios.get("http://localhost:3001/api/campeonatosPilotos")
        res.render("campeonatosPilotos", { campeonatos: response.data })
    }
})


router.post("/buscarCampeonatoConstructores", async (req, res) => {
    const emailSession = req.session.usuario.email
    if (!comprobarSesion(req)) {
        return res.redirect("http://localhost:3000/campeonatosConstructores")
    }

    try {
        let response
        // Si se pasa tanto nombre de equipo como año de temporada
        if (req.body.nombreEquipo && req.body.anioTemporada) {
            response = await axios.get("http://localhost:3001/api/buscarCampeonatoConstructores", { 
                params: { email: emailSession, nombreEquipo: req.body.nombreEquipo, anioTemporada: req.body.anioTemporada }
            })
        } else if (req.body.nombreEquipo) {
            response = await axios.get("http://localhost:3001/api/buscarCampeonatoConstructores", { 
                params: { email: emailSession, nombreEquipo: req.body.nombreEquipo }
            })
        } else if (req.body.anioTemporada) {
            response = await axios.get("http://localhost:3001/api/buscarCampeonatoConstructores", { 
                params: { email: emailSession, anioTemporada: req.body.anioTemporada }
            })
        }

        const campeonatos = response.data
        axios.put("http://localhost:3001/api/gestionarTokens", null, {
            params: { email: emailSession, numTokens: 5 }
        })

        res.render("campeonatosConstructores", { campeonatos })
    } catch (error) {
        console.error("Error en buscarCampeonatoConstructores:", error)
        const response = await axios.get("http://localhost:3001/api/campeonatosConstructores")
        res.render("campeonatosPilotos", { campeonatos: response.data })
    }
})

export default router