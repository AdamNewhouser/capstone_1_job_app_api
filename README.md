# Job App Server

live-app: https://job-app.adamnewhouser.now.sh

client repo: https://github.com/AdamNewhouser/capstone_1_job_app

server repo: https://github.com/AdamNewhouser/capstone_1_job_app_api

Demo Accounts:

    1.) Michael Scott - candidate account
        email: michaelscarn@hotmail.com
        password: michaelpassword123

    2.) Dunder Mifflin - employer account
        email: hiring@dundermifflin.com
        password: dundermifflinpassword123


Summary:

    The Job app is a combination of a corporate social media site and job board that allows you to create a unique profile and will eventually allow you to interact with your peers and employers. Employers may also post new jobs to the job board and will eventually be able to interact with their applicants.

    When registering, please designate if you plan to sign up as a candidate or an employer. Both candidates and employers build unique profiles but the difference between the two is that only candidates may apply for any job listings and only employers may create job listings.

    When applying for a job as a candidate, all it takes is one-click on the apply button within any listing. Once clicked, all of the necessary information is sent to the employer for them to make a final decision! 
    
API Documentation:

    API Base URL: https://dry-inlet-84566.herokuapp.com/api

    - GET /profiles
    - GET /listings
    - GET /listings/{listing-id}
    - POST /users
    - POST /auth/login
    - POST /listings
    - POST /listings/{listing-id}
    - POST /profiles/{profile-id}
    - POST /profiles/{profile-id}/{profile-image}
    - POST /profiles/{profile-id}/employment
    - POST /profiles/{profile-id}/education
    
Tech: Node.js

Screens:



## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
