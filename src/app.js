import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import cartsRoutes from './routes/carts.route.js'
import productsRoutes from './routes/products.router.js'
import __dirname from './utils.js';
import viewsRouter from './routes/views.routes.js'
import ProductManager from './services/ProductManager.js'
import mongoose from 'mongoose';
import CartManager from './services/CartManager.js';
import sessionsRouter from './routes/sessions.routes.js'
import session from 'express-session';
import { initializedPassport } from "../src/config/passport.config.js"


import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    session({
      secret: "ClaveSecreta", // palabra secreta
      resave: true, // Mantiene la session activa, si esta en false la session se cierra
      saveUninitialized: true  // Guarda la session
    })
  )

  initializedPassport();
  app.use(cookieParser());


// Configurar Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"))

/* app.use(cookieParser()) */

const PORT = 8080;

app.use('/api/carts', cartsRoutes)
app.use('/api/products', productsRoutes)

app.use('/api/sessions', sessionsRouter)

app.use('/api/session', sessionsRouter)

app.use('/', viewsRouter)

const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})


const io = new Server(httpServer)

// Coneccion a la DB
const PathDB = 'mongodb+srv://lejarragalucas:808MJQbvJmz5ZhYF@cluster0.27oim.mongodb.net/backend_70290?retryWrites=true&w=majority&appName=Cluster0'
const connectMongoDB = async () => {
    try {
        await mongoose.connect(PathDB)
        console.log("Conectado a la base de datos MongoDB");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
}
connectMongoDB()



const prodManag = new ProductManager()
const cartManag = new CartManager()

io.on('connection', async (socket)=>{
    const products = await prodManag.getProducts()
    socket.emit('productsList', products)

    socket.on('deleting-product', async(id)=>{
        await prodManag.deleteProduct(id)
        const products = await prodManag.getProducts()
        socket.emit('productsList', products)
    })

    socket.on('new-product', async(product)=>{
        await prodManag.setProduct(product)
        const products = await prodManag.getProducts()
        socket.emit('productsList', products)
    })
    
    socket.on('add-to-cart', async(obj)=>{
        await cartManag.addProductToCart(obj.prodId, obj.newCart._id)
    })
    
    socket.on('createCart', async(msg)=>{
        const cart = await cartManag.addCart()
        socket.emit('cart', cart)
    })

})






/* io.on('connection', async (socket) => {
    const products = await ProductManager.getProducts();
    socket.emit('productsList', products);

    socket.on('deleting-product', id => {
        ProductManager.deleteProduct(id);
    });

    socket.on('new-product', async (newProduct) => {
        try {
            const addedProduct = await ProductManager.addProduct(newProduct);
            socket.emit('new-product-added', addedProduct);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            socket.emit('error-agregar-producto', error.message);
        }
    });
 */
    // Eventos para carritos
/*     socket.on('get-carts', async () => {
        const carts = await CartManager.getAllCarts();
        socket.emit('cartsList', carts);
    });

    socket.on('add-product-to-cart', async ({ cid, pid, quantity }) => {
        try {
            const updatedCart = await CartManager.addProductToCart(cid, pid, quantity);
            socket.emit('cart-updated', updatedCart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            socket.emit('error-agregar-al-carrito', error.message);
        }
    });

    socket.on('delete-product-from-cart', async ({ cid, pid }) => {
        try {
            const updatedCart = await CartManager.deleteProductFromCart(cid, pid);
            socket.emit('cart-updated', updatedCart);
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            socket.emit('error-eliminar-del-carrito', error.message);
        }
    });
}); */



