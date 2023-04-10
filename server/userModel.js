//const mongoose = require("mongoose");
import mongoose from 'mongoose';
//const { Schema } = mongoose.model;
const UserSchema = mongoose.Schema({
    google: {
        id: {
            type: String,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        image: {
            type: String,
        },
    },
});
const User = mongoose.model("User", UserSchema);
export default User;