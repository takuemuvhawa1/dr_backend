require('dotenv').config();
const pool = require('./poolfile');

let pendingObj = {};

pendingObj.postPending = (member_id, amount, details) => {
    return new Promise((resolve, reject) => {
        let bal = 0
        const cleared = false;

        pool.query('SELECT balance FROM pending_bal WHERE member_id = ? ORDER BY pending_id DESC LIMIT 1', [member_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                // return resolve({ status: '401', message: 'course not found' });
                pool.query('INSERT INTO pending_bal(member_id, amount, details, balance, cleared) VALUES (?, ?, ?, ?, ?)',
                    [member_id, amount, details, amount, cleared],
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve({ status: '200', message: 'Pending record added successfully' });
                    }
                );
            } else {
                const data = results[0];
                const bal = data.balance;
                let newBal = Number(bal) + Number(amount);

                pool.query('INSERT INTO pending_bal(member_id, details, amount, balance, cleared) VALUES (?, ?, ?, ?, ?)',
                    [member_id, details, amount, newBal, cleared],
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve({ status: '200', message: 'Pending record added successfully' });
                    }
                );
            }
        });
    });
};

pendingObj.postPendingCashout = (member_id, ecocash, name, surname, amount) => {
    return new Promise((resolve, reject) => {
        const cash_in = 0;
        const reason = "Cashout"
        pool.query(
            'INSERT INTO college_acc(member_id, course_id, module_id, student_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [member_id, name, surname, ecocash, reason, cash_in, amount, cash_in],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Result record added successfully' });
            }
        );
    });
};

pendingObj.postPendingSettle = (member_id, amount, details) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT balance FROM pending_bal WHERE member_id = ? ORDER BY pending_id DESC LIMIT 1', [member_id], async (err, results) => {
            if (err) {
                return reject(err);
            }

            const data = results[0];
            const bal = data.balance;
            let newBal = Number(bal) - Number(amount);

            const cleared = true;

            pool.query(
                'INSERT INTO pending_bal(member_id, details, amount, balance, cleared) VALUES (?, ?, ?, ?, ?)',
                [member_id, details, amount, newBal, cleared],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve({ status: '200', message: 'Result record added successfully' });
                }
            );
        });
    });
};

// pendingObj.getPendings = () => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM results', (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

pendingObj.getPendingBal = (member_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT balance FROM pending_bal WHERE member_id = ? ORDER BY pending_id DESC LIMIT 1', [member_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                let bal = 0.00
                return resolve({ status: '401', message: 'Pending balance retrived', bal });
            } else {

                const data = results[0];
                const bal = data.balance;

                return resolve({ status: '200', message: 'Pending balance retrived', bal });

            }
        });
    });
};

pendingObj.getPendingTrans = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM college_acc WHERE member_id = ? ORDER BY pending_id DESC', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

pendingObj.getPendingById = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

pendingObj.getPendingCollegeById = (modID, stuID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results WHERE module_id = ? AND student_id = ?', [modID, stuID], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

pendingObj.updatePending = (result_id, module_id, student_id, assignment_id, marks, percentage, grade, date) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE results SET module_id = ?, student_id = ?, assignment_id = ?, marks = ?, percentage = ?, grade = ?, date = ? WHERE result_id = ?',
            [module_id, student_id, assignment_id, marks, percentage, grade, date, result_id],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Pending record updated successfully' });
            });
    });
};

pendingObj.deletePending = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Pending record deleted successfully' });
        });
    });
};

module.exports = pendingObj;