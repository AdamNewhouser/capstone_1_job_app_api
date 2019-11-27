const path = require('path')
const express = require('express')
const ListingsService = require('./listings-service')
const { requireAuth } = require('../middleware/jwt-auth')
const listingsRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

const serializeListing = listing => ({
    id: listing.id,
    company_name: xss(listing.company_name),
    job_title: xss(listing.job_title),
    job_description: xss(listing.job_description),
    pay: xss(listing.pay),
    required_skills: xss(listing.required_skills),
    additional_skills: xss(listing.additional_skills),
    date_listed: listing.date_listed,
    user_id: listing.user_id
})

listingsRouter.route('/')
    .get((req, res, next) => {
        if (req.headers.userid) {
            ListingsService.getListingsByEmployerId(req.app.get('db'), req.headers.userid)
            .then(listings => {
                res.json(listings)
            })
            .catch(next)
        } else {
            ListingsService.getListings(req.app.get('db'))
            .then(listings => {
                res.json(listings)
            })
            .catch(next)
        }
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { newListing } = req.body
        for (const [key, value] of Object.entries(newListing))
                if (value === null)
                    return res.status(400).json({
                        error: `Missing '${key}' in request body`
                    })
        ListingsService.insertListing(req.app.get('db'), newListing)
            .then(listing => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${listing.id}`))
                    .json(listing)
            })
            .catch(next)
    })

listingsRouter.route('/:listingId')
    .all(checkListingExists)
    .get((req, res) => {
        res.json(res.listing)
    })
    .post(jsonBodyParser, checkForDuplicateApplicant)
    .post(jsonBodyParser, (req, res, next) => {
        const applicant = req.body
        for (const [key, value] of Object.entries(applicant))
            if (value === null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        ListingsService.insertApplicant(req.app.get('db'), applicant)
            .then(applicant => {
                res.status(201).json(applicant)
            })
            .catch(next)
    })

async function checkListingExists(req, res, next) {
    try {
        const listing = await ListingsService.getById(
            req.app.get('db'),
            req.params.listingId
        )

        if (!listing)
            return res.status(404).json({
                error: `Listing doesn't exist`
            })

        res.listing = listing
        next()
    } catch (error) {
        next(error)
    }
}

async function checkForDuplicateApplicant(req, res, next) {
    try {
        const applicants = await ListingsService.getApplicantsForValidation(req.app.get('db'), req.params.listingId)
        applicants.map(applicant => {
            if (applicant.profile_id === req.body.profile_id)
                return res.status(400).json({
                    error: `Profile already in database`
                })
        })
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = listingsRouter