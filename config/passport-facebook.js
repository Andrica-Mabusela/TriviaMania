const FacebookStrategy = require('passport-facebook').Strategy

// get the model
const User = require('../models/User')


module.exports = function(passport){

    passport.use( new FacebookStrategy({
        clientID: '765214841047204',
        clientSecret: '2df11f4a5e8ff709ef0f7b817dc0289a',
        callbackURL: 'http://localhost:5000/users/facebook/callback',
        profileFields: ['id', 'displayName', 'email']
    },
        (token, refreshToken, profile,done) => {
            
            User.findOne({'facebookId': profile.id})
            .then(user => {

                if(user){
                    // user exists, log the user in
                    console.log('user exists')
                    console.log(user)
                    return done(null, user) // if user found, return that user
                    
                }else{
                    // user does not exist,create new user and save the user to database
                    var newUser = new User({
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: 'user password'
                    })

                    console.log(newUser)


                    // save our user to the database
                    newUser.save( (err) => {

                        if(err) throw err

                        // if successful, return the new user
                        return done(null, newUser)
                    })


                }

            })
            .catch(error => console.log(error)) 




        }
    ) )



    // serialize and deserialize a user to and from a session

    passport.serializeUser( (user, done) => {
        done(null, user.id)
    } )

    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        } )
    } )

}