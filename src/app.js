const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { CLIENT_ORIGIN } = require('./config')
const profilesRouter = require('./profiles/profiles-router')
const listingsRouter = require('./listings/listings-router')
const authRouter = require('./auth/auth-router')
const applicantsRouter = require('./applicants/applicants-router')
const usersRouter = require('./users/users-router')

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))
app.use(helmet());
app.use(cors())

app.use('/api/profiles', profilesRouter)
app.use('/api/listings', listingsRouter)
app.use('/api/auth', authRouter)
app.use('/api/applicants', applicantsRouter)
app.use('/api/users', usersRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})


module.exports = app;