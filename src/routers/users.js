const express = require('express')
require('../db/mongoose')
const auth = require('../middleware/auth')
const User = require('../models/users')
const router = new express.Router() 


// creating users 

router.post('/users' , async(req,res) =>{

    const user = new User(req.body)
    try{
    await user.save()
    const token = await user.generateAuthToken()         // binding user defined method to user
    res.status(201).send({user , token})
    }catch(e){
    res.status(400).send(e)
    }

})

router.post('/users/login' , async (req,res)=>{

    try{
        const user = await User.findByCred(req.body.email , req.body.pasword)
        const token = await user.generateAuthToken()         // binding user defined method to user
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
    
})


router.post('/users/logout' , auth ,async (req,res)=>{

    try{
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token != req.token                   // token != current token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
    
})

router.post('/users/logoutAll' , auth ,async (req,res)=>{

    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
    
})

// reading users

router.get("/users/me" , auth , async(req , res)=>{
    res.send(req.user)
})

// reading user of given id

// router.get("/users/:id" , async(req , res)=>{               //localhost/user/something

//     const _id = req.params.id 
//     try{
//         const users = await User.find({_id})
//         if(!users){
//             return res.status(401).send()
//         }
//         res.send(users)
//         }catch(e){
//         res.status(500).send(e)
//         }

// })



// updating users

// router.patch("/users/:id" , async(req,res)=>{

//     const updates = Object.keys(req.body)             // returns array of only keys of req.body object
//     const validUpdates = [ "name" , "email" ,"pasword" , "age"]
//     const isValid = updates.every((update) => validUpdates.includes(update))     // compares two arrays to check whether all keys are same
//     if(!isValid){
//         return res.status(400).send({"error" : "not valid update"})
//     }

//     try{
//         const user = await User.findById(req.params.id)
//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         //const user = await User.findByIdAndUpdate(req.params.id , req.body , { new : true ,  runValidators : true})  // this bypasses mongoose and updates without pre func

//         if(!user){
//             res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }

// })

router.patch("/users/me" , auth, async(req,res)=>{

    const updates = Object.keys(req.body)             // returns array of only keys of req.body object
    const validUpdates = [ "name" , "email" ,"pasword" , "age"]
    const isValid = updates.every((update) => validUpdates.includes(update))     // compares two arrays to check whether all keys are same
    if(!isValid){
        return res.status(400).send({"error" : "not valid update"})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        //const user = await User.findByIdAndUpdate(req.params.id , req.body , { new : true ,  runValidators : true})  // this bypasses mongoose and updates without pre func authentication

        if(!req.user){
            res.status(404).send()
        }

            req.user.tokens = req.user.tokens.filter((token)=> {
                return token.token != req.token                   // token != current token
            })
            await req.user.save()

        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }

})

// deleting

router.delete("/users/me" , auth ,  async(req,res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     res.status(404).send()
        // }
        await req.user.deleteOne()              // remove is not a fxn
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

module.exports = router