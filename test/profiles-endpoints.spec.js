const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Profiles Endpoints', () => {
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
            connection: process.env.TEST_DATABASE_URL,
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

    describe(`POST /api/profiles`, () => {
        beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )
        it(`creates new profile, responding with 201 and the new profile`, () => {
            const user = testUsers[0]
            const newProfile = {
                name: user.user_name,
                profile_tag: 'test profile tag',
                primary_industry: 'test primary industry',
                user_id: user.id
            }
            return supertest(app)
                .post('/api/profiles')
                .set('Authorization', helpers.makeAuthHeader(user))
                .send(newProfile)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.name).to.eql(newProfile.name)
                    expect(res.body.profile_tag).to.eql(newProfile.profile_tag)
                    expect(res.body.primary_industry).to.eql(newProfile.primary_industry)
                    expect(res.body.user_id).to.eql(user.id)
                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC'})
                    const actualDate = new Date(res.body.date_created).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                .expect(res =>
                    db
                        .from('profiles')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.name).to.eql(newProfile.name)
                            expect(row.profile_tag).to.eql(newProfile.profile_tag)
                            expect(row.primary_industry).to.eql(newProfile.primary_industry)
                            expect(row.user_id).to.eql(user.id)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC'})
                            const actualDate = new Date(row.date_created).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                    )
        })
        it(`creates a new education profile, responding with 201 and the new education profile`, () => {
            const educationUser = testUsers[0]
            const testEdMicroProfile = testProfiles[0]
            const newEducation = {
                school_name = 'test school name',
                degree = 'test new degree',
                length_of_enrollment = 'Fall 2001 - Spring 2005',
                location = 'Scranton, PA',
                profile_id = testEdMicroProfile.id
            }
            return supertest(app)
                .post(`/api/profiles/${testEdMicroProfile.id}/education`)
                .set('Authorization', helpers.makeAuthHeader(educationUser))
                .send(newEducation)
                .expect(201)
                .expect(res => {
                    expect(res.body.school_name).to.eql(newEducation.school_name)
                    expect(res.body.degree).to.eql(newEducation.degree)
                    expect(res.body.length_of_enrollment).to.eql(newEducation.length_of_enrollment)
                    expect(res.body.location).to.eql(newEducation.location)
                    expect(res.body.profile_id).to.eql(testEdMicroProfile.id)
                })
                .expect(res =>
                    db
                        .from('education')
                        .select('*')
                        .where({ profile_id: res.body.profile_id })
                        .first()
                        .then(row => {
                            expect(row.school_name).to.eql(newEducation.school_name)
                            expect(row.degree).to.eql(newEducation.degree)
                            expect(row.length_of_enrollment).to.eql(newEducation.length_of_enrollment)
                            expect(row.location).to.eql(newEducation.location)
                        })
                    )
        })
        it(`creates a new employment profile, responding with 201 and the new employment profile`, () => {
            const employmentUser = testUsers[0]
            const testEmpMicroProfile = testProfiles[0]
            const newEmployment = {
                company_name: 'test company name',
                job_title: 'test job title',
                job_description: 'test job description',
                length_of_duty: 'test length of duty',
                location: 'test location',
                supervisor_name: 'test supervisor name',
                supervisor_phone: '555-555-5555',
                profile_id = testEmpMicroProfile.id
            }
            return supertest(app)
                .post(`/api/profiles/${testEmpMicroProfile.id}/employment`)
                .set('Authorization', helpers.makeAuthHeader(employmentUser))
                .send(newEmployment)
                .expect(201)
                .expect(res => {
                    expect(res.body.company_name).to.eql(newEmployment.company_name)
                    expect(res.body.job_title).to.eql(newEmployment.job_title)
                    expect(res.body.job_description).to.eql(newEmployment.job_description)
                    expect(res.body.length_of_duty).to.eql(newEmployment.length_of_duty)
                    expect(res.body.location).to.eql(newEmployment.location)
                    expect(res.body.supervisor_name).to.eql(newEmployment.supervisor_name)
                    expect(res.body.supervisor_phone).to.eql(newEmployment.supervisor_phone)
                    expect(res.body.profile_id).to.eql(testEmpMicroProfile.id)
                })
                .expect(res =>
                    db
                        .from('employment')
                        .select('*')
                        .where({ profile_id: res.body.profile_id })
                        .first()
                        .then(row => {
                            expect(row.company_name).to.eql(newEmployment.company_name)
                            expect(row.job_title).to.eql(newEmployment.job_title)
                            expect(row.job_description).to.eql(newEmployment.job_description)
                            expect(row.length_of_duty).to.eql(newEmployment.length_of_duty)
                            expect(row.location).to.eql(newEmployment.location)
                            expect(row.supervisor_name).to.eql(newEmployment.supervisor_name)
                            expect(row.supervisor_phone).to.eql(newEmployment.supervisor_phone)
                            expect(row.profile_id).to.eql(testEmpMicroProfile.id)
                        })
                    )
        })
        it(`creates a new image for profile, responding with 201 and new image`, () => {
            const imageUser = testUsers[0]
            const testImgMicroProfile = testProfiles[0]
            const newImage = {
                image_url: 'www.testimageurl.com',
                profile_id: testImgMicroProfile.id,
                user_id: imageUser.id
            }
            return supertest(app)
                .post(`/api/profiles/${testImgMicroProfile.id}/image`)
                .set('Authorization', helpers.makeAuthHeader(imageUser))
                .send(newImage)
                .expect(201)
                .expect(res => {
                    expect(res.body.image_url).to.eql(newImage.image_url)
                    expect(res.body.profile_id).to.eql(testImgMicroProfile.id)
                    expect(res.body.user_id).to.eql(imageUser.id)
                })
                .expect(res =>
                    db
                        .from('employment')
                        .select('*')
                        .where({ profile_id: res.body.profile_id })
                        .first()
                        .then(row => {
                            expect(row.image_url).to.eql(newImage.image_url)
                            expect(row.profile_id).to.eql(testImgMicroProfile.id)
                            expect(row.user_id).to.eql(imageUser.id)
                        })
                    )
        })
    })
})