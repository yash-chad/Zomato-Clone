const express = require("express")
const router = new express.Router()
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

const User = require("../models/user")

//Creating a User
router.post("/user/signup",async (req,res,next)=>{

    User.find({email : req.body.email})
    .then((user)=>{

        if(user.length!=0){
            return res.status(409).send({
                message : "User aldready exists . Please try logging in!"
            })
        }
        else{

            bcrypt.hash(req.body.password,10)
            .then((hash) =>{
              
                const user = new User({
                    _id : new mongoose.Types.ObjectId(),
                    name : req.body.name,
                    email : req.body.email,
                    password : hash
                })
                console.log(user)
                user.save()
                .then((result)=>{
                    return res.status(201).json({
                        message : "New User Created"
                    })
                })
                .catch((e)=>{
                    return res.status(500).json({
                        error : e
                    })
                })
        
            })


        }
       
    })
    .catch((e)=>{
        return res.status(500).json({
            error : "Unable to create new User"
        })
    })

})



//Login
router.post("/user/login",(req,res)=>{

    User.find({ email: req.body.email })
    .then((user)=>{
        if(user.length==0)
        {
            return res.status(404).send({ error : "Auth failed" })
        }
        else{
            bcrypt.compare(req.body.password , user[0].password)
            .then((result)=>{
                if(result){
                    const token = jwt.sign({
                        email : user[0].email,
                        userId : user[0]._id
                    },
                    "MySecret",
                    {
                        expiresIn : "1h"
                    })
                    res.status(200).send({
                        message : "Access Granted" , 
                        token : token,
                        link : `http://localhost:3000?_id=${user[0]._id}&name=${user[0].name}`
                    })
                }

            })
            .catch((e)=>{
                console.log(e)
                res.status(500).send({ error : "Auth failed" })
            })
        }
    })
})

//Deleting a user
router.delete("/user/:id",auth,async(req,res)=>{

    await User.deleteOne({_id : req.params.id})
    .then((result)=>{
        res.status(200).json({message : "Account Deleted!"})
    })
    .catch((e)=>{
        res.status(404).send({
            error : e
        })
    })

})


// //Get Help from customer support
// router.get("/user/:id",auth,async(req,res)=>{

//     res.send({

//     })

// })
module.exports = router