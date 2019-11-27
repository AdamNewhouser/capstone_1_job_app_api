const path = require('path')
const express = require('express')
const ProfilesService = require('./profiles-service')
const { requireAuth } = require('../middleware/jwt-auth')
const profilesRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

const serializeProfile = profile => ({
    id: profile.id,
    name: xss(profile.name),
    profile_tag: xss(profile.profile_tag),
    primary_industry: xss(profile.primary_industry),
    date_created: profile.date_created,
    user_id: profile.user_id,
})



profilesRouter.route('/:profileId')
    .all(checkProfileExists)
    .get((req, res, next) => {
        return res.json(res.profile)
    })
    .get((req, res, next) => {
        ProfilesService.getApplicantsByUserId(req.params.profileId)
            .then(applicants => {
                res.json(applicants)
            })
    })


async function checkProfileExists(req, res, next) {
    try {
        if (req.headers.usertype === 'employer') {
            const profile = await ProfilesService.getEmployerById(req.app.get('db'), req.params.profileId)
            if (!profile)
                return res.status(404).json({
                    error: `Profile doesn't exist`
                })
            res.profile = profile
            next()
        } else {
            const profile = await ProfilesService.getById(req.app.get('db'), req.params.profileId)
            if (!profile)
                return res.status(404).json({
                    error: `Profile doesn't exist`
                })
            res.profile = profile
            next()
        }
    } catch (error) {
        next(error)
    }
}


module.exports = profilesRouter