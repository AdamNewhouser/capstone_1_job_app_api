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

profilesRouter.route('/:profileId/education')
    .post(jsonBodyParser, (req, res, next) => {
        const { school_name, degree, length_of_enrollment, location, profile_id } = req.body.education
        const newEd = { school_name, degree, length_of_enrollment, location, profile_id }
        for (const [key, value] of Object.entries(newEd))
            if (value === null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        ProfilesService.insertEducation(req.app.get('db'), newEd)
            .then(education => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${education.profile_id}/education`))
                    .json(education)
            })
            .catch(next)
    })

profilesRouter.route('/:profileId/employment')
    .post(jsonBodyParser, (req, res, next) => {
        const { company_name, job_title, job_description, length_of_duty, location, supervisor_name, supervisor_phone, profile_id } = req.body.employment
        const newEmp = { company_name, job_title, job_description, length_of_duty, location, supervisor_name, supervisor_phone, profile_id }
        for (const [key, value] of Object.entries(newEmp))
            if (value === null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        ProfilesService.insertEmployment(req.app.get('db'), newEmp)
            .then(employment => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${employment.profile_id}/employment`))
                    .json(employment)
            })
            .catch(next)
    })

profilesRouter.route('/:profileId/image')
    .post(jsonBodyParser, (req, res, next) => {
        const { image_url, profile_id, user_id } = req.body.image_url
        const newImage = { image_url, profile_id, user_id }
        for (const [key, value] of Object.entries(newImage))
            if (value === null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        ProfilesService.insertImage(req.app.get('db'), newImage)
            .then(image => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${image.profile_id}/image`))
                    .json(image)
            })
            .catch(next)
    })

profilesRouter.route('/')
    .get(getImageIfExists)
    .get(checkProfileExists)
    .get((req, res, next) => {
        return res.json(res.profile)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { name, profile_tag, primary_industry, user_id } = req.body.profile
        const newProfile = { name, profile_tag, primary_industry, user_id }
        for (const [key, value] of Object.entries(newProfile))
            if (value === null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        ProfilesService.insertProfile(req.app.get('db'), newProfile)
            .then(profile => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${profile.id}`))
                    .json(profile)
            })
            .catch(next)
    })

profilesRouter.route('/:profileId')
    .all(getImageIfExists)
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

async function getImageIfExists(req, res, next) {
    try {
        console.log(req)
        if (!req.headers.userid) {
            const image = await ProfilesService.getImageByProfileId(req.app.get('db'), req.params.profileId)
            if (!image) {
                next()
            }
            res.profile = image
            next()
        }
        const image = await ProfilesService.getImageByUserId(req.app.get('db'), req.headers.userid)
        if (!image) {
            next()
        }
        res.profile = image
        next()
    } catch (error) {
        next(error)
    }
}

async function checkProfileExists(req, res, next) {
    try {
        if (!req.headers.userid) {
            const profile = await ProfilesService.getCandidateProfiles(req.app.get('db'), req.params.profileId)
            if (!profile)
                return res.status(404).json({
                    error: `Profile doesn't exist`
                })
            res.profile = {...res.profile, profile}
            next()
        }
        if (req.headers.usertype === 'employer') {
            const profile = await ProfilesService.getEmployerById(req.app.get('db'), req.headers.userid)
            if (!profile)
                return res.status(404).json({
                    error: `Profile doesn't exist`
                })
            res.profile = {...res.profile, profile}
            console.log(res.profile)
            next()
        } else {
            const profile = await ProfilesService.getById(req.app.get('db'), req.headers.userid)
            if (!profile)
                return res.status(404).json({
                    error: `Profile doesn't exist`
                })
            res.profile = {...res.profile, profile}
            console.log(res.profile)
            next()
        }
    } catch (error) {
        next(error)
    }
}


module.exports = profilesRouter