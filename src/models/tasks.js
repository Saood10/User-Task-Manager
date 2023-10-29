const mongoose = require('mongoose')
const User = require('./users')




const tasksSchema = mongoose.Schema({

    description:{
        type:String,
        required:true,
        trim:true
    },

    completed:{
        type:Boolean,
        default:false,
        trim:true
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User            // creating reference of tasks with user so that we can use populated on task
    }

})

const Tasks = mongoose.model('Tasks' , tasksSchema)

module.exports = Tasks