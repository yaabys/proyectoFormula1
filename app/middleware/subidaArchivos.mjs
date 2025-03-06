import multer from "multer"
import path from "path"
import process from "process"

/*https://medium.com/@diego.coder/subida-de-archivos-con-node-js-express-y-multer-55e99219d754 codigo de aqui*/
const uploadPath = path.join(process.cwd(), "public/imgUsuarios")
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix + ext)
    }
})
export const upload = multer({ storage })
