/* Display/Store student information */
SELECT ui_ID, ui_photoID, ui_qrID, ui_first_name, ui_last_name FROM user_info
WHERE ui_user_type = 'student';

/* Display/Store professor information */
SELECT ui_ID, ui_photoID, ui_qrID, ui_first_name, ui_last_name FROM user_info
WHERE ui_user_type = 'professor';

/* Retrieves data from login input (comparison done inside the application)*/
SELECT u_ID, u_name, u_password, u_type FROM user;

/* Displays archive of events based on user*/
/* u_ID for id retrived */
SELECT a_date, a_time, a_locationname, a_eventname FROM archive, events
WHERE a_ID = 100123456 AND a_eventID = e_ID;

/* Deletes an event from the archive of the respective user */
/* values will be grabbed from selected event */
DELETE FROM archive
WHERE a_ID = 100123456 AND a_eventID = 10045454;

/* Inserts a new student for the professor's roster */
INSERT INTO roster VALUES (100111222, 'Test', 'Name', 0);

/* Deletes a student from the professor's roster */
/* values will be grabbed from selected student */
DELETE FROM roster
WHERE r_userID = 100111222 AND r_firstname = 'Test' AND r_lastname = 'Name';

/* Updates the classes of the respective user */
UPDATE user_info
SET ui_classes = 'PH005,CHEM005'
WHERE u_ID = 100123456;

/* Displays the full list of classes */
SELECT c_time, c_roomnum, c_professor, c_classname FROM classes;

/* Inserts a new event for the user's archive */
INSERT INTO archive VALUES (100123456, 10000333, '2019-10-01', '10:00:00.000', 'COB 102', 'MATH 005-LEC');

/* Displays professor roster */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster
WHERE r_userID = 100789123;

/* Update password */
UPDATE user
SET u_password = 'Blahblah12@'
WHERE u_ID = '100123456';

/* Update username */
UPDATE user
SET u_username = 'testusername'
WHERE u_ID = '100123456' AND u_password = 'Blahblah12@';

/* Displays professor roster based on check-in (true) */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster, user_info
WHERE r_userID = ui_ID AND r_last_check_in = 1;

/* Displays professor roster based on check-in (false) */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster, user_info
WHERE r_userID = ui_ID AND r_last_check_in = 0;

/* Displays professor roster based on check-in based on ascending first name */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster, user_info
WHERE r_userID = ui_ID
ORDER BY (r_firstname) ASC;

/* Displays professor roster based on check-in based on descending first name */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster, user_info
WHERE r_userID = ui_ID
ORDER BY (r_firstname) DESC;

/* Displays professor roster based on check-in based on ascending last name */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster, user_info
WHERE r_userID = ui_ID
ORDER BY (r_lastname) ASC;

/* Displays professor roster based on check-in based on descending last name */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster, user_info
WHERE r_userID = ui_ID
ORDER BY (r_lastname) DESC;

/* Displays archive of events based on user and based on ascending date*/
SELECT a_date, a_time, a_locationname, a_eventname FROM archive, events, user_info
WHERE a_ID = ui_ID AND a_eventID = e_ID
ORDER BY (a_date) ASC;

/* Displays archive of events based on user and based on descending date*/
SELECT a_date, a_time, a_locationname, a_eventname FROM archive, events, user_info
WHERE a_ID = ui_ID AND a_eventID = e_ID
ORDER BY (a_date) DESC;

/* Displays archive of events based on user and based on ascending location name*/
SELECT a_date, a_time, a_locationname, a_eventname FROM archive, events, user_info
WHERE a_ID = ui_ID AND a_eventID = e_ID
ORDER BY (a_locationname) ASC;

/* Displays archive of events based on user and based on descending location name*/
SELECT a_date, a_time, a_locationname, a_eventname FROM archive, events, user_info
WHERE a_ID = ui_ID AND a_eventID = e_ID
ORDER BY (a_locationname) DESC;