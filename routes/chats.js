const express = require('express');
const chatsRouter = express.Router();
const chatsDbOperations = require('../cruds/chats');

// Create a new prayer request
chatsRouter.post('/', async (req, res) => {
    try {
        const postedValues = req.body;
        const results = await chatsDbOperations.postChat(
            postedValues.member_id,
            postedValues.recepient_id
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all prayer requests
chatsRouter.get('/', async (req, res) => {
    try {
        const results = await chatsDbOperations.getChats();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get a prayer request by ID
chatsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await chatsDbOperations.getChatById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update a prayer request by ID
chatsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedValues = req.body;
        const result = await chatsDbOperations.updateChat(
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
chatsRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await chatsDbOperations.deleteChat(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = chatsRouter;
