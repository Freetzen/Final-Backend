import { Router } from "express"
import { __dirname } from "../path.js"
import routerCart from "./carts.routes.js"
import routerProduct from "./products.routes.js"
import routerSession from "./sessions.routes.js"
import routerUser from "./users.routes.js"

const router = Router()

router.use('/api/carts', routerCart)
router.use('/api/products', routerProduct)
router.use('/api/session', routerSession)
router.use('/api/users', routerUser)

export default router