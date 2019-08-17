module.exports = {
    isAdmin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next();
        }
        req.flash('error_message', "You lack powers...")
        res.redirect('/')
    }
}