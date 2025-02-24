require('dotenv').config();
const pool = require('./poolfile');
const axios = require('axios');

let crudsObj = {};

crudsObj.postUser = (name, surname, email, role, phone, address) => {
    return new Promise((resolve, reject) => {
        const user_password = "25d55ad283aa400af464c76d713c07ad";
        pool.query('INSERT INTO users (user_name, surname, email, role, phone, address, user_password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, surname, email, role, phone, address, user_password], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'User created successfully' });
            }); 
    });
};

crudsObj.resetPassword = async (email, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {

        console.log(email)
        console.log(oldPassword)

        // Check if the email exists and the old password is valid
        pool.query('SELECT * FROM users WHERE email = ? AND user_password = ?', [email, oldPassword], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Invalid email or password' });
            }

            // Update the password
            pool.query('UPDATE users SET user_password = ? WHERE email = ?', [newPassword, email], async (err, results) => {
                if (err) {
                    return reject(err);
                }

                return resolve({ status: '200', message: 'Password reset successfully'});

            });
        });
    });
};


crudsObj.authenticateUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = ? AND user_password = ?', [email, password], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve({ status: '401', message: 'Invalid email or password' });
            }
            const user = results[0]; // Get the user data from the results

            // Return user data without the password
            const { user_password, ...userData } = user; // Exclude password from user data
            return resolve({ status: '200', message: 'Login successful', user: userData });

        });
    });
};


crudsObj.getUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updateUser = (id, name, surname, email, password, role, phone, address) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET user_name = ?, surname = ?, email = ?, phone = ?, address = ? WHERE user_id = ?',
            [name, surname, email, phone, address, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'User updated successfully' });
            });
    });
};
// crudsObj.updateUser = (id, name, surname, email, password, role, phone, address) => {
//     return new Promise((resolve, reject) => {
//         pool.query('UPDATE users SET user_name = ?, surname = ?, email = ?, user_password = ?, role = ?, phone = ?, address = ? WHERE user_id = ?',
//             [name, surname, email, password, role, phone, address, id], (err, result) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 return resolve({ status: '200', message: 'User updated successfully' });
//             });
//     });
// };

crudsObj.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE user_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve({ status: '200', message: 'User deleted successfully' });
        });
    });
};

module.exports = crudsObj;
