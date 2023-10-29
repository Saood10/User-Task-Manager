//this is only to connecty to the data base using mongoose

const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api")



// const U1 = new User({
//     name: 'Saood',
//     age:22
// })

// U1.save().then(() =>{
//     console.log(U1);
// }).catch((error)=>{
//     console.log(error);
// })

// const task = mongoose.model('tasks' , {
//     description:{
//         type:String
//     },
//     completed:{
//         type:Boolean
//     }

// })

// const T1 = new task({
//     description:'Learn the mongoose liberary',
//     completed:false
// })

// T1.save().then(()=>{
//     console.log(T1);
// }).catch((error)=>{
//     console.log(error);
// })