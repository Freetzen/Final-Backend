import { Router } from "express";
import { getUsers } from "../controllers/user.controller.js";

const routerUser = Router()

routerUser.get('/', getUsers)

export default routerUser