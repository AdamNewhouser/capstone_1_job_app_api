BEGIN;

TRUNCATE
    users,
    profiles,
    employment,
    education,
    listings
    RESTART IDENTITY CASCADE;
    
INSERT INTO users (email, phone, user_name, password, user_type)
VALUES
    ('singingdrummer@gmail.com', '555-555-1111', 'Kevin Malone', '$2a$04$dmHWLvxjW7uS0IsOddDDdOchayDRYHbg.1EVX4Oox6FhWuRo8ZI.a', 'candidate'),
    ('mustardisthenewblack@shrutefarms.org', '555-555-2222', 'Dwight Schrute', '$2a$04$RVVDe7CX83c9hJhHVdGcZeIPZxRysVJ179EsArwCvCnV03HePXvBi', 'candidate'),
    ('petitecatlady@gmail.com', '555-555-3333', 'Angela Martin', '$2a$04$K/zpujm7On6NQbOQHTj/te7F8TkvZSETwLjVY5p39gJiOEXho9To2', 'candidate'),
    ('michaelscarn@hotmail.com', '555-555-4444', 'Michael Scott',  '$2a$04$Joojp80k7wN1.xQc8N3.8uQU4NAQT5iG7Ss6zfW970U695GgFaMyW', 'candidate'),
    ('williamcschneider@creedthoughts.net', '555-555-5555', 'Creed Bratton', '$2a$04$twlvPaEgLeUSe54UbEs/lOMq0RMm4PAsWsOEe/c1ZLZWe5LfCmIFW', 'candidate'),
    ('hiring@dundermifflin.com', '555-555-6666', 'Dunder Mifflin', '$2a$04$oD9xAhYd39T5VlMxgDLTBuA7UVShNwFOm.CmLUDxTI/9aqL46fGYy', 'employer');

INSERT INTO profiles (name, profile_tag, primary_industry, user_id)
VALUES
    ('Kevin Malone', 'Me accounting. Me on time. Me become favorite employee.', 'Accounting', 1),
    ('Dwight Schrute', 'I would describe myself in three words: Hardworking, Alpha-male, Jackhammer, Merciless, and Insatiable.', 'Sales', 2),
    ('Angela Martin', 'I am thorough and diligent. I always submit important documents on time.', 'Accounting', 3),
    ('Michael Scott', 'Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.', 'Sales Management', 4),
    ('Creed Bratton', 'I have been involved in a number of cults, both as a leader and a follower. You have more fun as a follower, but you make more money as a leader.', 'Quality Assurance', 5),
    ('Dunder Mifflin', 'We are a mid-level paper supply company with branches all across the northeastern United States. We offer a personal buying experience that you just do not get with the large paper supply chains.', 'Paper Sales and Service', 6);

INSERT INTO employment (company_name, job_title, job_description, length_of_duty, location, supervisor_name, supervisor_phone, profile_id)
VALUES
    ('Pizza By Alfredo', 'Pizza chef', 'I made the pizza and ran them through the oven', 'January 2003 - March 2005', 'Scranton, PA', 'Alfredo', '555-555-1234', 1),
    ('The streets of Scranton', 'homeless man', 'Doing whatever it takes, baby', 'February 1995 - March 2005', 'Scranton, PA', 'unknown', 'unknown', 5),
    ('American Girl Doll Store', 'Dress tester', 'I would try on the dresses for the large colonial dolls to make sure they fit correctly', 'March 2004 - March 2005', 'Loveland, OH', 'John-David', '555-555-4321', 3),
    ('Staples', 'Floor Sales', 'I was a salesman on the floor and would stock inventory when their were no customers', 'March 2007 - April 2007', 'Scranton, PA', 'Tim', '555-555-1212', 2),
    ('Mens Warehouse', 'Greeter', 'I would welcome customers and tell them about our lastest sales.', 'November 2000 - March 2005', 'Scranton, PA', 'Tony', '555-555-0000', 4);

INSERT INTO education (school_name, degree, length_of_enrollment, location, profile_id)
VALUES
    ('Scranton Community College', 'Accounting', 'Fall 2002 - Winter 2004', 'Scranton, PA', 1),
    ('Clark State Community College', 'Accounting', 'Fall 2002 - Winter 2005', 'Springfield, OH', 3),
    ('Scranton Clown College', 'General Shenanigans', 'Fall 1975 - Spring 1981', 'Scranton, PA', 5),
    ('The School of Hard Knocks', 'Business School', 'Fall 1998 - Spring 2004', 'Scranton, PA', 4),
    ('Lakawanna County Horticultural College', 'Beats', 'Fall 1992 - Summer 1996', 'Carbondale, PA', 2);

INSERT INTO listings (company_name, location, job_title, job_description, pay, required_skills, additional_skills, user_id)
VALUES
    ('Dunder Mifflin', 'Scranton, PA', 'Junior Accountant', 'Thank you for your interest in a career at Dunder Mifflin. We are seeking an entry level Junior Accountant who will help and assit the Accounting Manager in daily accounting activities.', '45k/year', 'A degree in Accounting from a 4 year school is required. This is an entry level position', 'Specific Accounting Programs', 6),
    ('Dunder Mifflin', 'Scranton, PA', 'Accounting Manager', 'Thank you for your interest in a career at Dunder Mifflin. We are seeking an experienced Accounting Manager who will organize and run the accounting department.', '55k/year', 'A degree in Accounting from a 4 year school. 2+ years accounting experience.', 'Managerial Experience', 6),
    ('Dunder Mifflin', 'Scranton, PA', 'Quality Assurance Rep.', 'Thank you for your interest in a career at Dunder Mifflin. We are seeking an experienced Quality Assurance Rep who will oversee the quality of our product from the supplier.', '45k/year', '2+ years experience in customer relations', 'Experience in Quality Assurance', 6),
    ('Dunder Mifflin', 'Scranton, PA', 'Sales', 'Thank you for your interest in a career at Dunder Mifflin. We are seeking an experienced Sales Rep who is a self-starter and used to working on commission.', '25k/year plus commission', '2+ years sales experience', 'Paper sales experience', 6),
    ('Dunder Mifflin', 'Scranton, PA', 'Regional Manager', 'Thank you for your interest in a career at Dunder Mifflin. We are seeking an experienced Office Manager who can organize and run the office.', '50k/year', '2+ years managerial experience', 'Paper sales experience', 6);

INSERT INTO profile_images (image_url, profile_id)
VALUES
    ('https://upload.wikimedia.org/wikipedia/en/6/60/Office-1200-baumgartner1.jpg', 1),
    ('https://upload.wikimedia.org/wikipedia/en/c/cd/Dwight_Schrute.jpg', 2),
    ('https://upload.wikimedia.org/wikipedia/en/0/0b/Angela_Martin.jpg', 3),
    ('https://upload.wikimedia.org/wikipedia/en/d/dc/MichaelScott.png', 4),
    ('https://upload.wikimedia.org/wikipedia/en/c/cd/CreedBratton%28TheOffice%29.jpg', 5),
    ('https://images-na.ssl-images-amazon.com/images/I/61v20Ec5iwL._SX425_.jpg', 6);

COMMIT;