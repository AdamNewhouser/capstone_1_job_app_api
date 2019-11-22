CREATE TABLE employment (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_description TEXT NOT NULL,
    length_of_duty TEXT NOT NULL,
    location TEXT NOT NULL,
    supervisor_name TEXT NOT NULL,
    supervisor_phone TEXT NOT NULL,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE NOT NULL
);

