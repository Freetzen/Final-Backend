import { Router } from "express";
import { getProducts, getProduct, addProducts, modifyProduct, removeProduct } from "../controllers/product.controller.js";

const routerProduct = Router()

routerProduct.get('/', getProducts)
routerProduct.get('/:pid', getProduct)
routerProduct.post('/', addProducts)
routerProduct.put('/:pid', modifyProduct)
routerProduct.delete('/:pid', removeProduct)

export default routerProduct