const express = require('express')
const router = express.Router()

const {ensureAuthenticated} = require('../config/auth')


// music trivia route
router.get('/music', ensureAuthenticated, (req, res) => {
    res.render('music', {name: req.user.name})
})

// science and nature route
router.get('/science', ensureAuthenticated, (req, res) => {
    res.render('science', {name: req.user.name})
})


// computers route
router.get('/computers', ensureAuthenticated, (req, res) => {
    res.render('computers', {name: req.user.name})
})

// science and nature route
router.get('/mathematics', ensureAuthenticated, (req, res) => {
    res.render('mathematics', {name: req.user.name})
})

// Mythology route
router.get('/mythology', ensureAuthenticated, (req, res) => {
    res.render('mythology', {name: req.user.name})
})

// Sports route
router.get('/sports', ensureAuthenticated, (req, res) => {
    res.render('sports', {name: req.user.name})
})


// Geography route
router.get('/geography', ensureAuthenticated, (req, res) => {
    res.render('geography', {name: req.user.name})
})

// history route
router.get('/history', ensureAuthenticated, (req, res) => {
    res.render('history', {name: req.user.name})
})


// movies trivia route
router.get('/movies', ensureAuthenticated, (req, res) => {
    res.render('movies', {name: req.user.name})
})

// general knowledge trivia route
router.get('/general', ensureAuthenticated, (req, res) => {
    res.render('general', {name: req.user.name})
})


// video games trivia route
router.get('/games', ensureAuthenticated, (req, res) => {
    res.render('games', {name: req.user.name})
})


// politics trivia route
router.get('/politics', ensureAuthenticated, (req, res) => {
    res.render('politics', {name: req.user.name})
})

// television trivia route
router.get('/television', ensureAuthenticated, (req, res) => {
    res.render('television', {name: req.user.name})
})



module.exports = router