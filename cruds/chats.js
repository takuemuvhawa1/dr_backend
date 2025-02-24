require('dotenv').config();
const pool = require('./poolfile');

const ChatsObj = {};

ChatsObj.postChat = (member_id, recepient_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM chats WHERE ((p1 = ? AND p2 =?) OR (p1 = ? AND p2 =?))',
            [member_id, recepient_id, recepient_id, member_id], (err, result) => {
                if (err) {
                    return reject(err);
                } if (result.length > 0) {
                    const chat = result[0];
                    console.log(chat)

                    let id = 0;
                    let p1 = 0;
                    let p2 = 0;

                    id = member_id;
                    p1 = chat.p1;
                    p2 = chat.p2;

                    // console.log('MEMBER ID',member_id);
                    // console.log('CHAT P1',chat.p1);
                    // console.log(id == p1);
                    if (id == p1) {
                        pool.query('UPDATE chats SET p1_open = ? WHERE chat_id = ?',
                            [1, chat.chat_id],
                            (err, result) => {
                                if (err) return reject(err);
                                return resolve({ status: '201', message: 'Chat available', chat_id: chat.chat_id });
                            }
                        );
                    } else if (id == p2) {
                        pool.query('UPDATE chats SET p2_open = ? WHERE chat_id = ?',
                            [1, chat.chat_id],
                            (err, result) => {
                                if (err) return reject(err);
                                return resolve({ status: '201', message: 'Chat available', chat_id: chat.chat_id });
                            }
                        );
                    }
                } else {
                    pool.query('INSERT INTO chats(p1, p2) VALUES (?, ?)',
                        [member_id, recepient_id],
                        (err, result) => {
                            if (err) return reject(err);
                            const chat_id = result.insertId;
                            return resolve({ status: '200', message: 'Chat added successfully', chat_id });
                        }
                    );
                }
            });
    });
};

ChatsObj.getChats = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT p.*, m.name, m.surname FROM Chats p JOIN members m ON m.MemberID = p.MemberID ORDER BY id DESC', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
        
    });
};

ChatsObj.getChatById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT c.*, m.*, last_msg.* FROM Chats c JOIN members m ON m.member_id = CASE WHEN c.p1 = ? THEN c.p2 ELSE c.p1 END AND(c.p1 = ? OR c.p2 = ?) JOIN( SELECT msg1.*, ROW_NUMBER() OVER( PARTITION BY msg1.chat_id ORDER BY msg1.message_id DESC ) AS rn FROM messages msg1) AS last_msg ON c.chat_id = last_msg.chat_id AND last_msg.rn = 1 WHERE last_msg.chat_id = c.chat_id AND(c.p1 = ? OR c.p2 = ?) ORDER BY last_msg.message_id DESC', [id, id, id, id, id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};
// ChatsObj.getChatById = (id) => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT c.*, m.*, last_msg.* FROM Chats c JOIN members m ON m.member_id = CASE WHEN c.p1 = ? THEN c.p2 ELSE c.p1 END AND (c.p1 = ? OR c.p2 = ?) JOIN ( SELECT msg1.*, ROW_NUMBER() OVER ( PARTITION BY msg1.chat_id ORDER BY msg1.message_id DESC ) AS rn FROM messages msg1 ) AS last_msg ON c.chat_id = last_msg.chat_id WHERE last_msg.rn = ? AND (c.p1 = ? OR c.p2 = ?) ORDER BY last_msg.message_id DESC;', [id, id, id, id, id, id], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };
// ChatsObj.getChatById = (id) => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT c.*, m.*, last_msg.* FROM Chats c JOIN members m ON m.member_id = CASE WHEN c.p1 = ? THEN c.p2 ELSE c.p1 END AND (c.p1 = ? OR c.p2 = ?) JOIN ( SELECT msg1.*, ROW_NUMBER() OVER ( PARTITION BY msg1.chat_id ORDER BY msg1.message_id DESC ) AS rn FROM messages msg1 ) AS last_msg ON c.chat_id = last_msg.chat_id WHERE last_msg.rn = ? AND (c.p1 = ? OR c.p2 = ?);', [id, id, id, id, id, id], (err, results) => {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// };

ChatsObj.updateChat = (id, MemberID, requestnotes) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE Chats SET MemberID = ?, requestnotes = ? WHERE id = ?',
            [MemberID, requestnotes, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Chat request updated successfully' });
            });
    });
};

ChatsObj.deleteChat = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM Chats WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Chat request deleted successfully' });
        });
    });
};

module.exports = ChatsObj;
