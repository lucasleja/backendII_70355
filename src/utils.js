import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

/* import { fileURLToPath } from 'url';
import { dirname } from 'path'; */

/**
*
* fileURLToPath: Esta función garantiza la decodificación correcta de los caracteres codificados en porcentaje, así como una cadena de ruta absoluta válida multiplataforma.
*
*/

/**
*
* dirname: Devuelve el nombre de directorio de una ruta. Similar al comando dirname de Unix.
*
*/



/* const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname;
 */




const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img`)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploader = multer({
    storage,
    onError: function (err) {
        console.log(`Error: ${err}`)
    }
})