const express = require('express')
const path = require('path')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const UsersService = require('./users-service')

usersRouter
    //posts initial user information to the database after registration
    .post('/', jsonBodyParser, (req, res, next) => {
        const { email, phone, user_name, password, user_type } = req.body.user
        for (const [key, value] of Object.entries(req.body))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
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