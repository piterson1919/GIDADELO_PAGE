import {Router} from 'express';
import {getUsers,createUser,loginUser} from '../controller/user.controlller.js'



const router = Router();

router.get('/obteinUsers',getUsers);
router.post('/addUser',createUser);
router.post("/login",loginUser)

export default router