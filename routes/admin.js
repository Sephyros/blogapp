const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('categories')
require('../models/Post')
const Post = mongoose.model('posts')
const {isAdmin} = require('../helpers/isAdmin')

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index')
})


router.get('/categories', isAdmin, (req, res) => {
    Category.find().sort({date: 'DESC'}).then((categories) => {
        res.render('admin/categories', {categories: categories})
    }).catch((error) => {
        res.flash('error_message', "Oh dog, something gone wrong on categories\n" + error)
        res.redirect('/admin')
    })
})

router.get('/categories/add', isAdmin, (req, res) => {
    res.render('admin/addcategories')
})

router.post('/categories/new', isAdmin, (req, res) => {
    var errors = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: 'Empty Name'})
    }
    if(req.body.name.length < 2){
        errors.push({text: 'Name too short'})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Invalid Slug'})
    }
    
    if(errors.length > 0){
        res.render('admin/addcategories', {errors: errors})
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }
        new Category(newCategory).save().then(() => {
            req.flash('success_message', 'Category created!')
            res.redirect('/admin/categories')
        }).catch((error) => {
            req.flash('error_message', 'Oh crap... category not saved...')
            res.redirect('/admin')
        })
    }
})

router.get('/categories/edit/:id', isAdmin, (req, res) => {
    Category.findOne({_id: req.params.id}).then((category) => {
        res.render('admin/editcategories', {category: category})
    }).catch((error) => {
        req.flash('error_message', 'Oh bullocks! this category doesn\'t exist!\n' + error)
        res.redirect('/admin/categories')
    })
})

router.post('/categories/edit', isAdmin, (req, res) => {
    Category.findOne({_id: req.body.id}).then((category) => {
        category.name = req.body.name
        category.slug = req.body.slug
        category.save().then(() => {
            req.flash('success_message', 'Category updated!')
            res.redirect('/admin/categories')
        }).catch((error) => {
            req.flash('error_message', 'Come on dawg, something is wrong when saving!\n' + error)
            res.redirect('/admin/categories')
        })
    }).catch((error) => {
        req.flash('error_message', 'Come on dawg, something is wrong with update!\n' + error)
        res.redirect('/admin/categories')
    })
})

router.post('/categories/delete', isAdmin, (req, res) => {
    Category.remove({_id: req.body.id}).then(() => {
        req.flash('success_message', 'Category deleted!')
        res.redirect('/admin/categories')
    }).catch((error) => {
        req.flash('error_message', 'Ouch! not deleted!\n' + error)
        res.redirect('/admin/categories')
    })
})

router.get('/posts', isAdmin, (req, res) => {
    Post.find().populate('category').sort({date: 'DESC'}).then((posts) => {
        res.render('admin/posts', {posts: posts})
    }).catch((error) => {
        res.flash('error_message', "Oh sheep, something gone wrong on posts\n" + error)
        res.redirect('/admin')
    })
})

router.get('/posts/add', isAdmin, (req, res) => {
    Category.find().then((categories) => {
        res.render('admin/addposts', {categories: categories})
    }).catch((error) => {
        req.flash('error_message', 'What!? no form!?')
        res.redirect('/admin')
    })
})

router.post('/posts/new', isAdmin, (req, res) => {
    var errors = []
    if(req.body.categories == '0'){
        errors.push({text: 'Create a new category and i let you go'})
    }

    if(errors.length > 0){
        res.render('admin/addpost', {errors: errors})
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }
    
    new Post(newPost).save().then(() => {
        req.flash('success_message', 'Post created!')
        res.redirect('/admin/posts')
    }).catch((error) => {
        req.flash('error_message', 'Oh crap... post not saved...\n' + error)
        res.redirect('/admin/posts')
    })
    }
})

router.get('/posts/edit/:id', isAdmin, (req, res) => {
    Post.findOne({_id: req.params.id}).then((post) => {
        Category.find().then((categories) => {
            res.render('admin/editposts', {categories: categories, post: post})
        }).catch((error) => {
            req.flash('error_message', 'NOOOOO! Something gone wrong on category listing!\n' + error)
            res.redirect('/admin/posts')
        })
    }).catch((error) => {
        req.flash('error_message', 'Oh bullocks! this post doesn\'t exist!\n' + error)
        res.redirect('/admin/posts')
    })
})

router.post('/posts/edit', isAdmin, (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {
        post.title = req.body.title
        post.slug = req.body.slug
        post.description = req.body.description
        post.content = req.body.content
        post.category = req.body.category
        post.save().then(() => {
            req.flash('success_message', 'Post updated!')
            res.redirect('/admin/posts')
            console.log(post.content)
        }).catch((error) => {
            req.flash('error_message', 'Come on dawg, something is wrong when saving!\n' + error)
            res.redirect('/admin/posts')
        })
    }).catch((error) => {
        req.flash('error_message', 'Come on dawg, something is wrong with update!\n' + error)
        res.redirect('/admin/posts')
    })
})

router.post('/posts/delete', isAdmin, (req, res) => {
    Post.remove({_id: req.body.id}).then(() => {
        req.flash('success_message', 'Post deleted!')
        res.redirect('/admin/posts')
    }).catch((error) => {
        req.flash('error_message', 'Ouch! not deleted!\n' + error)
        res.redirect('/admin/posts')
    })
})
module.exports = router