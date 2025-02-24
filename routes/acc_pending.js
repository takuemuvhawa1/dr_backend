const express = require('express');
const pendingRouter = express.Router();
const pendingDbOperations = require('../cruds/acc_pending');
const authenticateToken = require('../utilities/authenticateToken'); 

// Create a new record
pendingRouter.post('/', async (req, res) => {
    try {
        const { member_id, amount, details } = req.body;
        console.log(req.body);
        const pending = await pendingDbOperations.postPending(member_id, amount, details );
        res.json(pending);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

pendingRouter.post('/settle/acc', authenticateToken, async (req, res) => {
    try {
        const { member_id, amount, details } = req.body;
        console.log(req.body);
        const pending = await pendingDbOperations.postPendingSettle(member_id, amount, details );
        res.json(pending);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// Get result by ID
pendingRouter.get('/bal/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pendingDbOperations.getPendingBal(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete pending record by ID
pendingRouter.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pendingDbOperations.deletePending(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = pendingRouter;
