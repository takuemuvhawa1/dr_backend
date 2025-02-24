const express = require('express');
const userRouter = express.Router();
const usersDbOperations = require('../cruds/users');

const crypto = require('crypto');

const { generateToken, verifyToken } = require('../utilities/jwtUtils');
const authenticateToken = require('../utilities/authenticateToken');

// Create User
userRouter.post('/', async (req, res) => {
    try {
        const { user_name, surname, email, role, phone, address } = req.body;
        console.log(req.body);
        let results = await usersDbOperations.postUser(user_name, surname, email, role, phone, address);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

userRouter.post('/resetpassword', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Hash the password using MD5
        const hashedOldPassword = crypto.createHash('md5').update(oldPassword).digest('hex');
        const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

        let result = await usersDbOperations.resetPassword(email, hashedOldPassword, hashedPassword);
        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        let result = await usersDbOperations.authenticateUser(email, hashedPassword);


        if (!result) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate JWT token
        const token = generateToken(result);
        console.log('TOKEN: ', token);

        // Send user data and token in one response
        //  res.json({ result: result, token });

        // Add the token to the result object
        result.token = token; // Add the token as a new property to the result object

        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get All Users
userRouter.get('/', async (req, res) => {
    try {
        let results = await usersDbOperations.getUsers();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get User by ID
userRouter.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let result = await usersDbOperations.getUserById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Update User
userRouter.put('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const { user_name, surname, email, password, role, phone, address } = req.body;
        let result = await usersDbOperations.updateUser(id, user_name, surname, email, password, role, phone, address);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete User
userRouter.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let result = await usersDbOperations.deleteUser(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = userRouter;
