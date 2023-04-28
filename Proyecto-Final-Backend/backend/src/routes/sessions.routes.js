import { Router } from "express";
import { loginUser, destroySession, getSession, registerUser } from "../controllers/session.controller.js";

const routerSession = Router()

routerSession.post('/login', loginUser)
routerSession.get('/logout', destroySession)
routerSession.get('/current', getSession)
routerSession.post('/register', registerUser)

export default routerSession