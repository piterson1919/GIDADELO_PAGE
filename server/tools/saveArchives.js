//modulo para guardar archivos

import { dir } from 'console';
import multer from 'multer';
import {join,dirname, extname} from 'path';
import { fileURLToPath } from 'url';

//direccion dinamica
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

//extensiones permitidas
const MYETYPES = ['image/png','image/jpeg','image/jpg','image/webp'];


//sistema para guardar el archivo
export const upload = multer({

        storage: multer.diskStorage({
            destination:join(CURRENT_DIR,'../public/uploads'),

            filename:(req,file,cb)=>{
                
                const fileExtension= extname(file.originalname);
                const fileName = file.originalname.split(fileExtension)[0]
                cb(null,`${fileName}-${Date.now()}${fileExtension}`)
            }
        }),

        fileFilter:(req,file,cb)=>{

            if (MYETYPES.includes(file.mimetype)) {
                cb(null,true)
            }
            else{
                cb(new Error("el archivo debe de ser de tipo imagen png, jpeg, jpg, webp"))
            }
        },
        limits:{
        fieldsize:10000000
        }
    }

);


