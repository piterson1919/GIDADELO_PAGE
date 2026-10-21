import {Router} from 'express';
import {getUsers} from '../controller/user.controlller.js'

const router = Router();

router.get('/obteinUsers',getUsers);


export default router