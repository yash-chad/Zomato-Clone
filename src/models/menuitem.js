const mongoose = require("mongoose")

const MenuItemSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    itemname : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    jain : {
        type : Boolean,
        required : true
    },
    addons : {
        type : String ,
        default : null
    }
})

const MenuItem = mongoose.model("MenuItem",MenuItemSchema,"menuitem")

module.exports = MenuItem
