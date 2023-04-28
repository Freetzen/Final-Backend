import { findCartById, updateCart, createCart } from "../services/cartServices.js"
import { findProductById } from "../services/productService.js"
import productModel from "../models/MongoDB/productModel.js"

export const getCart = async (req, res) => {
    if (req.session.login) {
        try {
            const cartID = req.session.user.cartID
            const cart = await findCartById(cartID)
            if (!cart) {
                throw new Error("Cart not found")
            }
            const popCart = await cart.populate({ path: 'products.productId', model: productModel })

            res.status(200).send({ popCart })

        } catch (error) {
            res.status(500).send({
                error: error.message
            })
        }
    } else {
        return res.status(401).send("No active session")
    }
}

export const createNewCart = async (req, res) => {
    try {
        const newCart = {}
        const data = await createCart(newCart)

        res.send({
            status: "success",
            payload: data
        })
        console.log(data)
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
        console.log(error)
    }
}

export const addProduct = async (req, res) => {
    if (req.session.login) {
        try {
            const cartID = req.session.user.cartID
            const productID = req.params.pid

            const foundProduct = await findProductById(productID)
            if (foundProduct) {
                const cart = await findCartById(cartID)
                const productIndex = cart.products.findIndex(prod => prod.productId.equals(productID))

                productIndex === -1 ? cart.products.push({ productId: productID }) : cart.products[productIndex].quantity++

                await cart.save()
                return res.status(200).send(`Product added to cart`)
            } else {
                return res.status(200).send(`Can't add product (reason: not found)`)
            }
        } catch (error) {
            res.status(500).send({
                error: error.message
            })
        }
    } else {
        return res.status(401).send("No active session")
    }

}

export const overwriteCart = async (req, res) => {
    if (req.session.login) {
        try {
            const cartID = req.session.user.cartID
            const productsToAdd = req.body

            const response = await updateCart(cartID, productsToAdd)

            res.status(200).send({
                payload: response
            })
        } catch (error) {
            res.status(500).send({
                error: error.message
            })
        }
    } else {
        return res.status(401).send("No active session")
    }

}

export const changeProductQuantity = async (req, res) => {
    if (req.session.login) {
        try {
            const { quantity } = req.body
            const newQuantity = parseInt(quantity)

            const updatedProduct = await cartManager.changeQuantity(req.params.cid, req.params.pid, newQuantity)

            res.send({
                status: "success",
                payload: updatedProduct
            })

        } catch (error) {
            res.send({
                status: "error",
                payload: error.message
            })
        }
    } else {
        return res.status(401).send("No active session")
    }
}

export const removeProduct = async (req, res) => {
    try {
        const cart = await cartManager.removeProduct(req.params.cid, req.params.pid)

        res.send({
            status: "success",
            payload: cart
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })

    }
}

export const clearCart = async (req, res) => {
    try {
        const cart = await cartManager.emptyCart(req.params.cid)
        res.send({
            status: "success",
            payload: cart
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
    }
}