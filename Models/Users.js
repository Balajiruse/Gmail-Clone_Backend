import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    token: {
        type: String,
    } 
})

const User = new mongoose.model("Users", UserSchema);
export {User}