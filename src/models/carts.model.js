import mongoose from "mongoose";

const collectionName = 'carts'

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number
            }
        ],
        default: []
    }
})

cartsSchema.pre('findOne', function(){
    this.populate('products.product')
})
const cartsModel = mongoose.model(collectionName, cartsSchema)

export default cartsModel