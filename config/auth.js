const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


// User Model
require('../models/User')
const User = mongoose.model('user')


module.exports = (passport) => {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'},(email, password, done) => {
        User.findOne({email: email}).then((user) => {
            if(!user){
                return done(null, false, {message: 'This account doesn\'t exists'})
            }
            bcrypt.compare(password, user.password, (error, passMatch) => {
                if(passMatch){
                    return done(null, user)
                } else {
                    return done(null, false, {message: "Incorrect Password"})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user)
        })
    })
}