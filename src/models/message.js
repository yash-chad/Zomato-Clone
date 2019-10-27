const mongoose = require("mongoose")

const MessageSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    message : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    owner : {
        type : String,
        required : true
    }
})

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message