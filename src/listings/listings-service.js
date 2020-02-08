const ListingsService = {
  getListings(db) {
    return db
      .select(
        "listings.id",
        "listings.company_name",
        "listings.location",
        "listings.job_title",
        "listings.job_description",
        "listings.pay",
        "listings.date_listed",
        "listings.required_skills",
        "listings.additional_skills"
      )
      .from("listings");
  },
  insertListing(db, newListing) {
    return db
      .insert(newListing)
      .into("listings")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return ListingsService.getListings(db)
      .where("id", id)
      .first();
  },
  deleteListing(db, id) {
    return db("listings")
      .where({ id })
      .delete();
  },
  updateListing(db, id, newListingFields) {
    return db("listings")
      .where({ id })
      .update(newListingFields)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  insertApplicant(db, applicant) {
    return db
      .insert(applicant)
      .into("applicants")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getApplicantsForValidation(db, listingId) {
    return db
      .select("*")
      .from("applicants")
      .where("listing_id", listingId);
  },
  getListingsByEmployerId(db, userId) {
    return db
      .select(
        "listings.id",
        "listings.company_name",
        "listings.location",
        "listings.job_title",
        "listings.job_description",
        "listings.pay",
        "listings.date_listed",
        "listings.required_skills",
        "listings.additional_skills"
      )
      .from("listings")
      .where("listings.user_id", userId);
  }
};

module.exports = ListingsService;
