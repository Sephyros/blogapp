const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', (req, res) => {
    var errors = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({texto: 'Invalid name'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({texto: 'Invalid email'})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({texto: 'Invalid password'})
    }

    if(req.body.password != req.body.passwordconfirmation){
        errors.push({text: 'Passwords aren\'t the same'})
    }

    if(errors.length > 0){
        res.render('/user/register', {errors: errors})
    } else {
        User.findOne({email: req.body.email}).then((user) => {
            if(user){
                req.flash('error_message', 'Whoops, someone came first')
                res.redirect('/user/register')
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error){
                            req.flash('error_message', 'Something gone wrong when creating the user')
                            res.redirect('/')
                        }
                        newUser.password = hash
                        newUser.save().then(() => {
                            req.flash('success_message', 'User created successfully!')
                            res.redirect('/')
                        }).catch((error) => {
                            req.flash('error_message')
                            res.redirect('/user/register')
                        })
                    })
                })
            }
        }).catch((error) => {
            req.flash('error_message', 'Gotta Catch \'em all! (bugs of course!)')
            res.redirect('/')
        })
    }
})


router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_message', 'Bye!')
    res.redirect('/')
})

module.exports = router