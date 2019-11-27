const ApplicantsService = {
    getApplicants(db, listingId) {
        return db.select('*').from('applicants').where('applicants.listing_id', listingId)
    }
}

module.exports = ApplicantsService