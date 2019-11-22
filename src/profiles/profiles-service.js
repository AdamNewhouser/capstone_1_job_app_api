const ProfilesService = {
    getMicroProfiles(db) {
        return db.select('*').from('profiles')
    },
    getFullProfiles(db) {
        return db.select(
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
            'education.location as ed_location'
            )
            .from('profiles')
            .join('users', 'profiles.user_id', 'users.id')
            .join('employment', 'profiles.id', 'employment.profile_id')
            .join('education', 'profiles.id', 'education.profile_id')
            
    },
    insertProfile(db, newProfile) {
        return db.insert(newProfile).into('profiles')
            .then(rows => {
                return rows[0]
            })
    },
    getById(db, id) {
        return ProfilesService.getFullProfiles(db)
            .where('users.id', id)
            .first()
    },
    deleteProfile(db, id) {
        return db('profiles').where({ id }).delete()
    },
    updateProfile(db, id, newProfileFields) {
        return db('profiles').where({ id }).update(newProfileFields)
    }


}

module.exports = ProfilesService