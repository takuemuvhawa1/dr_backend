require('dotenv').config();
const pool = require('./poolfile');

const LikesObj = {};

LikesObj.postLike = (member_id, profile) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Likes WHERE (member_id = ? AND profile_id =?)',
            [profile, member_id], (err, result) => {
                if (err) {
                    return reject(err);
                } if (result.length > 0) {
                    const user = result[0];
                    pool.query('UPDATE Likes SET match_id = ? WHERE like_id = ?',
                        [member_id, user.like_id],
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve({ status: '201', message: 'Matched successfully' });
                        }
                    );
                } else {
                    pool.query('INSERT INTO Likes(member_id, profile_id) VALUES (?, ?)',
                        [member_id, profile],
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve({ status: '200', message: 'Like added successfully' });
                        }
                    );
                }
            });
    });
};

LikesObj.getLikes = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT p.*, m.name, m.surname FROM Likes p JOIN members m ON m.MemberID = p.MemberID ORDER BY id DESC', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

LikesObj.getLikeById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Likes WHERE MemberID = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

LikesObj.updateLike = (id, MemberID, requestnotes) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE Likes SET MemberID = ?, requestnotes = ? WHERE id = ?',
            [MemberID, requestnotes, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Like request updated successfully' });
            });
    });
};

LikesObj.deleteLike = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM Likes WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Like request deleted successfully' });
        });
    });
};

module.exports = LikesObj;
