const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId ,
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String ,
        required : true,
        unique: true ,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password : {
        type : String,
        required: true
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User