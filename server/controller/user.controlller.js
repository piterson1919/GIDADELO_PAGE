import { pool } from '../db.js';
import {checkerUser,Userauthentication} from '../tools/checker.js'
import {hashPasword} from "../tools/crypto.js"

export const getUsers = async(req,res) => {
    const [query] = await pool.query("SELECT * FROM users");  
    res.send(query);
}

export const createUser = async(req,res) =>{
    try {
        console.log(req.body)

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


export const loginUser = async(req,res)=>{
    try{

        const {password,id} = req.body;

        const [userFound] = await pool.query("SELECT password FROM users WHERE id = ?",[id])
        if (userFound.length == 0) {
            return res.status(400).json({message:"El usuario no fue encontrado"})
        }
        console.log(userFound[0].password)

        const validation = await Userauthentication(password,userFound[0].password)

        if (!validation.valid) {
            return res.status(401).json({message:validation.message})
        }
        res.status(200).json({message:"holaaa"})
    }catch(error){

        return new Error("ha habido un error: " + error)
    }
}