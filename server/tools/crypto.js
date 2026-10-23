import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config.js';


const hashPasword = async(password)=>{
    const passwordHashed = bcrypt.hash(password,SALT_ROUNDS)
    return passwordHashed
}