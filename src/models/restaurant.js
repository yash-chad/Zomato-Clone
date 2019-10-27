const mongoose = require("mongoose")

const RestaurantSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    address : {
        type : String ,
        required : true 
    },
    rating : {
        type : Number ,
        required : false,
        validate(value){
            if(value<0 || value>5){
                throw new Error("Rating needs to be a number between 0 & 5")
            }
        }
    },
    menu :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "MenuItem",
        required : true
    }]
})

const Restaurant = mongoose.model("Restaurant",RestaurantSchema) 

module.exports = Restaurant
