const express = require('express')
// const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const passport = require('passport')


//connect to the database
const db = require('./config/keys').mongoURI
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then( () => console.log('MongoDb Connected...') )
.catch(err => console.log(err))


// passport
require('./config/passport')(passport)
require('./config/passport-facebook')(passport)
require('./config/passport-twitter')(passport)

// create an express
const app = express()

// EJS STUFF
// app.use(expressLayouts)
app.set('view engine', 'ejs');

app.use( express.json() )

// Serve static files
app.use('/', express.static('./assets'))
app.use('/users', express.static('./assets'))
app.use('/trivia', express.static('./assets'))

//body parser middleware
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Global Vars
app.use( (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next()
} )



// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/trivia', require('./routes/trivia'))

// create a port
const PORT = process.env.PORT || 4000

// listen for requests
app.listen(PORT, () => console.log(`server Started on port ${PORT}`))