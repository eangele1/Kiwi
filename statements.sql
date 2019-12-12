/* LOGIN.JS */

/* Retrieves data from login input (comparison done inside the application)*/
SELECT u_ID, u_type FROM user WHERE u_name = 'username' AND u_password = 'password';

/* FORGOT.JS */

/* Retrieves user with information that matches user input */
SELECT * FROM user WHERE u_ID = 'ID_Number' AND u_password = 'password';

/* Retrieves user with information that matches user input */
SELECT * FROM user WHERE u_ID = 'ID_Number' AND u_name = 'username';

/* INFOCHANGE.JS */

/* Checks to see if username does not already exist based on information given */
SELECT * FROM user WHERE u_ID = 'ID_Number' AND u_name = 'username';

/* Changes user name based on given information */
UPDATE user SET u_name = 'username' WHERE u_ID = 'ID_Num';

/* Changes password based on given information */
UPDATE user SET u_password = 'password' WHERE u_ID = 'ID_Num';

/* HOME.JS */

/* INFORMATION.JS */

/* ARCHIVE.JS */

/* Displays archive of events based on user* (u_ID for id retrived) */
SELECT a_ID, a_eventID, a_date, a_time, a_locationname, a_eventname FROM archive
WHERE a_ID = 100123456;

/* Deletes an event from the archive of the respective user (values will be grabbed from selected event) */
DELETE FROM archive
WHERE a_ID = 100123456 AND a_eventID = 10045454;

/* Displays archive of events based on user and based on ascending date*/
SELECT a_ID, a_eventID, a_date, a_time, a_locationname, a_eventname FROM archive
WHERE a_ID = 100123456
ORDER BY (a_date) ASC;

/* Displays archive of events based on user and based on descending date*/
SELECT a_ID, a_eventID, a_date, a_time, a_locationname, a_eventname FROM archive
WHERE a_ID = 100123456
ORDER BY (a_date) DESC;

/* Displays archive of events based on user and based on ascending location name*/
SELECT a_ID, a_eventID, a_date, a_time, a_locationname, a_eventname FROM archive
WHERE a_ID = 100123456
ORDER BY (a_locationname) ASC;

/* Displays archive of events based on user and based on descending location name*/
SELECT a_ID, a_eventID, a_date, a_time, a_locationname, a_eventname FROM archive
WHERE a_ID = 100123456
ORDER BY (a_locationname) DESC;




/* Display/Store student information */
SELECT ui_ID, ui_photoID, ui_qrID, ui_first_name, ui_last_name FROM user_info
WHERE ui_user_type = 'student';

/* Display/Store professor information */
SELECT ui_ID, ui_photoID, ui_qrID, ui_first_name, ui_last_name FROM user_info
WHERE ui_user_type = 'professor';

/* Inserts a new student for the professor's roster */
INSERT INTO roster VALUES (100111222, 'Test', 'Name', 0);

/* Deletes a student from the professor's roster (values will be grabbed from selected student) */
DELETE FROM roster
WHERE r_userID = 100111222 AND r_firstname = 'Test' AND r_lastname = 'Name';

/* Updates the classes of the respective user */
UPDATE user_info
SET ui_classes = 'PH005,CHEM005'
WHERE u_ID = 100123456;

/* Displays the full list of classes */
SELECT c_time, c_roomnum, c_professor, c_classname FROM classes;

/* Displays professor roster */
SELECT r_userID, r_firstname, r_lastname, r_last_check_in FROM roster
WHERE r_userID = 100789123;

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