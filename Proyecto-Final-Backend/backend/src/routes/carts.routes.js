import { Router } from "express";
import { getCart, addProduct, changeProductQuantity, clearCart, removeProduct, overwriteCart, createNewCart } from "../controllers/cart.controller.js";

const routerCart = Router()

routerCart.get('/:cid', getCart)
routerCart.post('/', createNewCart)
routerCart.post('/:cid/product/:pid', addProduct)
routerCart.put('/:cid', overwriteCart)
routerCart.put('/:cid/product/:pid', changeProductQuantity)
routerCart.delete('/:cid/product/:pid', removeProduct)
routerCart.delete('/:cid', clearCart)

export default routerCart