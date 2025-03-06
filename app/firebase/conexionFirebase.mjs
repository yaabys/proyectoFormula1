import { initializeApp } from "firebase/app"
import bcrypt from "bcrypt"
import { getFirestore, collection,deleteDoc, doc, getDoc, setDoc,updateDoc, addDoc,Timestamp, getCountFromServer,getAggregateFromServer,  getDocs,where, query,orderBy,limit,or,and, count, sum, average, FieldValue} from "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.SENDER_ID,
    appId: process.env.APP_ID
}
  
const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)//coge referencia a la base de datos (coleccion)

export const registrar = async (email,hashedPassword) => {
    const colection = collection(db, "usuarios_f1")
    const docRef = doc(colection,email.toLowerCase())

    const resultadosBusqueda = await getDoc(docRef)

    if (resultadosBusqueda.exists()) {
      console.log("El correo ya existe")
      return false
    }

    const data = {
      email: email,
      password : hashedPassword,
      tokens: 100
    }
    await setDoc(docRef,data) // referencia al documento
    console.log("Usuario registrado correctamente")
    return true

}

export const comprobarLogin = async (email,password) => {
  try {
    const docRef = doc(db, "usuarios_f1", email.toLowerCase())
    const userDoc = await getDoc(docRef)

    if (!userDoc.exists()) {
        return null
    }

    const userData = userDoc.data()
    const hashedPassword = userData.password

    const isMatch = await bcrypt.compare(password, hashedPassword)

    if (!isMatch) {
        return null
    }

    return userData
} catch (error) {
    console.error("Error en comprobarLogin:", error)
    return null
}
}