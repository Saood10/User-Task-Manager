const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const Task = require('./tasks')


const userSchema = mongoose.Schema({                        // used to apply middleware for hashing by bcrypt
    name:{
        type:String,
        required : true,
        trim:true

    },
    email:{
        type:String,
        unique:true,
        required : true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                console.log('invalid email');
            }
        }
    },
    pasword:{
        type:String,
        required : true,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('pasword')){
                console.log('pasword cannot contain pasword');
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                console.log('page must be positive');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.virtual('tasks' , {                    //  tasks is any name that u create to ref in populate fxn
    ref:'Tasks',                                  //  reference of Tasks schema that is created
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){   // res.send calls jsontostringify and this fxn is also called
    const user = this

    const userObj = user.toObject()  // converting user to object to do foll manupulation

    delete userObj.pasword
    delete userObj.tokens

    return userObj

}

userSchema.methods.generateAuthToken = async function () {   // method method is accessible for instances rg user.method

    const user = this
    const token = jwt.sign({ _id : user._id.toString()} , 'saood')
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}

userSchema.statics.findByCred = async (email,pasword) => {  // statics method is accessible for models User.method

    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(pasword , user.pasword)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user

}

//middle wares

userSchema.pre('save' , async function (next) {

    const user = this
    
    if(user.isModified('pasword'))
    {
        user.pasword = await bcrypt.hash(user.pasword , 8)
    }

    next() // this ends the process other wise it keeps on running
})

userSchema.pre('remove' , async function(next){
    const user = this

     Task.deleteMany({owner: user._id })
    next()
})


const User = mongoose.model('User' , userSchema)



module.exports = User