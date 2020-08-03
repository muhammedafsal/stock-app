const User = require('../../models/user')
const auth = require('../../middleware/auth')
const express = require('express')
const router = new express.Router()



// create user
// created token for authentication 
router.post('/users', async (req, res) =>{
    //user creation
    const user = new User(req.body)
    try{
        await user.save()
        // token generation
        const token = await user.generateToken()
        console.log('user created')
        res.status(201).send({user, token})
    } catch(e){
        res.status(400).send(e)
    }
})


// login user
// created token for authentication 
router.post('/users/login', async (req, res) =>{
    try {
        // login 
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user) res.status(400).send('login failed')
        // token generation
        const token = await user.generateToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})


// logout from current session , deleting current tokens from DB
// middleware used for authentication
router.post('/users/logout', auth, async(req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send('User loged out')
    } catch(e) {
        res.status(500).send(e)
    }

})


// logout from all the devices , deleting all the  associated tokens from DB
// middleware used for authentication
router.post('/users/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('User has loged out from all the accounts')
    } catch(e) {
        res.status(500).send(e)
    }
    
})


// read authenticated user
// middleware used for authentication
router.get('/users/me',auth, async (req, res) =>{
    res.send(req.user)
})





// update authenticated user
// middleware used for authentication
router.patch('/users/me', auth, async (req, res) => {   
    const updates = Object.keys(req.body)
    try{
        const user = req.user
        updates.forEach(cur => user[cur] = req.body[cur] )
        await user.save() 
        res.send(user)
    } catch(err) {
        res.status(500).send(err)
    }

})


// delete authenticated user
// middleware used for authentication
router.delete('/users/me', auth, async (req, res) =>{
    try{
        const user = req.user
        await user.remove()
        res.send(user)
    } catch(err) {
        res.status(500).send(err)
    }
})




module.exports = router