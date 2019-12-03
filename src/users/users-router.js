const express = require('express')
const path = require('path')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const UsersService = require('./users-service')

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { password, email, phone, user_name, user_type } = req.body
        for (const field of ['email', 'phone', 'user_name', 'password', 'user_type'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        const passwordError = UsersService.validatePassword(password)
        if (passwordError)
            return res.status(400).json({ error: passwordError })

        UsersService.hasUserWithEmail(req.app.get('db'), email)
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: `Email already in use` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            email,
                            phone,
                            user_name,
                            password: hashedPassword,
                            user_type,
                        }
                        return UsersService.insertUser(req.app.get('db'), newUser)
                            .then(user => {
                                res.status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

module.exports = usersRouter