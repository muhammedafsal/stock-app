const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    }, 
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true, 
        trim : true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid email ID')
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value) {
            if(value.length < 7) throw new Error('minimum lenght is 6')
            if(value.includes('password')) throw new Error('Should not contain password') 
        }
    }
})

userSchema.virtual('company', {
    ref : 'Company',
    localField : '_id',
    foreignField : 'owner'  
})


userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    next()
})


const User = mongoose.model('User', userSchema)
module.exports = User;