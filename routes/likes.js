const express = require('express');
const likesRouter = express.Router();
const likesDbOperations = require('../cruds/likes');

// Create a new prayer request
likesRouter.post('/', async (req, res) => {
    try {
        const postedValues = req.body;
        const results = await likesDbOperations.postLike(
            postedValues.member_id,
            postedValues.profile
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all prayer requests
likesRouter.get('/', async (req, res) => {
    try {
        const results = await likesDbOperations.getLikes();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get a prayer request by ID
likesRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await likesDbOperations.getLikeById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update a prayer request by ID
likesRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedValues = req.body;
        const result = await likesDbOperations.updateLike(
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
likesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await likesDbOperations.deleteLike(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = likesRouter;
