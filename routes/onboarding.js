const express = require('express');
const onBoardingRouter = express.Router();
const onBoardingDbOperations = require('../cruds/onboarding');
const pool = require('../cruds/poolapi');

const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    }
});

const upload = multer({ storage: storage });

const crypto = require('crypto');

const { generateToken, verifyToken } = require('../utilities/jwtUtils');
const authenticateToken = require('../utilities/authenticateToken');

// Create User
onBoardingRouter.post('/', async (req, res) => {
    try {
        const { username, email, password, refId } = req.body;

        // Hash the password using MD5
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        let results = await onBoardingDbOperations.postUser(username, email, hashedPassword, refId);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// onBoardingRouter.put('/details/:memberID', async (req, res) => {
//     try {
//         const memberID = req.params.memberID; // Get memberID from URL parameters
//         const postedValues = req.body;
//         const results = await onBoardingDbOperations.updateMemberDetails(
//             memberID,
//             postedValues.name,
//             postedValues.gender,
//             postedValues.dob,
//             postedValues.bio,
//             postedValues.city,
//             postedValues.country,
//             postedValues.minAge,
//             postedValues.maxAge,
//             postedValues.prefBio,
//         );
//         res.json(results);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// Create User Admin
onBoardingRouter.put('/details/:memberID', upload.single('file'), async (req, res) => {
    console.log("Pont reached")
    try {
        const member_id = req.params.memberID; 
        console.log(member_id)
        const { name, gender, dob, bio, city, country, minAge, maxAge, prefBio  } = req.body;
        console.log(req.body)
        console.log("Point reached")

        let path = req.file ? `${pool}/file/${req.file.filename}` : null;

        let results = await onBoardingDbOperations.updateMemberDetails(name, gender, dob, bio, city, country, minAge, maxAge, prefBio, member_id, path);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

onBoardingRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        let result = await onBoardingDbOperations.authenticateUser(email, hashedPassword);

        if (!result) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate JWT token
        const token = generateToken(result);
        console.log('TOKEN: ', token);
        result.token = token;

        //  // Send user data and token in one response

        //  res.status(result.status).json({ result: result, token });

        // res.append("Authorization", `Bearer ${token}`);
        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

onBoardingRouter.post('/resetpassword', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        console.log(req.body);

        // Hash the password using MD5
        const hashedOldPassword = crypto.createHash('md5').update(oldPassword).digest('hex');
        const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

        let result = await onBoardingDbOperations.resetPassword(email, hashedOldPassword, hashedPassword);
        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

onBoardingRouter.post('/forgotpassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Hash the password using MD5
        const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

        let result = await onBoardingDbOperations.forgotPassword(email, hashedPassword);
        res.status(result.status).json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = onBoardingRouter;
