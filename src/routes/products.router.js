import { Router } from 'express'
import { uploader } from '../utils.js'
import ProductManager from '../services/ProductManager.js'

const router = Router()

const prodManager = new ProductManager()

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const page = parseInt(req.query.page)
        const category = req.query.category
        const sort = parseInt(req.query.sort)
        const products = await prodManager.getProducts(limit, page, category, sort)
        res.send(products)
    } catch (err) {
        res.status(400).send({error:err})
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const prodId = req.params.pid
        const product = await prodManager.getProduct(prodId)
        if (product !== undefined) res.send(product)
        if (product === undefined) res.status(404).send({error: 'product not found' })
    } catch (err) {
        res.status(400).send({error:err})
    }
})

router.post('/', uploader.single('img'), async (req, res) => {
    try {
        let { title, description, code, price, stock, category } = req.body
        const img = req.file
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({error: 'incomplete data' })
        } else {
            price = parseInt(price)
            stock = parseInt(stock)
            const prodAdded = await prodManager.setProduct({ title, description, code, price, stock, category }, img)
            res.status(201).send(prodAdded)
        }
    } catch (err) {
        res.status(400).send({error:err})
    }
})

router.put('/:pid', uploader.single('img'), async (req, res) => {
    try {
        const productId = req.params.pid
        const img = req.file
        let modifiedProduct = req.body
        const newProduct = await prodManager.editProduct(productId, modifiedProduct, img)
        if (newProduct !== undefined) res.status(201).send(newProduct)
        if (newProduct === undefined) res.status(404).send({error: 'product not found' })
    } catch(err) {
        res.status(400).send({error:err})
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const prodId = req.params.pid
        const deletedProd = await prodManager.deleteProduct(prodId)
        if (deletedProd !== undefined) res.send(deletedProd)
        if (deletedProd === undefined) res.status(404).send({error: 'product not found' })
    } catch(err) {
        res.status(400).send({error:err})
    }
})

export default router