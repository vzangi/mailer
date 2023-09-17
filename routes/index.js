const { withAuth } = require('../middlewares/auth')
const routes = [
    'auth',
    'groups',
    'addresses',
    'transports',
    'templates',
    'deliveries',
    'users',
]

module.exports = (app) => {

    app.get('/', withAuth, (_, res) => {
        res.render('pages/main')
    }) 

    for (let route of routes)
        app.use(`/${route}`, require(`./${route}`))

    // Обработка страницы 404
    app.use((_, res) => {
        res.redirect('/')
    })
}
