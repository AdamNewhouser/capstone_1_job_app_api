const path = require('path')
const express = require('express')
const ListingsService = require('./listings-service')
const ProfilesService = require('../profiles/profiles-service')
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
        //gets only employer listings
        if (req.headers.userid) {
            ListingsService.getListingsByEmployerId(req.app.get('db'), req.headers.userid)
            .then(listings => {
                res.json(listings)
            })
            .catch(next)
        //gets all listings for candidate
        } else {
            ListingsService.getListings(req.app.get('db'))
            .then(listings => {
                res.json(listings)
            })
            .catch(next)
        }
    })
    //posts new listing
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
    //gets a single listing
    .get((req, res) => {
        res.json(res.listing)
    })
    .post(jsonBodyParser, checkForDuplicateApplicant)
    //posts a new listing
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
    //edit listing
    .patch(jsonBodyParser, (req, res, next) => {
        console.log(req.body)
        const updatedListing = req.body.updatedListing
        const listingId = req.body.listing_id 
        for (const [key, value] of Object.entries(updatedListing))
            if (value === null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        ListingsService.updateListing(req.app.get('db'), listingId, updatedListing)
            .then(updated => {
                res.status(201).json(updatedListing)
            })
            .catch(next)
    })

listingsRouter.route('/applicants')
    //gets the applicants for a particular listing
    .get((req, res) => {
        ListingsService.getApplicantsForValidation(req.app.get('db'), req.headers.listingId)
            .then(apps => {
                console.log(apps)
                res.json(apps)
            })
    })

listingsRouter.route('/:listingId/profiles')
    //gets the profile data for employers to see applicant profile
    .get((req, res, next) => {
    console.log(req.headers.profileid);
    ProfilesService.getMicro(req.app.get("db"), req.headers.profileid)
        .then(response => {
            res.json(response)
        })
        .catch(next)
    });

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