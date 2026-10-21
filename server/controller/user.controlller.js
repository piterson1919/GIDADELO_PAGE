import { pool } from '../db.js';


export const getUsers = async(req,res) => {
    const [query] = await pool.query("SELECT * FROM users");  
    res.send(query);
}

export const createUser = async(res,req) =>{
    const {id,name,last_name,role,password,confirm_pasword} = req.body;
    const query = pool.query("INSERT INTO users(id,name,last_name,role,password) VALUES(?,?,?,?)",[id,name,last_name,role,password])



}
