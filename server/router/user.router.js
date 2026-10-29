import {Router} from 'express';
import {getUsers,createUser,loginUser,deleteUser} from '../controller/user.controlller.js'



const router = Router();

router.get('/obteinUsers',getUsers);
router.post('/addUser',createUser);
router.post("/login",loginUser)
router.delete("/userDelete",deleteUser)

export default router