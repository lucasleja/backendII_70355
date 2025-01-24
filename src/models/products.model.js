import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const collectionName = 'products'

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    status: Boolean,
    thumbnails: {
        type: [],
        default: []
    }
})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(collectionName, productsSchema)

export default productsModel