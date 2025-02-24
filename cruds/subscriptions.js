require('dotenv').config();
const pool = require('./poolfile');

let subscriptionsObj = {};

subscriptionsObj.postSubscription = (member_id, amount, exp_date) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO subscriptions(member_id, amount, exp_date) VALUES (?, ?, ?)',
            [member_id, amount, exp_date],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Subscription record added successfully' });
            }
        );
    });
};

// subscriptionsObj.getSubscriptions = () => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM subscriptions', (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

// subscriptionsObj.getSubscriptionById = (subscription_id) => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM subscriptions WHERE subscription_id = ?', [subscription_id], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

subscriptionsObj.getSubscriptionByMemberId = (memberId, currentDate) => {
    return new Promise((resolve, reject) => {
        console.log(memberId)
        console.log(currentDate)
        pool.query(`SELECT * FROM subscriptions WHERE member_id = ? AND exp_date >= "${currentDate}"`, [memberId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get By Ref
subscriptionsObj.getSubscriptionByRefId = (refId, currentDate) => {
    return new Promise((resolve, reject) => {
        console.log(refId)
        console.log(currentDate)
        pool.query(`SELECT m.*, s.* FROM members m JOIN subscriptions s ON m.member_id = s.member_id WHERE m.ref_id = ? AND exp_date >= "${currentDate}"`, [refId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get By Total Sales Ref
subscriptionsObj.getSalesByRefId = (refId) => {
    return new Promise((resolve, reject) => {
        console.log(refId)
        pool.query(`SELECT SUM(a.cash_in) AS totalSales, m.*, s.*, a.* FROM members m JOIN subscriptions s ON m.member_id = s.member_id JOIN accounts a ON a.member_id = m.ref_id WHERE m.ref_id = ?`, [refId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// subscriptionsObj.getAllSubscriptionByMemberIdAndCourse = (memberId, currentDate) => {
//     return new Promise((resolve, reject) => {
//         console.log(currentDate)
//         pool.query(`SELECT s.*, m.name AS module_name, c.name AS course_name, cr.name AS level_name FROM subscriptions s JOIN modules m ON m.module_id = s.module_id JOIN courses cr ON cr.course_id = s.course_id JOIN colleges c ON c.college_id = cr.college_id WHERE s.member_id = ? AND s.exp_date >= "${currentDate}"`, [memberId], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

// subscriptionsObj.getAllSubscriptionByModule = (moduleId, currentDate) => {
//     return new Promise((resolve, reject) => {
//         // pool.query('SELECT s.*, m.name AS module_name, c.name AS course_name, cr.name AS level_name, u.name AS member_name, u.Surname AS member_surname FROM subscriptions s JOIN modules m ON m.module_id = s.module_id JOIN courses cr ON cr.course_id = s.course_id JOIN colleges c ON c.college_id = s.course_id JOIN users u ON s.member_id = u.user_id WHERE s.module_id = ?', [moduleId], (err, results) => {
//         pool.query(`SELECT s.subscription_id, s.date, s.exp_date, u.user_id AS member_id, u.name AS member_name, u.Surname AS member_surname, u.email FROM subscriptions s JOIN users u ON s.member_id = u.user_id WHERE s.module_id = ? AND s.exp_date >= "${currentDate}"`, [moduleId], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

// subscriptionsObj.getAllSubscriptionByCourse = (id, currentDate) => {
//     return new Promise((resolve, reject) => {
//         console.log(id);
//         pool.query(`SELECT * FROM subscriptions WHERE course_id = ? AND exp_date > "${currentDate}"`, [id], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

// subscriptionsObj.getAllSubscriptionByCollege = (id, currentDate) => {
//     return new Promise((resolve, reject) => {
//         console.log(id);
//         pool.query(`SELECT s.subscription_id FROM subscriptions s JOIN courses c ON s.course_id = c.course_id INNER JOIN colleges cl ON cl.college_id = c.college_id WHERE cl.college_id = ? AND s.exp_date > "${currentDate}"`, [id], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

// // subscriptionsObj.getSubscriptionByMemberIdAndCourse = (memberId, courseId) => {
// //     return new Promise((resolve, reject) => {
// //         pool.query('SELECT * FROM subscriptions WHERE member_id = ? AND module_id = ?', [memberId, courseId], (err, results) => {
// //             if (err) return reject(err);
// //             return resolve(results);
// //         });
// //     });
// // };

// subscriptionsObj.updateSubscription = (subscription_id, course_id, member_id, exp_date) => {
//     return new Promise((resolve, reject) => {
//         pool.query('UPDATE subscriptions SET course_id = ?, member_id = ?, exp_date = ? WHERE subscription_id = ?',
//             [course_id, member_id, exp_date, subscription_id],
//             (err, result) => {
//                 if (err) return reject(err);
//                 return resolve({ status: '200', message: 'Subscription record updated successfully' });
//             });
//     });
// };

// subscriptionsObj.deleteSubscription = (subscription_id) => {
//     return new Promise((resolve, reject) => {
//         pool.query('DELETE FROM subscriptions WHERE subscription_id = ?', [subscription_id], (err, results) => {
//             if (err) return reject(err);
//             return resolve({ status: '200', message: 'Subscription record deleted successfully' });
//         });
//     });
// };

module.exports = subscriptionsObj;
