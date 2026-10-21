import {Router} from 'express';
import { getFoods,createFood,getFood,deleteFood,editFood } from '../controller/food.controller.js';
import { upload } from '../tools/saveArchives.js';

const router = Router();


// trae todas las comidas (desayunos y almuerzos)
router.get("/getFoods",getFoods);

// trae una sola comida ya sea desayuno o almuerzo
router.get("/getFood/:id",getFood);

// guarda las comidas (desayunos y almuerzos)
router.post("/postFood",upload.single('file'),createFood)


// editar comidas
router.put("/putFood/:id",upload.single("file"),editFood)

router.delete("/deletefood/:id",deleteFood);


export default router;