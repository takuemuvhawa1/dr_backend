require('dotenv').config();
const pool = require('./poolfile');
const poolapi = require('./poolapi');

const axios = require('axios');

let accountObj = {};

accountObj.postAccount = (member_id, amount) => {
    return new Promise((resolve, reject) => {
        let reason = 'subscription'
        let cash_out = 0
        let cash_in = Number(amount) * 0.5
        let adminCashIn = Number(amount) * 0.5

        console.log(member_id)
        let ref = member_id;

        // if(ref === 'null'){
        //     console.log('WORKS')
        // }

        // if(member_id){
        //     console.log('NOOOOT NULLLL');
        // }else{
        //     console.log('NULLLL');
        // }

        // return;

        if (member_id === 'null') {
            console.log('Point Blank')
            pool.query('SELECT balance FROM accounts WHERE member_id = 0 ORDER BY account_id DESC LIMIT 1', async (err, results) => {
                if (err) {
                    return reject(err);
                }
                const adminAcc = 0;
                const adminData = results[0];
                const adminBal = adminData.balance;
                let newAdminBal = Number(adminBal) + Number(amount);

                pool.query('INSERT INTO accounts(member_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?)',
                    [adminAcc, reason, amount, cash_out, newAdminBal],
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve({ status: '200', message: 'Account record added successfully' });
                    });
            });

        } else {
            console.log('POINT REACHED')
            pool.query('SELECT balance FROM accounts WHERE member_id = ? ORDER BY account_id DESC LIMIT 1', [member_id], async (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    // return resolve({ status: '401', message: 'course not found' });
                    pool.query('INSERT INTO accounts(member_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?)',
                        [member_id, reason, cash_in, cash_out, cash_in],
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve({ status: '200', message: 'Account record added successfully' });
                        }
                    );
                } else {

                    const data = results[0];
                    const bal = data.balance;
                    let newBal = Number(bal) + Number(cash_in);

                    pool.query('INSERT INTO accounts(member_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?)',
                        [member_id, reason, cash_in, cash_out, newBal],
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve({ status: '200', message: 'Account record added successfully' });
                        }
                    );
                }

                pool.query('SELECT balance FROM accounts WHERE member_id = 0 ORDER BY account_id DESC LIMIT 1', async (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    const adminAcc = 0;
                    const adminData = results[0];
                    const adminBal = adminData.balance;
                    let newAdminBal = Number(adminBal) + Number(adminCashIn);

                    pool.query('INSERT INTO accounts(member_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?)',
                        [adminAcc, reason, adminCashIn, cash_out, newAdminBal],
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve({ status: '200', message: 'Account record added successfully' });
                        });
                });

            });
        }
    });

}

accountObj.postAccountCashout = (member_id, ecocash, name, amount) => {
    return new Promise((resolve, reject) => {
        const cash_in = 0;
        const reason = `Cashout to: ${name}. No: ${ecocash}`
        pool.query(
            'INSERT INTO accounts(member_id, reason, cash_in, cash_out, balance) VALUES (?, ?, ?, ?, ?)',
            [member_id, reason, cash_in, amount, cash_in],
            (err, result) => {
                if (err) return reject(err);

                let details = `Ecocash No: ${ecocash}, ${name}`

                const data = {
                    member_id,
                    amount,
                    details
                };

                // Post to accounts
                axios.post(`${poolapi}/accpending/`, data)
                    .then(response => {
                        console.log('Response Data:', response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                return resolve({ status: '200', message: 'Result record added successfully' });
            }
        );
    });
};

accountObj.getAccounts = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAllBal = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT c.*, (SELECT a.balance FROM accounts a WHERE a.college_id = c.college_id ORDER BY a.account_id DESC LIMIT 1) AS balance FROM colleges c`, (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountBal = (member_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT balance FROM accounts WHERE member_id = ? ORDER BY account_id DESC LIMIT 1', [member_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                let bal = 0.00
                return resolve({ status: '401', message: 'Account balance retrived', bal });
            } else {

                const data = results[0];
                const bal = data.balance;

                return resolve({ status: '200', message: 'Account balance retrived', bal });

            }
        });
    });
};

accountObj.getAccountTransLast5 = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM accounts WHERE member_id = ? ORDER BY account_id DESC LIMIT 5', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountTrans = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM accounts WHERE member_id = ? ORDER BY account_id DESC', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountPending = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT c.*, p.balance, p.pending_id, p.date, p.details FROM colleges c JOIN ( SELECT college_id, balance, pending_id, details, date FROM pending_bal WHERE (college_id, pending_id) IN (SELECT college_id, MAX(pending_id) FROM pending_bal GROUP BY college_id ) ) p ON c.college_id = p.college_id WHERE p.balance > 0 AND p.balance IS NOT NULL`, (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountById = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.getAccountCollegeById = (modID, stuID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results WHERE module_id = ? AND member_id = ?', [modID, stuID], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

accountObj.updateAccount = (result_id, module_id, member_id, assignment_id, marks, percentage, grade, date) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE results SET module_id = ?, member_id = ?, assignment_id = ?, marks = ?, percentage = ?, grade = ?, date = ? WHERE result_id = ?',
            [module_id, member_id, assignment_id, marks, percentage, grade, date, result_id],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Account record updated successfully' });
            });
    });
};

accountObj.deleteAccount = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Account record deleted successfully' });
        });
    });
};

module.exports = accountObj;