const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Profiles Endpoints', function() {
    let db

    const {
        testUsers,
        testProfiles,
        testEmployment,
        testEducation,
    } = helpers.makeProfilesFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/profiles/:profile_id`, () => {
        context(`Given no profiles`, () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )
            it(`responds with 404`, () => {
                const profileId = 123456
                return supertest(app)
                    .get(`/api/profiles/${profileId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: `Profile doesn't exist` })
            })
        })

        context(`Given there are profiles in the database`, () => {
            beforeEach('insert profiles', () => 
                helpers.seedJobAppTables(
                    db,
                    testUsers,
                    testProfiles,
                    testEmployment,
                    testEducation,
                )
            )

            it(`responds with 200 and the specified profile`, () => {
                const profileId = 3
                const expectedProfile = helpers.makeExpectedProfile(
                    testProfiles[profileId - 1],
                    testEmployment,
                    testEducation,
                    testUsers
                )

                return supertest(app)
                    .get(`/api/profiles/${profileId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedProfile)
            })
        })
    })
})