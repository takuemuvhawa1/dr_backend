require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.getMembers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM members', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getMemberById = (memberId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM members WHERE member_id = ?', [memberId], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getMembersByRefId = (memberId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM members WHERE ref_id = ?', [memberId], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getPotentialsById = (memberId) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM members WHERE member_id = ?',
            [memberId], (err, result) => {
                if (err) {
                    return reject(err);
                } if (result.length > 0) {
                    const user = result[0];
                    let matchGender = 'Null';
                    if (user.gender == 'M') {
                        matchGender = 'F'
                    } else if (user.gender == 'F') {
                        matchGender = 'M'
                    } else {
                        matchGender = 'F'
                    }

                    // pool.query('SELECT * FROM members WHERE ((member_id != ?) AND gender = ?) ORDER BY RAND() LIMIT ?', [memberId, matchGender, 50], (err, results) => {
                    pool.query('SELECT * FROM members WHERE ((member_id != ?) AND gender = ?) AND member_id NOT IN ( SELECT profile_id FROM likes WHERE member_id = ?) AND member_id NOT IN ( SELECT member_id FROM likes WHERE (match_id = ?)) ORDER BY RAND() LIMIT ?', [memberId, matchGender, memberId, memberId, 50], (err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(results);
                    });

                } else {
                    return resolve({ status: '400', message: 'NOT FOUND' });
                }
            }
        );
    });
};

crudsObj.getLikesById = (memberId) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM members WHERE member_id = ?',
            [memberId], (err, result) => {
                if (err) {
                    return reject(err);
                } if (result.length > 0) {
                    const user = result[0];
                    let matchGender = 'Null';
                    if (user.gender == 'M') {
                        matchGender = 'F'
                    } else if (user.gender == 'F') {
                        matchGender = 'M'
                    } else {
                        matchGender = 'F'
                    }

                    pool.query('SELECT m.* FROM members m JOIN likes l ON m.member_id = l.member_id WHERE l.profile_id = ? AND m.member_id NOT IN ( SELECT profile_id FROM likes WHERE member_id = ?) AND m.member_id NOT IN ( SELECT member_id FROM likes WHERE (match_id = ?))', [memberId, memberId, memberId], (err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(results);
                    });

                } else {
                    return resolve({ status: '400', message: 'NOT FOUND' });
                }
            }
        );
    });
};

crudsObj.getMatchesById = (memberId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT m.* FROM members m JOIN likes l ON (m.member_id = l.member_id OR m.member_id = l.match_id) WHERE ((l.member_id = ? OR l.match_id = ?) AND m.member_id != ?)', [memberId, memberId, memberId], (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(results);
            return resolve(results);
        });
    });
};



crudsObj.deleteMember = (memberId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM members WHERE MemberID = ?', [memberId], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve({ status: '200', message: 'Member deleted successfully' });
        });
    });
};

module.exports = crudsObj;