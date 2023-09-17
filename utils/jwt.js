const { sign, verify } = require('jsonwebtoken')
const secretKey = process.env.SECRET_JWT_KEY || "To be or not to be"
const tokenCookieName = process.env.TOKEN_COOKIE || 'jwt'

// Функция создающая токен
const createToken = (user) => {
    const { id, name, role } = user
    const accessToken = sign({ id, name, role }, secretKey)
    return accessToken
}

// Промежуточная функция для проверки наличия и валидности токена
const validateToken = (req, _, next) => {
    const accessToken = req.cookies[tokenCookieName]

    if (!accessToken) return next()

    try {
        const validToken = verify(accessToken, secretKey)
        if (validToken) {
            req.user = validToken
        }
    } catch (error) {
        console.log(error)
    }

    next()
}


module.exports = {
    createToken,
    validateToken,
    secretKey,
    tokenCookieName
}