import mongoose from "mongoose"

/* const collectionName = 'users' */

const userCollection = "users";

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: String
    },
    roles: {
        type: [String],
        default: ['user']
    }
})

/* export default mongoose.model(collectionName, usersSchema) */

export const userModel = mongoose.model(userCollection, usersSchema);