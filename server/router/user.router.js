import {Router} from 'express';
import {getUsers,createUser} from '../controller/user.controlller.js'

const router = Router();

router.get('/obteinUsers',getUsers);
router.post('/addUser',createUser);

export default router