//creacion del servidor

import Express from 'express';
import { PORT } from "./config.js";
import food from "./router/food.router.js";
import user from "./router/user.router.js";
import cookieParser from 'cookie-parser';
import  jwt  from 'jsonwebtoken';
import {join,dirname} from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const app = Express();




//midlewares para cookies, json y validacion de cookies
app.use(cors());
app.use(Express.json())
app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.cookies.access_token; 

    req.session = { user: null };
    try {
        if (token) {
            const data = jwt.verify(token, process.env.SECRET_KEY);

            req.session.user = data;
        }
    } catch (error) {
        console.log(" Error al verificar el token:", error.message);
    }
    
    next(); 
});

//modulos dondeprovienen los routers y midleware para servir los archivos 
app.use(Express.static(join(CURRENT_DIR,'./public/uploads')));

app.use(food);
app.use(user);

app.listen(PORT);