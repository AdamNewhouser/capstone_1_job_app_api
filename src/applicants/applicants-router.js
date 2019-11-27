const express = require('express')
const ApplicantsService = require('./applicants-service')
const { requireAuth } = require('../middleware/jwt-auth')
const applicantsRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

applicantsRouter.route('/')
    .all(checkApplicantsExists)
    .get((req, res, next) => {
        res.json(res.applicants)
    })


async function checkApplicantsExists(req, res, next) {
    try {
        const applicants = await ApplicantsService.getApplicants(
            req.app.get('db'),
            req.headers.listingid
        )

        if (!applicants)
            return res.status(404).json({
                error: `No applicants exist`
            })

        res.applicants = applicants
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = applicantsRouter