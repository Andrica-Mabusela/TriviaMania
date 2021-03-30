const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Load user modul
const User = require('../models/User');

const JWT_SECRET = 'this is a very big secret.';


router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})


// register post request handle
router.post('/register', (req, res) => {

    const { name, email, password, password2 } = req.body
    const errors = []

    // check for required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'All Fields Are Required'})
    }

    // check for password mismatch
    if( password != password2 ){
        errors.push({msg: 'Passwords Do Not Match'})
    }

    // check for password length
    if( password.length < 6 ){
        errors.push({msg: 'password must be at least 6 characters'})
    }


    // if there are errors
    if( errors.length > 0 ){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }else{

        // there are no errors
        User.findOne({email: email})
        .then(user => {
            
            if(user){ // user already exists
                errors.push({msg: 'Email Address is already registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }else{
                // user does not exist, createnew user
                
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // hash the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {

                        // set password to hash
                        newUser.password = hash

                        newUser.save()
                        .then(user => {
                            console.log(user)
                            req.flash('success_msg', 'You are registered and can now log in')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))

                    }) 
                })


            }
        })
        .catch(err => console.log(err))

    }

})




// login request handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
}) 



//logout request handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are now logged out')
    res.redirect('/users/login')
})



// facebook auth
router.get('/facebook', passport.authenticate('facebook', {
    scope: 'email'
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'

}) )



// twitter auth
router.get('/twitter', passport.authenticate('twitter') )

router.get('/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/login',
    successRedirect: '/'
}))



// forgot password handle
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
})


router.post('/forgot-password', (req, res) => {
    const {email} = req.body;

    // check if email address exists in the database
    User.findOne({email: email})
    .then(user => {

        // check if user exists
        if(user){
            // user with the email exists
            const payload = {
                email: user.email,
                id: user.id
            };


             const secret = JWT_SECRET + user.password;
             const token = jwt.sign(payload, secret, {expiresIn: '15m'}); 
             const link = `https://triviamania.herokuapp.com/users/reset-password/${user.id}/${token}`;
             console.log(link);

             // start send link to email address
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'programmerandy420',
                    pass: 'Andrica1@google'
                }
            })

            const mailOptions = {
                from: 'programmerandy420@gmail.com',
                to: req.body.email,
                subject: 'Account password reset',
                html: `click the following link to reset your password: ${link}`
            }

            transporter.sendMail(mailOptions, (error, info) => {

                if(error){
                    console.log(error);
                    res.render('forgot-password-outcome', {message: 'Oops something went wrong!'});  
                }else{
                    console.log('Email Sent: '+ info.response);
                    res.render('forgot-password-outcome', {message: 'The reset password link has been sent to your email address.'});
                    
                }

            } )
   
       
        }else{ // user does not exist

            console.log('User with that email does not exist');
            res.render('forgot-password-outcome', {message: 'User with that email address does not exist!'});
            // return res.send('User with that email address is not registered!');
        }

    })
    .catch(error => {
        console.log('you got an Error')
        console.log(error)
    })
    
})




router.get('/reset-password/:id/:token', (req, res) => {


    const {id, token} = req.params;

    // check if id exists in the database
    User.findById(id)
    .then(user => {
        if(!user){
            console.log('Invalid user');
            res.send('Invalid user id');
            return;
        }else{
            // we have a valid user id
            const secret = JWT_SECRET + user.password;

            try{
                const payload = jwt.verify(token, secret);
                res.render('reset-password', {email: user.email, id: id, token: token});
            }catch(error){
                console.log(error.message);
                res.send(error.message);

            }

        }
    })
    .catch(error => console.log(error))

})



router.post('/reset-password/:id/:token', (req, res) => {

    const {id, token} = req.params;
    const {password, password2} = req.body;

    // check if the user id exists in the database
    User.findById(id)
    .then(user => {

        if(!user){ // No exists
            res.send('Invalid user id...');
            return;
            
        }else{ // user exists   
            const secret = JWT_SECRET + user.password;

            try{
                const payload = jwt.verify(token, secret);

                // check if the passwords match
                if( password !== password2 ){
                    throw 'The passwords do not match!';
                }else{
                    // The passwords match
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) throw err;

                        bcrypt.hash(password, salt, (err, hash) => {

                            if(err) throw err;

                            User.findByIdAndUpdate({_id: id}, {password: hash})
                            .then(user => {
                                console.log('Updated user is: '+ user);
                                res.redirect('/users/login');
                            })
                            .catch(error => console.log(error) )

                        })
                    })

                }



            }catch(error){
                console.log(error);
            }

        }

    })
    .catch(error => console.log(error) )


})




// export the router
module.exports = router