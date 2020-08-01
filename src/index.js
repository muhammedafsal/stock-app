const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const companyRouter = require('./routers/company')
const loginRouter = require('./routers/loginRout')
const Company = require('./models/company')
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');



const app = express()
const port = process.env.PORT || 3000


// ----- traversy code
// Passport Config
require('./config/passport')(passport);



// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});





// ----- traversy code





//app.set('view engine', 'hbs');
//app.set('views', viewsPath);
//hbs.registerPartials(partialsPath);
app.use(express.static(publicDir));
app.use(express.json())
app.use(userRouter)
app.use(companyRouter)
app.use(loginRouter)





app.get('/weather', (req, res) => {
    if(req.query.location){
        const {location} = req.query;
        geoCode(location, (error, result) => {
            if(error) return res.send(error);

            getWeather(result, (error1, result1) => {
                if(error) return res.send(error1);
                res.send(result1);
            });
        });
    }else res.send({error : 'Please enter a location in query parameter'})
    
})


// app.get('*', (req, res) =>{
//     res.render('notFound', {
//         url : req.baseUrl,
//         message : 'Page not found'
//     })
// })





app.listen(port, () => {
    console.log(`Node server has started on ${port}`)
})








// ------------------------------------------





