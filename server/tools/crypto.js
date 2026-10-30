import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config.js';

//sistema para encriptar la password de un usuario
export const hashPasword = async(password)=>{
    const passwordHashed = await bcrypt.hash(password,SALT_ROUNDS)
    return passwordHashed
}