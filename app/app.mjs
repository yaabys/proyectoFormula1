//rutas
import rutasRegistrar from "./routers/rutasRegistrar.mjs"
import rutasListar from "./routers/rutasLectura.mjs"
import rutasInsertar from "./routers/rutasInsertar.mjs"
import rutasEliminar from "./routers/rutasEliminar.mjs"
import rutasModificar from "./routers/rutasModificar.mjs"

import express from "express"
import path from "path"
import { comprobarSesion } from "./routers/rutasRegistrar.mjs"
import axios from "axios"

const app = express()
const puerto = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(path.resolve("."), "public")))
app.use(rutasRegistrar)
app.use(rutasListar)
app.use(rutasInsertar)
app.use(rutasEliminar)
app.use(rutasModificar)

//configuracion EJS
app.set("view engine", "ejs")
app.set("views", path.join(path.resolve("."), "views/completes"))

app.listen(puerto, () =>{
    console.log("Servidor corriendo en el puerto", puerto)
})