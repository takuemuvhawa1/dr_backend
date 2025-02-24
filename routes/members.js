const express = require('express');
const memberRouter = express.Router();
const membersDbOperations = require('../cruds/members');

memberRouter.get('/', async (req, res) => {
    try {
        const results = await membersDbOperations.getMembers();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

memberRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const result = await membersDbOperations.getMemberById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

memberRouter.get('/ref/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const result = await membersDbOperations.getMembersByRefId(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

memberRouter.get('/potentials/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("ID",id);
        const result = await membersDbOperations.getPotentialsById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

memberRouter.get('/likes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("ID",id);
        const result = await membersDbOperations.getLikesById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

memberRouter.get('/matches/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("ID",id);
        const result = await membersDbOperations.getMatchesById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

memberRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await membersDbOperations.deleteMember(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = memberRouter;
