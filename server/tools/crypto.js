import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config.js';
import { hash } from 'zod';

const hashPasword = async(password)=>{
    const passwordHashed = bcrypt.hash
}