const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Listings Endpoints', () => {
    let db 

    const {
        testUsers,
        testProfiles,
    } = helpers.makeProfilesFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/listings', () => {
        beforeEach(() => {
            helpers.seedUsers(db, testUsers)
        })
        context(`Given no listings`, () => {
            it(`responds with 404`, () => {
                return supertest(app)
                    .get(`/api/listings`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: `Listing doesn't exist` })
            })
        })

        context(`Given there are listings in the database`, () => {
            it(`responds with 200 and the all the listings`, () => {
                const listingsUser = testUsers[0]
                const listings = [
                    {
                        company_name: 'test company name 1',
                        location: 'test location 1',
                        job_title: 'test job title 1',
                        job_description: 'test job description 1',
                        pay: 'test pay 1',
                        required_skills: 'test required skills 1',
                        additional_skills: 'test additional skills 1',
                        user_id: listingsUser.id
                    }
                ]
                db.into('listings').insert(listings)
                return supertest(app)
                    .get(`/api/listings`)
                    .set(`Authorization`, helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, listings)
            })
        })
    })
    
    describe(`GET /api/listings/:listingId`, () => {
        it(`responds with 200 and the listing`, () => {
            const listings = [
                {
                    company_name: 'test company name 1',
                    location: 'test location 1',
                    job_title: 'test job title 1',
                    job_description: 'test job description 1',
                    pay: 'test pay 1',
                    required_skills: 'test required skills 1',
                    additional_skills: 'test additional skills 1',
                    user_id: listingsUser.id
                }
            ]
            const preppedListings = listings.map(listing => ({
                ...listing,
            }))
            db.into('listings').insert(preppedListings)
            return supertest(app)
                .get(`/api/listings/1`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, listings[0])
        })
    })
    
    describe(`GET /api/listings/applicants`, () => {
        it(`responds with 200 and all the applicants for that listing`, () => {
            const listings = [
                {
                    company_name: 'test company name 1',
                    location: 'test location 1',
                    job_title: 'test job title 1',
                    job_description: 'test job description 1',
                    pay: 'test pay 1',
                    required_skills: 'test required skills 1',
                    additional_skills: 'test additional skills 1',
                    user_id: listingsUser.id
                }
            ]
            const applicants = [
                {
                    profileid: testProfiles[0],
                    listing_id: 1
                },
                {
                    profileid: testProfiles[1],
                    listing_id: 1
                }
            ]
            const preppedListings = listings.map(listing => ({
                ...listing
            }))
            const preppedApplicants = applicants.map(applicant => ({
                ...applicant
            }))
            db.into('listings').insert(preppedListings)
            db.into('applicants').insert(preppedApplicants)
            return supertest(app)
                .get('/api/listings/applicants')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, applicants)
        })
    })

    describe(`POST /api/listings`, () => {
        beforeEach(() => 
            helpers.seedUsers(db, testUsers)
        )
        it(`creates a new listing, responding with 201 and the new listing`, () => {
            const newListingUser = testUsers[0]
            const newListing = {
                company_name: 'test company name 1',
                location: 'test location 1',
                job_title: 'test job title 1',
                job_description: 'test job description 1',
                pay: 'test pay 1',
                required_skills: 'test required skills 1',
                additional_skills: 'test additional skills 1',
                user_id: newListingsUser.id
            }
            return supertest(app)
                .post('/api/listings')
                .set('Authorization', helpers.makeAuthHeader(newListingUser))
                .send(newListing)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.company_name).to.eql(newListing.company_name)
                    expect(res.body.location).to.eql(newListing.location)
                    expect(res.body.job_title).to.eql(newListing.job_title)
                    expect(res.body.job_description).to.eql(newListing.job_description)
                    expect(res.body.pay).to.eql(newListing.pay)
                    expect(res.body.required_skills).to.eql(newListing.required_skills)
                    expect(res.body.additional_skills).to.eql(newListing.additional_skills)
                    expect(res.body.user_id).to.eql(newListingUser.id)
                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC'})
                    const actualDate = new Date(res.body.date_listed).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                .expect(res =>
                    db
                        .from('listings')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.company_name).to.eql(newListing.company_name)
                            expect(row.location).to.eql(newListing.location)
                            expect(row.job_title).to.eql(newListing.job_title)
                            expect(row.job_description).to.eql(newListing.job_description)
                            expect(row.pay).to.eql(newListing.pay)
                            expect(row.required_skills).to.eql(newListing.required_skills)
                            expect(row.additional_skills).to.eql(newListing.additional_skills)
                            expect(row.user_id).to.eql(newListingUser.id)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC'})
                            const actualDate = new Date(row.date_listed).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                    )
        })
    })
})