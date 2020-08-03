const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path')
require('./db/mongoose')
const companyRouter = require('./routers/RESTApiRouters/company')

const Company = require('./models/company')
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// exporting socketio
exports.io = io

// importing web page view routers
const viewRouter = require('./routers/viewRouter')


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

app.use(express.static(publicDir));
app.use(express.json())
app.use(companyRouter)
app.use(viewRouter)



const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Node server has started on ${port}`)
})



