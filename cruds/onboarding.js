require('dotenv').config();
const pool = require('./poolfile');
const axios = require('axios');
const poolapi = require('./poolapi');

let crudsObj = {};

crudsObj.postUser = (username, email, hashedPassword, refId) => {
    return new Promise((resolve, reject) => {
        // const user_password = "25d55ad283aa400af464c76d713c07ad";
        pool.query('SELECT email FROM members WHERE email = ?',
            [email], (err, result) => {
                if (err) {
                    return reject(err);
                } else if (result.length > 0) {
                    return resolve({ status: '401', message: 'User already registered' });
                }

                pool.query('INSERT INTO members (username, email, password, ref_id) VALUES (?, ?, ?, ?)',
                    [username, email, hashedPassword, refId], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve({ status: '200', message: 'User created successfully' });
                    });

                return resolve({ status: '200', message: 'User created successfully' });
            });
    });
};

crudsObj.updateMemberDetails = (
    name, gender, dob, bio, city, country, minAge, maxAge, prefBio, member_id, path
) => {
    console.log("MemberID", member_id)
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE members SET name = ?, gender = ?, dob = ?, bio = ?, city = ?, country = ?, min_age = ?, max_age = ?, pref_bio = ?, profile_pic = ? WHERE member_id = ?',
            [
                name,
                gender,
                dob,
                bio,
                city,
                country,
                minAge,
                maxAge,
                prefBio,
                path,
                member_id
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'Member details updated successfully' });
            }
        );
    });
};


crudsObj.authenticateUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM members WHERE email = ? AND password = ?', [email, password], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Invalid email or password' });
            }
            const user = results[0]; // Get the user data from the results

            // Return user data without the password
            const { password, ...userData } = user; // Exclude password from user data
            return resolve({ status: '200', message: 'Login successful', user: userData });

        });
    });
};

crudsObj.resetPassword = async (email, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        // Check if the email exists and the old password is valid
        pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, oldPassword], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Invalid email or password' });
            }

            // Update the password
            pool.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], async (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'Password reset successfully' });
            });
        });
    });
};

crudsObj.forgotPassword = async (email, newPassword) => {
    return new Promise((resolve, reject) => {
        // Update the password
        pool.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], async (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve({ status: '200', message: 'Password reset successfully' });
        });
    });
};

module.exports = crudsObj;
