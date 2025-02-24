require('dotenv').config();
const pool = require('./poolfile');

let resultsObj = {};

resultsObj.postResult = (module_id, student_id, assignment_id, marks, total_possible, percentage, grade) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO results(module_id, student_id, assignment_id, marks, total_possible, percentage, grade) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [module_id, student_id, assignment_id, marks, total_possible, percentage, grade], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Result record added successfully' });
            }
        );
    });
};

resultsObj.getResults = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

resultsObj.getResultById = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

resultsObj.getResultStudentById = (modID, stuID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT r.*, a.topic FROM results r JOIN assignments a ON a.assignment_id = r.assignment_id WHERE r.module_id = ? AND r.student_id = ? ORDER BY r.result_id DESC', [modID, stuID], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

resultsObj.getResultModuleById = (modID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT r.*, a.topic, u.name, u.surname FROM results r JOIN assignments a ON a.assignment_id = r.assignment_id JOIN users u ON u.user_id = r.student_id WHERE r.module_id = ? ORDER BY r.result_id DESC', [modID], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

resultsObj.updateResult = (result_id, module_id, student_id, assignment_id, marks, percentage, grade, date) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE results SET module_id = ?, student_id = ?, assignment_id = ?, marks = ?, percentage = ?, grade = ?, date = ? WHERE result_id = ?',
            [module_id, student_id, assignment_id, marks, percentage, grade, date, result_id], 
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Result record updated successfully' });
            });
    });
};

resultsObj.deleteResult = (result_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM results WHERE result_id = ?', [result_id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Result record deleted successfully' });
        });
    });
};

module.exports = resultsObj;
