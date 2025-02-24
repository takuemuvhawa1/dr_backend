const express = require('express');
const resultsRouter = express.Router();
const resultsDbOperations = require('../cruds/results');

// Create a new result
resultsRouter.post('/', async (req, res) => {
    try {
        const { module_id, student_id, assignment_id, marks, total_possible, percentage, grade } = req.body;
        console.log(req.body);
        const results = await resultsDbOperations.postResult(module_id, student_id, assignment_id, marks, total_possible, percentage, grade);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all results
resultsRouter.get('/', async (req, res) => {
    try {
        const results = await resultsDbOperations.getResults();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get result by ID
resultsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await resultsDbOperations.getResultById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }   
});

// Get result by student ID
resultsRouter.get('/mod/:modID/:stuID', async (req, res) => {
    try {
        const modID = req.params.modID;
        const stuID = req.params.stuID;
        const result = await resultsDbOperations.getResultStudentById(modID, stuID);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get result by student ID
resultsRouter.get('/mod/:modID/', async (req, res) => {
    try {
        const modID = req.params.modID;
        const result = await resultsDbOperations.getResultModuleById(modID);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update result by ID
resultsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { module_id, student_id, assignment_id, marks, percentage, grade, date } = req.body;
        const result = await resultsDbOperations.updateResult(id, module_id, student_id, assignment_id, marks, percentage, grade, date);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete result by ID
resultsRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await resultsDbOperations.deleteResult(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = resultsRouter;
