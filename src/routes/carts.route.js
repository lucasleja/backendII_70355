import { Router } from 'express'
import CartManager from '../services/CartManager.js'


const cartManag = new CartManager()

const router = Router()

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManag.addCart()
        res.status(201).send(newCart)
    } catch(err) {
        res.status(400).send({error:err})
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartManag.getCart(cartId)
        if (cart !== undefined) res.send(cart)
        if (cart === undefined) res.status(404).send({ error: 'cart not found' })
    } catch (err) {
        res.status(400).send({error:err})
    }
})

/* router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid
        const prodAdded = await cartManag.addProductToCart(prodId, cartId)
        if (prodAdded !== undefined) res.status(201).send(prodAdded)
        if (prodAdded === undefined) res.status(400).send({error: 'invalid data'})
    } catch(err) {
        res.status(400).send({error:err})
    }
}) */

    router.post('/:cid/product/:pid', async (req, res) => {
        try {
            const cartId = req.params.cid
            const prodId = req.params.pid
            const quantity = req.body.quantity
            const prodAdded = await cartManag.addProductToCart(prodId, cartId, quantity)
            if (prodAdded !== undefined) res.status(201).send(prodAdded)
            if (prodAdded === undefined) res.status(400).send({error: 'invalid data'})
        } catch(err) {
            res.status(400).send({error:err})
        }
    })


router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid
        const prodDeleted = await cartManag.deleteProduct(prodId, cartId)
        if (prodDeleted !== undefined) res.status(201).send(prodDeleted)
        if (prodDeleted === undefined) res.status(400).send({error: 'invalid data'})
    } catch(err) {
        res.status(400).send({error:err})
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const updatedCart = req.body
        const cartId = req.params.cid
        const updated = await cartManag.updateCart(updatedCart, cartId)
        if (updated !== undefined) res.status(201).send(updated)
        if (updated === undefined) res.status(400).send({error: 'invalid data'})
    } catch(err) {
        res.status(400).send({error:err})
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const quantity = req.body.quantity
        const cartId = req.params.cid
        const prodId = req.params.pid
        const updated = await cartManag.updateQuantity(quantity, cartId, prodId)
        if (updated !== undefined) res.status(201).send(updated)
        if (updated === undefined) res.status(400).send({error: 'invalid data'})
    } catch(err) {
        res.status(400).send({error:err})
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const deletedProducts = await cartManag.deleteProducts(cartId)
        if (deletedProducts !== undefined) res.status(201).send(deletedProducts)
        if (deletedProducts === undefined) res.status(400).send({error: 'invalid data'})
    } catch(err) {
        res.status(400).send({error:err})
    }
})

export default router