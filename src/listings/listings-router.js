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
    pay: listing.pay,
    required_skills: listing.required_skills,
    additional_skills: listing.additional_skills,
    date_listed: listing.date_listed,
})

listingsRouter.route('/')
    .get((req, res, next) => {
        ListingsService.getListings(req.app.get('db'))
            .then(listings => {
                res.json(listings)
            })
            .catch(next)
    })

listingsRouter.route('/:listingId')
    .all(checkListingExists)
    .get((req, res) => {
        res.json(res.listing)
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

module.exports = listingsRouter