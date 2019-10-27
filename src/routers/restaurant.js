const express = require("express")
const router = new express.Router()
const mongoose = require("mongoose")
const Restaurant = require("../models/restaurant")
const MenuItem = require("../models/menuitem")
const auth = require("../middleware/auth")

//Creating a restaurant
router.post("/restaurant",auth,async (req,res)=>{

    const restaurant = new Restaurant({
        _id : mongoose.Types.ObjectId(),
        name : req.body.name,
        address : req.body.address,
        rating : req.body.rating,
        menu :  req.body.menuId
    })

    await restaurant.save()
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((e)=>{
        res.status(400).json({ error : e})
    })

})

//Get all the Restaurants
router.get("/restaurant",async (req , res)=>{

    await Restaurant.find()
    .populate("menu","itemname")
    .exec()
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((e)=>{
        res.status(404)
        .json({
            error : e
        })
    })

})


//Get specific Restaurant
router.get("/restaurant/:id",async (req,res)=>{

    await Restaurant.findById(req.params.id)
    .populate("menu","itemname price")
    .exec()
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((e)=>{
        res.status(404)
        .json({
            error : e
        })
    })

})


//Delete Restaurant
router.delete("/restaurant/:id", auth ,async (req,res)=>{

    await Restaurant.findByIdAndDelete(req.params.id)
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((e)=>{
        res.status(404).json({
            error : e
        })
    })

})


//Update Restaurant
router.patch("/restaurant/:id", auth ,async (req,res)=>{

    const updates = {}
    if(req.body.name){
        updates.name = req.body.name
    }
    if(req.body.address){
        updates.address = req.body.address
    }
    if(req.body.rating){
        updates.rating = req.body.rating
    }
    if(req.body.menu){
        updates.menu = req.body.menu
    }

    await Restaurant.findByIdAndUpdate(req.params.id ,{$set : updates})
    .then((result)=>{
        res.status(201).json(result)
    }).catch((e)=>{
        res.status(500).json({
            error : e
        })
    })

})

module.exports = router