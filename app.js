require('dotenv').config('./.env')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const db = require('./utils/db')
const { validateToken } = require('./utils/jwt')
const fileUpload = require('express-fileupload')

app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(validateToken)
app.use(fileUpload())
;(async () => {
  db.authenticate()
    .then(async () => {
      console.log('База подключена')

      require('./routes')(app)

      const PORT = process.env.PORT || 3001
      app.listen(PORT, () => {
        console.log(`Сервер запущен на ${PORT} порту`)
      })
    })
    .catch((error) => {
      console.log('Ошибка при подключении к базе: ', error)
    })
})()
