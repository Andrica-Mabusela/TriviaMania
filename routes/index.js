const express = require('express')
const router = express.Router()
const {ensureAuthenticated, publicAuthenticated} = require('../config/auth')


router.get('/', ensureAuthenticated, (req, res) => {
    res.render('welcome', {name: req.user.name})
})

router.get('/allquizes', ensureAuthenticated, (req, res) => {
    res.render('allquizes', {name: req.user.name})
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {name: req.user.name})
})


// leaderboard route 
router.get('/leaderboard', ensureAuthenticated, (req, res) => {
    res.render('leaderboard', {name: req.user.name})
})

// export the router
module.exports = router