const ProfilesService = {
    getEmployerProfiles(db) {
        return db
            .from('profiles')
            .select(
            'profiles.id',
            'profiles.name',
            'profiles.profile_tag',
            'profiles.primary_industry',
            'profiles.date_created',
            'profile_images.image_url'
            )
            .join('profile_images', 'profiles.id', 'profile_images.profile_id')
    },
    getCandidateProfiles(db) {
        return db
            .from('profiles')
            .select(
            'profiles.id',
            'profiles.name',
            'profiles.profile_tag',
            'profiles.primary_industry', 
            'profiles.date_created', 
            'users.email', 
            'users.phone',
            'employment.company_name',
            'employment.job_title',
            'employment.job_description',
            'employment.length_of_duty',
            'employment.location',
            'employment.supervisor_name',
            'employment.supervisor_phone',
            'education.school_name',
            'education.degree',
            'education.length_of_enrollment',
            'education.location as ed_location',
            
            )
            .join('users', 'profiles.user_id', 'users.id')
            .join('employment', 'profiles.id', 'employment.profile_id')
            .join('education', 'profiles.id', 'education.profile_id')
            
    },
    insertProfile(db, newProfile) {
        return db.insert(newProfile).into('profiles').returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    insertEducation(db, newEd) {
        return db.insert(newEd).into('education').returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    insertEmployment(db, newEmp) {
        return db.insert(newEmp).into('employment').returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    insertImage(db, newImage) {
        return db.insert(newImage).into('profile_images').returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(db, id) {
        return ProfilesService.getCandidateProfiles(db)
            .where('profiles.user_id', id)
            .first()
    },
    getEmployerById(db, id) {
        return ProfilesService.getEmployerProfiles(db)
            .where('profiles.user_id', id)
            .first() 
    },
    deleteProfile(db, id) {
        return db('profiles').where({ id }).delete()
    },
    updateProfile(db, id, newProfileFields) {
        return db('profiles').where({ id }).update(newProfileFields)
    },
    getApplicantsByUserId(db, userId) {
        return db.select('*').from('applicants').where('applicants.user_id', userId)
    },
    getImageByUserId(db, id) {
        return db.select('profile_images.image_url').from('profile_images').where('profile_images.user_id', id)
    },
    getImageByProfileId(db, id) {

    },
    getProfileByPath(db, id) {
        return db.select(
            ''
        )
    }
}

module.exports = ProfilesService