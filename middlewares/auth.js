const User = require('../models/User')
const auth = {}

auth.withAuth = (req, res, next) => {
    if (req.user) {
        res.locals.user = req.user
        return next()
    }
    res.redirect('/auth/login')
}

auth.isAdmin = (req, res, next) => {
    if (req.user.role <= User.ADMIN) 
        return next()
    res.redirect('/')
}

auth.isSuper = (req, res, next) => {
    if (req.user.role <= User.SUPER) 
        return next()
    res.redirect('/')
}

auth.isUser = (req, res, next) => {
    if (req.user.role <= User.USER) 
        return next()
    res.redirect('/')
}

module.exports = auth