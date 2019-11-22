CREATE TABLE education (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    school_name TEXT NOT NULL,
    degree TEXT NOT NULL,
    length_of_enrollment TEXT NOT NULL,
    location TEXT NOT NULL,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE NOT NULL
);