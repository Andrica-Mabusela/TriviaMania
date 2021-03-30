const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// load user model
const User = require('../models/User')


module.exports = function(passport){

    passport.use(
        new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {

            // Match user
            User.findOne({email: email})
            .then(user => {

                if(!user){
                    return done(null, false, {message: 'Email Address Is Not Registered'})
                }

                // compare text password to hashed password
                bcrypt.compare(password, user.password, (err, isMatch) => {

                    if(err) throw err

                    if(!isMatch){
                        return done(null, false, {message: 'Password Is Incorrect'})
                    }else{
                        return done(null, user)
                    }

                })

            })
            .catch(err => console.log(err) )

        })
    )


    // serialize a user to the session
    passport.serializeUser( (user, done) => {
        done(null, user.id)
    })

    // deserialize a user from a session
    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    } )


}