const express = require('express')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const AuthService = require('./auth-service')

authRouter
    //post login
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { email, password } = req.body
        const loginUser = { email, password }
        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        AuthService.getUserWithUserEmail(req.app.get('db'), loginUser.email)
                .then(dbUser => {
                    if (!dbUser)
                        return res.status(400).json({
                            error: 'Incorrect email or password'
                        })
                    return AuthService.comparePasswords(loginUser.password, dbUser.password)
                        .then(compareMatch => {
                            if (!compareMatch)
                                return res.status(400).json({
                                    error: 'Incorrect email or password'
                                })
                                const sub = dbUser.email
                                const payload = { user_id: dbUser.id }
                                res.send({
                                    authToken: AuthService.createJwt(sub, payload),
                                    userId: dbUser.id,
                                    user_type: dbUser.user_type,
                                })
                        })
                })
                .catch(next)
    })

module.exports = authRouter