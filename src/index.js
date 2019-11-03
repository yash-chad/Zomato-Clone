const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const http=require("http")  //Core HTTP module 
const path = require("path")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const menuitemRoutes = require("./routers/menuitem")
const restaurantRoutes = require("./routers/restaurant")
const userRoutes = require("./routers/user")
const Message = require("./models/message")

mongoose.connect("mongodb://127.0.0.1:27017/zomato-clone",{
    useNewUrlParser: true ,
    useCreateIndex : true ,
    useUnifiedTopology: true 
})



app.use(morgan("dev"))
app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))
app.subscribe(bodyParser.json())
app.use(express.static(path.join(__dirname,"../public")))

//To prevent CORS Errors
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers","Origin , X-Requested-With ,Content-Type ,Accept ,Authorization")
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods" , "PUT,POST,PATCH,DELETE,GET")
        return res.status(200).json({})
    }
    next()
})

app.use("/",menuitemRoutes)
app.use("/",restaurantRoutes)
app.use("/",userRoutes)



//Realtime Chat
io.on("connection",async(socket)=>{

    var owner_id
    var owner_name
    console.log("New socket connection")

    socket.on("join", ({name , _id})=>{

        owner_name = name
        owner_id = _id
        socket.join(owner_id)

        console.log(owner_id)
        console.log(owner_name)

         //Get all messages in db
        Message.find({owner : owner_id })
        .limit(10)
        .then((result)=>{
            socket.emit('output', result)
        })  
        .catch((e)=>{
            console.log(e)
        })

    })

    //Function to send status
    const sendStatus = (s) =>{
        socket.to(owner_id).emit('status', s)
    }
    

    
    //Handling inputs
    socket.on("input",(data)=>{

        const name = owner_name
        const message = data.message

         // Check for name and message
        if( message == '')
        {
            sendStatus('Please enter a message');
        } 
        else {
            // Insert message
            const mymessage = new Message({
                _id : mongoose.Types.ObjectId(),
                message : data.message,
                name : owner_name,
                owner : owner_id

            })

            mymessage.save()
            .then(()=>{
                io.emit("output",[data])
                sendStatus({
                    message: 'Message sent',
                    clear: true
                })
            })
        }

    })
})




app.use("*",(req,res,next)=>{
    const error = new Error("Not found")
    error.status = 404
    next(error)
})

//For handling errors when we add db 
app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
        error : {
            message : error.message
        }
    }) 
})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    console.log("Server is up on port ",PORT)
})