import { pool } from '../db.js';
import {checkerUser,Userauthentication} from '../tools/checker.js'
import {hashPasword} from "../tools/crypto.js"
import  jwt  from 'jsonwebtoken';


//obtener todos los usuarios 
export const getUsers = async(req,res) => {
    const [query] = await pool.query("SELECT name,last_name,role,id FROM users");  
    res.send(query);
}


//crea el usuario

export const createUser = async(req,res) =>{

    try {
        

        const validation = checkerUser(req.body)
        
        if (!validation.valid) {
            return res.status(400).json({ 
                message: "Error de validación", 
                messageError: validation.messageError 
            });
        }
        
        const {id,name,last_name,role,password} = req.body;

       const password_hashed = await hashPasword(password)

        
        const [find] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        if(find.length != 0){
            return res.status(400).json({message:" ya hay un usuario con esa cedula en el sistema."});
        }   
        const query = await pool.query("INSERT INTO users(id,name,last_name,role,password) VALUES(?,?,?,?,?)",[id,name,last_name,role,password_hashed]);
        return res.status(201).json({message:"usuario creado correctamente"})

    } catch (error) {
        return res.send({messageError:"a habido un error: " + error})
    }

}

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
            name:userFound[0].name,
            last_name:userFound[0].last_name,
            id:userFound[0].id},

            process.env.SECRET_KEY,
            {expiresIn:"1h"})
          
        return  res.cookie('access_token',token,{
            httpOnly:true, //para que la cookie solo se pueda acceder desde el servidor
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
}

//borrar usuario 
export const deleteUser = async (req, res) => {
    try {
        const {id} = req.body;

        const [existUser] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        if (existUser.length === 0) {
            return res.status(404).json({ message: "el usuario no fue encontrado" });
        }

        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]); 

        return res.status(200).json({ message: "el usuario a sido eliminado correctamente" });

    } catch (error) {
        return res.status(500).json({ error: "Hubo un error al eliminar el alimento: " + error.message });        
    }
};