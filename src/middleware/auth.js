const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, "thisismytoken")
        const user = await User.findOne({_id : decode.id, 'tokens.token' : token})
        if(!user) throw new Error('invalid user')   
        
        req.token = token
        req.user = user
        next()
    } catch(err) {
        res.status(401).send({error : err})
    }
}

module.exports = auth