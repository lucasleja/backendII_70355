import express from 'express'
import ProductManager from '../services/ProductManager.js'
import CartManager from '../services/CartManager.js'

const router = express.Router()
const prodManag = new ProductManager()
const cartManag = new CartManager()

router.get('/', async(req, res)=>{
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const category = req.query.category
    const sort = parseInt(req.query.sort)
    const products = await prodManag.getProducts(limit, page, category, sort)
    const linkPrevPage = products.hasPrevPage ? `http://localhost:8080/?page=${products.prevPage}&limit=${limit}` : ""
    const linkNextPage = products.hasNextPage ? `http://localhost:8080/?page=${products.nextPage}&limit=${limit}` : ""
    products.linkPrevPage = linkPrevPage
    products.linkNextPage = linkNextPage
    res.render('home', {products})
})

router.get('/carts/:cid', async(req, res)=>{
    const cartId = req.params.cid
    const cart = await cartManag.getCart(cartId)
    const products = cart.products
    const noEmpty = products.length > 0
    res.render('cart', {products, noEmpty})
})

router.get('/realtimeproducts', (req, res)=> {
    res.render('realTimeProducts')
})

export default router