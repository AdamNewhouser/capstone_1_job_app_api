const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test-user1@gmail.com',
      phone: '555-555-5555',
      user_name: 'test name 1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
      user_type: 'candidate',
    },
    {
      id: 2,
      email: 'test-user2@gmail.com',
      phone: '555-555-5555',
      user_name: 'test name 2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
      user_type: 'candidate',
    },
    {
      id: 3,
      email: 'test-user3@gmail.com',
      phone: '555-555-5555',
      user_name: 'test name 3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
      user_type: 'candidate',
    },
    {
      id: 4,
      email: 'test-user4@gmail.com',
      phone: '555-555-5555',
      user_name: 'test name 4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
      user_type: 'employer',
    },
  ]
}

function makeProfilesArray(users) {
  return [
    {
      id: 1,
      name: 'test profile 1',
      profile_tag: 'test profile tag 1',
      primary_industry: 'test primary industry',
      date_created: '2029-01-22T16:28:32.615Z',
      user_id: users[0].id,
    },
    {
      id: 2,
      name: 'test profile 2',
      profile_tag: 'test profile tag 2',
      primary_industry: 'test primary industry',
      date_created: '2029-01-22T16:28:32.615Z',
      user_id: users[1].id,
    },
    {
      id: 3,
      name: 'test profile 3',
      profile_tag: 'test profile tag 3',
      primary_industry: 'test primary industry',
      date_created: '2029-01-22T16:28:32.615Z',
      user_id: users[2].id,
    },
    {
      id: 4,
      name: 'test profile 4',
      profile_tag: 'test profile tag 4',
      primary_industry: 'test primary industry',
      date_created: '2029-01-22T16:28:32.615Z',
      user_id: users[3].id,
    },
  ]
}

function makeEmploymentArray(profiles) {
  return [
    {
      id: 1,
      company_name: 'test company 1',
      job_title: 'test job title 1',
      job_description: 'this is a job description',
      length_of_duty: 'MO/YEAR - MO/YEAR',
      location: 'test location',
      supervisor_name: 'test supervisor name',
      supervisor_phone: 'test supervisor phone',
      profile_id: profiles[0].id,
    },
    {
      id: 2,
      company_name: 'test company 2',
      job_title: 'test job title 2',
      job_description: 'this is a job description',
      length_of_duty: 'MO/YEAR - MO/YEAR',
      location: 'test location',
      supervisor_name: 'test supervisor name',
      supervisor_phone: 'test supervisor phone',
      profile_id: profiles[1].id,
    },
    {
      id: 3,
      company_name: 'test company 3',
      job_title: 'test job title 3',
      job_description: 'this is a job description',
      length_of_duty: 'MO/YEAR - MO/YEAR',
      location: 'test location',
      supervisor_name: 'test supervisor name',
      supervisor_phone: 'test supervisor phone',
      profile_id: profiles[2].id,
    },
    {
      id: 4,
      company_name: 'test company 4',
      job_title: 'test job title 4',
      job_description: 'this is a job description',
      length_of_duty: 'MO/YEAR - MO/YEAR',
      location: 'test location',
      supervisor_name: 'test supervisor name',
      supervisor_phone: 'test supervisor phone',
      profile_id: profiles[3].id,
    },
  ]
}

function makeEducationArray(profiles) {
  return [
    {
      id: 1,
      school_name: 'test school 1',
      degree: 'test degree 1',
      length_of_enrollment: 'FALL/YEAR - SPRING/YEAR',
      location: 'test location',
      profile_id: profiles[0].id,
    },
    {
      id: 2,
      school_name: 'test school 2',
      degree: 'test degree 2',
      length_of_enrollment: 'FALL/YEAR - SPRING/YEAR',
      location: 'test location',
      profile_id: profiles[1].id,
    },
    {
      id: 3,
      school_name: 'test school 3',
      degree: 'test degree 3',
      length_of_enrollment: 'FALL/YEAR - SPRING/YEAR',
      location: 'test location',
      profile_id: profiles[2].id,
    },
    {
      id: 4,
      school_name: 'test school 4',
      degree: 'test degree 4',
      length_of_enrollment: 'FALL/YEAR - SPRING/YEAR',
      location: 'test location',
      profile_id: profiles[3].id,
    },
  ]
}

function makeProfilesFixtures() {
  const testUsers = makeUsersArray()
  const testProfiles = makeProfilesArray(testUsers)
  const testEmployment = makeEmploymentArray(testProfiles)
  const testEducation = makeEducationArray(testProfiles)
  return { testUsers, testProfiles, testEmployment, testEducation }
}

function cleanTables(db) {
  return db.raw(`TRUNCATE profiles, users, employment, education RESTART IDENTITY CASCADE`)
}

function makeExpectedProfile(users, profile, employment, education) {
  const user = users.find(user => user.id === profile.user_id)
  const buildEmployment = employment.filter(employment => employment.profile_id === profile.id)
  const buildEducation = education.filter(education => education.profile_id === profile.id)
  return {
    id: profile.id,
    name: profile.name,
    profile_tag: profile.profile_tag,
    primary_industry: profile.primary_industry,
    date_created: profile.date_created,
    user_id: profile.user_id,
    employment: {
      id: buildEmployment.id,
      company_name: buildEmployment.company_name,
      job_title: buildEmployment.job_title,
      job_description: buildEmployment.job_description,
      length_of_duty: buildEmployment.length_of_duty,
      location: buildEmployment.location,
      supervisor_name: buildEmployment.supervisor_name,
      supervisor_phone: buildEmployment.supervisor_phone,
      profile_id: buildEmployment.profile_id,
    },
    education: {
      id: buildEducation.id,
      school_name: buildEducation.school_name,
      degree: buildEducation.degree,
      length_of_enrollment: buildEducation.length_of_enrollment,
      location: buildEducation.location,
      profile_id: buildEducation.profile_id,
    },
    user_id: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      password: user.password,
      date_created: user.date_created,
      user_type: user.user_type,
    }
  }
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() => 
      db.raw(`SELECT setval('users_id_seq', ?)`,
      [users[users.length - 1].id],
      )
    )
}

function seedJobAppTables(db, users, profiles, employment, education) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('profiles').insert(profiles)
    await trx.raw(
      `SELECT setval('profiles_id_seq', ?)`,
      [profiles[profiles.length - 1].id],
    )
    await trx.into('employment').insert(employment)
    await trx.raw(
      `SELECT setval('employment_id_seq', ?)`,
      [employment[employment.length - 1].id]
    )
    await trx.into('education').insert(education)
    await trx.raw(
      `SELECT setval('education_id_seq', ?)`,
      [education[education.length - 1].id]
    )
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeProfilesArray,
  makeEmploymentArray,
  makeEducationArray,
  makeProfilesFixtures,
  cleanTables,
  seedUsers,
  makeAuthHeader,
  seedJobAppTables,
  makeExpectedProfile,
}