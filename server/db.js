import "dotenv/config"
import {createPool} from 'mysql2/promise'


export const pool = createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSORD,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
})

