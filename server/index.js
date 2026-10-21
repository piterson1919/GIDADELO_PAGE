import Express from 'express';
import { PORT } from "./config.js";
import food from "./router/food.router.js";
import user from "./router/user.router.js";

import {join,dirname} from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const app = Express();

app.use(cors());

app.use(Express.static(join(CURRENT_DIR,'./public/uploads')));

app.use(food);
app.use(user);
app.listen(PORT);