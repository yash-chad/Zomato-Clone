const express = require("express")
const router = new express.Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const MenuItem =require("../models/menuitem")

//Creating a menuitem
router.post("/menuitem",auth,async (req,res)=>{
    
    const item = new MenuItem({
        _id : new mongoose.Types.ObjectId(),
        itemname : req.body.itemname ,
        price : req.body.price,
        jain : req.body.jain,
        addons: req.body.addons
    })

    await item.save().then((result)=>{
        res.status(201).json(result)
    }).catch((e)=>{
        res.status(500).json({
            error : e
        })
    })

})


//Get Menuitems
router.get("/menuitem",async (req,res)=>{

    await MenuItem.find()
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((e)=>{
        res.status(404).json({
            error : e
        })
    })

})

//Get specific Menuitem
router.get("/menuitem/:_id",async (req,res)=>{

    await MenuItem.findById(req.params._id)
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((e)=>{
        res.status(404).json({
            error : e
        })
    })

})

//Update MenuItem
router.patch("/menuitem/:id",auth,async (req,res)=>{

    const updates = {}
    if(req.body.itemname){
        updates.itemname = req.body.itemname
    }
    if(req.body.addons){
        updates.addons = req.body.addons
    }
    if(req.body.price){
        updates.price = req.body.price
    }
    if(req.body.jain){
        updates.jain = req.body.jain
    }

    await MenuItem.findByIdAndUpdate(req.params.id ,{$set : updates})
    .then((result)=>{
        res.status(201).json(result)
    }).catch((e)=>{
        res.status(500).json({
            error : e
        })
    })
    
})

//Delete Menuitem
router.delete("/menuitem/:id", auth ,async (req,res)=>{

    await MenuItem.deleteOne({_id : req.params.id})
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((e)=>{
        res.status(404).send({
            error : e
        })
    })

})

module.exports = router