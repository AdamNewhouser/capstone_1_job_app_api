module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://adam:password@localhost/job_app',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://adam:password@localhost/job_app_test',
    JWT_SECRET:  process.env.JWT_SECRET || 'change-this-secret'
}