const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req,res,next)=>{  // next is used to redirect it to the router otherwise it will wait in this fxn

    try{
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decoded = jwt.verify(token , 'saood')
        const user = await User.findOne({ _id : decoded._id , 'tokens.token' : token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    }catch(e){
        res.status(401).send('Please Authenticate')
    }


}

module.exports = auth