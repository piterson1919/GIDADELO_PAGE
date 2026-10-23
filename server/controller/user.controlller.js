import { pool } from '../db.js';
import {checkerUser} from '../tools/checker.js'


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

        const [find] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        if(find.length != 0){
            return res.status(400).json({message:" ya hay un usuario con esa cedula en el sistema."});
        }   
        const query = await pool.query("INSERT INTO users(id,name,last_name,role,password) VALUES(?,?,?,?,?)",[id,name,last_name,role,password]);
        return res.status(201).json({message:"usuario creado correctamente"})

    } catch (error) {
        return res.send({messageError:"a habido un error: " + error})
    }

}
