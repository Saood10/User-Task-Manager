const express = require('express')
require('../db/mongoose')
const Task = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks' , auth , async (req,res)=>{

    const task = new Task({
        ...req.body,              // E6 for copying all body provided by req
        owner: req.user._id

    }) 

    try{
        await task.save()
        res.status(201).send(task)

    }catch(e){
        res.status(400).send()
    }

})

router.get('/tasks/:id' , auth , async (req,res)=>{

    const _id = req.params.id
    try{
    const task = await Task.findOne({_id , owner: req.user._id})             // find task that has id provided and auth owner
 
    if(!task){
        return res.status(404).send()
    }
    res.send(task)

    }catch(e){
        res.status(500).send()
    }

})

router.get('/tasks' , auth , async (req,res) =>{

    try{
    await req.user.populate(['tasks']);
    res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()

}
})

router.patch('/tasks/:id' , auth , async(req,res) =>{

    const updates = Object.keys(req.body)
    const validUpdates = ['description' , 'completed']
    const isValid = updates.every((update)=> validUpdates.includes(update))

    if(!isValid){
        res.status(400).send("Error : Invalid Updates")
    }

    try {
        const task = await Task.findOne( {_id : req.params.id , owner: req.user._id} )

        if(!task){
            res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update] )

        await task.save()
        res.send(task)
        
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id' , auth , async(req,res)=>{

    try {
        const task = await Task.findByIdAndDelete({ _id : req.params.id , owner: req.user._id})

        if(!task){
            res.status(404).send()
        }

        res.send(task)
        
    } catch (e) {
        res.status(500).send()
    }
    
})

module.exports = router