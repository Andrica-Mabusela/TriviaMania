const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../models/User')

module.exports = function(passport){

    passport.use(
        new TwitterStrategy({
            consumerKey: 'cuF4OGSkAdukTja9drAjQwd1t',
            consumerSecret: 'fNgLiQoziiigGHYaTXxSrNSzNdTA3ORxxPQkfDqlr9yQyCPLrQ',
            callbackURL: 'http://127.0.0.1:5000/users/twitter/callback',
            includeEmail: true

        }, (token, tokenSecret, profile, oob) => {
            console.log(profile)

        } )
    )


    //serialize user
    passport.serializeUser( (user, done) => {
        done(null, user.id)
    } )

    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    } )


}