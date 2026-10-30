import {Router} from 'express';
import {getUsers,createUser,loginUser,deleteUser,logoutUser} from '../controller/user.controlller.js'



const router = Router();

// router para finalizar la sesion
router.post('/logout',logoutUser)

// router para tener una lista de usuarios
router.get('/obteinUsers',getUsers);

//router para crear un usuario 
router.post('/addUser',createUser);

// router para ingresar
router.post("/login",loginUser)

//router para eliminar un usuario 
router.delete("/userDelete",deleteUser)

export default router