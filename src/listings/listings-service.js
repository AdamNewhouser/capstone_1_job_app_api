const ListingsService = {
    getListings(db) {
        return db.select(
            'listings.id',
            'listings.company_name',
            'listings.location',
            'listings.job_title',
            'listings.job_description', 
            'listings.pay', 
            'listings.date_listed', 
            'listings.required_skills',
            'listings.additional_skills',
            )
            .from('listings')
    },
    insertListing(db, newListing) {
        return db.insert(newListing).into('listings')
            .then(rows => {
                return rows[0]
            })
    },
    getById(db, id) {
        return ListingsService.getListings(db)
            .where('id', id)
            .first()
    },
    deleteListing(db, id) {
        return db('listings').where({ id }).delete()
    },
    updateProfile(db, id, newListingFields) {
        return db('listings').where({ id }).update(newListingFields)
    }


}

module.exports = ListingsService