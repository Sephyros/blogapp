// Imports
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const user = require('./routes/user')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Post')
const Post = mongoose.model('posts')
require('./models/Category')
const Category = mongoose.model('categories')
const passport = require("passport")
require('./config/auth')(passport)
const db = require('./config/db')

// const i18n = require('./i18n')

// Config
    // i18n
        // app.use(i18n)
    // Session
        app.use(session({
            secret: 'mydearsecret',
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_message = req.flash('success_message')
            res.locals.error_message = req.flash('error_message')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect(db.mongoURI).then(() => {
            console.log('Mongonected!')
        }).catch((error) => {
            console.log('OH NO DATABASE HAS EXPLODED!')
        })
    // Public
        app.use(express.static(path.join(__dirname, 'public')))

// Routes
    app.get('/', (req, res) => {
        Post.find().populate('category').sort({date: 'DESC'}).then((posts) => {
            res.render("index", {posts: posts})
        }).catch((error) => {
            req.flash('error_message', 'Whoops, Something gone wrong...' + error)
            res.redirect('/404')
        })
    })

app.get('/post/:slug', (req, res) => {
    Post.findOne({slug: req.params.slug}).populate().then((post) => {
        // Category.find().then((category) => {})            
        if(post){
                res.render('post/index', {post: post})
            } else {
                req.flash('error_message', 'Are you sure that post exists?')
                res.redirect('/')
            }
        // }).catch((error) => {
        //     req.flash('error_msg', "Are you sure that post exists?" )
        //     res.redirect("/")
        // })
    }).catch((error) => {
        req.flash('error_msg', 'The world is changing... and something gone wrong! ')
        res.redirect('/')
    })
})

    app.get('/404', (req, res) => {
        res.send('Oh! you found a 404!')
    })

    app.use('/admin', admin)
    app.use('/user', user)

    app.get('/categories', (req, res) => {
        Category.find().then((categories) => {
            res.render('categories/index', {categories: categories})
        }).catch((error) => {
            req.flash('error_message', 'Thank you for this beautiful ERROR!')
            res.redirect('/')
        })
    })

    app.get('/categories/:slug', (req, res) => {
        Category.findOne({slug: req.params.slug}).then((category) => {
            if(category){
                Post.find({category: category._id}).then((posts) => {
                    res.render('categories/posts', {posts: posts, category: category})
                }).catch((error) => {
                    req.flash('error_message', 'Error when listing posts...')
                    res.redirect('/')
                })
            } else {
                req.flash('error_message', 'This category doesn\'t exist')
                res.redirect('/')
            }
        }).catch((error) => {
            req.flash('error_message', 'Another one to the account!')
            res.redirect('/')
        })
    })
    
    app.get('posts', (req, res) => {
        res.send('Posts')
    })



// Other
    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
        console.log('Server Up!')
    })