import express from "express"
import { registrar,comprobarLogin } from "../firebase/conexionFirebase.mjs"
import { conn } from "../../service/sql/conexionSQL.mjs"
import { createHash } from 'node:crypto' //con esto encriptamos la contraseña
import path from "path"
import session from "express-session"
import axios from "axios"
import bcrypt from "bcrypt"

const router = express.Router() 

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.use(session({
	secret: "clave_secreta",
	resave: false, // no guardar la cookie de nuevo si no hay cambio
	saveUninitialized: true, // guardarla sin inicializar
	cookie: {maxAge: 1000 * 60 * 60 * 2} // 2 horas
}))

//metodo comprobar sesion
export const comprobarSesion = (req) => {
    const result = req.session.usuario

    if(result){
        return true
    }
    return false
}

router.get("/register", (req, res) => {
    if (!req.session.usuario) {
        const htmlRegistro = path.join(path.resolve("../app/views/completes/"), "paginaRegistro.ejs")
        res.render(htmlRegistro)
    } else {
        const htmlPrincipal = path.join(path.resolve("../app/views/completes/"), "paginaPrincipal.ejs")
        res.render(htmlPrincipal)
    }
})

router.post("/register", async (req, res) => {
    const { email, password, nombreCompleto, userName, passwordConfirmar } = req.body

    if (!email || !password || !nombreCompleto || !userName || passwordConfirmar !== password) {
        console.log("Falta info")
        return res.status(400).send("Falta información o las contraseñas no coinciden.")
    } else {
        try {
            
            const saltRounds = 10
            const hashPassword = await bcrypt.hash(password, saltRounds)

            const result = await registrar(email, hashPassword)

            if (!result) {
                return res.status(400).send("El correo ya está registrado.")
            }
            
            const usuarios = `INSERT INTO usuarios (nombreCompleto, userName, email, passwordUsuario, rutaFoto) VALUES (?, ?, ?, ?,?)`
            await conn.execute(usuarios, [nombreCompleto, userName, email, hashPassword, "default.png"])

            req.session.usuario = { email: email, tokens: 100 }

            res.redirect("/")
        } catch (error) {
            res.redirect("/register")
        }
    }
})

router.get("/login", async (req, res) => {
    if (!req.session.usuario) {
        const htmlLogin = path.join(path.resolve("../app/views/completes/"), "index.ejs")
        res.render(htmlLogin)
    } else {
        const htmlPrincipal = path.join(path.resolve("../app/views/completes/"), "paginaPrincipal.ejs")
        res.render(htmlPrincipal)
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        res.sendStatus(500)
    } else {
        const user = await comprobarLogin(email,password)
        if (user) {
            const response = await axios.get("http://localhost:3001/api/devolverTokens", {
                params:{email: email}
            })

            const tokens = response.data.tokens
        
            req.session.usuario = { email: email, tokens: tokens }
            res.redirect("/")
        } else {
            res.sendStatus(500)
        }
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

export default router
