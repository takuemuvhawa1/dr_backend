const express = require('express');
const messagesRouter = express.Router();
const messagesDbOperations = require('../cruds/messages');

// Create a new prayer request
messagesRouter.post('/', async (req, res) => {
    try {
        const postedValues = req.body;
        const results = await messagesDbOperations.postMessage(
            postedValues.member_id,
            postedValues.chat_id,
            postedValues.text
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get messages request by ID
messagesRouter.get('/:chat_id/:member_id', async (req, res) => {
    try {
        const chat_id = req.params.chat_id;
        const member_id = req.params.member_id;
        const result = await messagesDbOperations.getMessageById(chat_id, member_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update a prayer request by ID
messagesRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedValues = req.body;
        const result = await messagesDbOperations.updateMessage(
            id,
            updatedValues.MemberID,
            updatedValues.requestnotes
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete a prayer request by ID
messagesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await messagesDbOperations.deleteMessage(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = messagesRouter;
