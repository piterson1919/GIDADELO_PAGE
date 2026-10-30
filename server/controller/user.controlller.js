// coneccion con la base de datos

import { pool } from '../db.js';

//modulo para autenticar usuarios y validarlos
import { checkerUser, Userauthentication } from '../tools/checker.js';

//modulo para encriptaciones 
import { hashPasword } from "../tools/crypto.js";

//json web token para la seguridad de la pagina 
import jwt from 'jsonwebtoken';


// sistema de logueo del usuario 
export const loginUser = async (req, res) => {
    try {
        const { password, id } = req.body;

        const [userFound] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        
        if (userFound.length === 0) {
            return res.status(400).json({ message: "El usuario no fue encontrado" });
        }

        const validation = await Userauthentication(password, userFound[0].password);

        if (!validation.valid) {
            return res.status(401).json({ message: validation.message });
        }

        const token = jwt.sign({
            name: userFound[0].name,
            last_name: userFound[0].last_name,
            id: userFound[0].id,
            role: userFound[0].role
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" });
         
        return res.cookie('access_token', token, {
            httpOnly: true, 
            maxAge: 1000 * 60 * 60
        })
        .status(200)
        .json({ 
            message: validation.message
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ messageError: "Ha habido un error: " + error.message });
    }
};

// obtener todos los usuarios 
export const getUsers = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(403).json({ message: "Acceso denegado." });
    }

    const [query] = await pool.query("SELECT name, last_name, role, id FROM users");  
    res.status(200).json({ users: query, user });
};

// crea el usuario
export const createUser = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(403).json({ message: "Acceso denegado." });
        }

        const validation = checkerUser(req.body);
        
        if (!validation.valid) {
            return res.status(400).json({ 
                message: "Error de validación", 
                messageError: validation.messageError 
            });
        }
        
        const { id, name, last_name, role, password } = req.body;

        const password_hashed = await hashPasword(password);

        const [find] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        if (find.length != 0) {
            return res.status(400).json({ message: " ya hay un usuario con esa cedula en el sistema." });
        }   

        const query = await pool.query("INSERT INTO users(id, name, last_name, role, password) VALUES(?, ?, ?, ?, ?)", [id, name, last_name, role, password_hashed]);

        return res.status(201).json({ message: "usuario creado correctamente", data: user });

    } catch (error) {
        return res.send({ messageError: "ha habido un error: " + error });
    }
};

// borrar usuario 
export const deleteUser = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(403).json({ message: "Acceso denegado." });
        }

        const { id } = req.body;

        const [existUser] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        if (existUser.length === 0) {
            return res.status(404).json({ message: "el usuario no fue encontrado" });
        }

        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]); 

        return res.status(200).json({ message: "el usuario ha sido eliminado correctamente" });

    } catch (error) {
        return res.status(500).json({ error: "Hubo un error al eliminar el usuario: " + error.message });        
    }
};


//sistema para finalizar la sesion
export const logoutUser = (req,res) =>{

    res.status(200).clearCookie('access_token').json({message:"sesion finalizada."})
}