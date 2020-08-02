const User = require('../models/user')
const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()
const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')
const Company = require('../models/company')
const { io } = require('../index')




// Home Page  Displays all the Stock details and navigates to Register/Login
router.get('/', async (req, res) =>{
    const companies = await Company.find()
    res.render('homePage', {companies})
})



// Register / Login
router.get('/welcome', (req, res) =>{
    res.render('welcome')
})


// User Dashboard Displays confidential detils, need authentication
router.get('/dashboard',ensureAuthenticated, async (req, res) => {

    try{
        
        let stocks
        await io.on('connection', (socket) => {

            socket.emit('message', `Welcome ${req.user.name}`)

            socket.broadcast.emit('message', 'A new tab has opened')

            socket.on('sendMessage', (message) => {
                io.emit('message', message)
            })

            // when any connection removed this emits, this and no need to emit from client side
            socket.on('disconnect', () => {
            io.emit('message', 'A tab has closed')
            })


            // data coming from client throgh websocket
            socket.on('userStocksDataFromClient', async (data) => {
                if(data){
                    data.forEach((cur) =>{
                      req.user.stocks = req.user.stocks.concat(cur)
                    })
                } 
                // clearing the duplicates from stocks array
                req.user.stocks = [...new Set(req.user.stocks)]
            

                //save the data to DB
                await req.user.save()

                //data sending back to all the clients
                io.emit('userStocksDataFromServer', req.user.stocks)       
            })

            socket.on('init', () =>{
                socket.emit('initResponse', req.user.stocks)
            })

        })

        const companies = await Company.find()
        res.render('dashboard', {
        user: req.user, companies
        })

    } catch(err) {
        console.log(err)
    }

})


router.get('/register', (req, res) =>{
    res.render('register')
})



router.get('/login', (req, res) =>{
    res.render('login')
})


router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = []

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' })
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' })
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
        errors, name, email, password, password2
        })

     } else {

        try {

            const user = await User.findOne({email})
            if(user) {
                errors.push({ msg: 'Email already exists' })
                res.render('register', {
                errors, name, email, password, password2
              })
            } else {
                const newUser = new User({ name, email, password })
                await newUser.save()
                // token generation
                //const token = await user.generateToken()
                console.log('user created')
                req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login')      
            }

        } catch(err) {
            console.log(err)
        }
    }
});



    
// Login
router.post('/login', (req, res, next) => {
    
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next)
  })
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/')
  })



module.exports = router