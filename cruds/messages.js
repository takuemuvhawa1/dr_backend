require('dotenv').config();
const pool = require('./poolfile');

const MessagesObj = {};

MessagesObj.postMessage = (member_id, chat_id, text) => {
    return new Promise((resolve, reject) => {
        let recipient_id = 0;
        pool.query('SELECT * FROM chats WHERE chat_id = ?',
            [chat_id], (err, result) => {
                if (err) {
                    return reject(err);
                } if (result.length > 0) {
                    const user = result[0];
                    console.log('Member: ', member_id)
                    console.log(user.p1)
                    if (member_id == user.p1) {
                        recipient_id = user.p2
                    } else {
                        recipient_id = user.p1
                    }

                    console.log('Recepient: ', recipient_id)

                    pool.query('INSERT INTO messages (chat_id, text, sender_id, recipient_id) VALUES (?, ?, ?, ?)',
                        [chat_id, text, member_id, recipient_id],
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve({ status: '201', message: 'sent successfully' });
                        }
                    );
                } else {
                    return resolve({ status: '400', message: 'Chat not found' });
                }
            });
    });
};

MessagesObj.getMessages = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT p.*, m.name, m.surname FROM Messages p JOIN members m ON m.MemberID = p.MemberID ORDER BY id DESC', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

MessagesObj.getMessageById = (chat_id, member_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT msg.*, CASE WHEN ? = msg.sender_id THEN r.member_id ELSE s.member_id END as other_member_id, CASE WHEN ? = msg.sender_id THEN r.name ELSE s.name END as other_member_name, CASE WHEN ? = msg.sender_id THEN r.profile_pic ELSE s.profile_pic END as other_member_profile FROM messages msg JOIN members s ON msg.sender_id = s.member_id JOIN members r ON msg.recipient_id = r.member_id WHERE msg.chat_id = ? AND (? IN (msg.sender_id, msg.recipient_id)) LIMIT 0, 25;', [member_id, member_id, member_id, chat_id, member_id], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

MessagesObj.updateMessage = (id, MemberID, requestnotes) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE Messages SET MemberID = ?, requestnotes = ? WHERE id = ?',
            [MemberID, requestnotes, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: '200', message: 'Message request updated successfully' });
            });
    });
};

MessagesObj.deleteMessage = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM Messages WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            return resolve({ status: '200', message: 'Message request deleted successfully' });
        });
    });
};

module.exports = MessagesObj;
