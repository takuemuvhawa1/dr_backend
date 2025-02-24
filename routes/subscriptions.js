const express = require('express');
const subscriptionsRouter = express.Router();
const subscriptionsDbOperations = require('../cruds/subscriptions');
const authenticateToken = require('../utilities/authenticateToken'); 


// Create a new subscription
subscriptionsRouter.post('/', async (req, res) => {
    try {
        const { member_id, amount, exp_date } = req.body;
        const results = await subscriptionsDbOperations.postSubscription(member_id, amount, exp_date);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// // Get all subscriptions
// subscriptionsRouter.get('/', authenticateToken, async (req, res) => {
//     try {
//         const results = await subscriptionsDbOperations.getSubscriptions();
//         res.json(results);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// // Get subscription by ID
// subscriptionsRouter.get('/:id', authenticateToken, async (req, res) => {
//     try {
//         const id = req.params.id;
//         const result = await subscriptionsDbOperations.getSubscriptionById(id);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// Get subscription by member ID AND Course
subscriptionsRouter.get('/member/:memberId/:currentDate', async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const currentDate = req.params.currentDate;
        const result = await subscriptionsDbOperations.getSubscriptionByMemberId(memberId, currentDate);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get subscription by ref id
subscriptionsRouter.get('/ref/:memberId/:currentDate', async (req, res) => {
    try {
        const refId = req.params.memberId;
        const currentDate = req.params.currentDate;
        const result = await subscriptionsDbOperations.getSubscriptionByRefId(refId, currentDate);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get sales by ref id
subscriptionsRouter.get('/sales/:memberId', async (req, res) => {
    try {
        const refId = req.params.memberId;
        const result = await subscriptionsDbOperations.getSalesByRefId(refId);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// // Get All subscription by member ID
// subscriptionsRouter.get('/member/:memberId/:currentDate', authenticateToken, async (req, res) => {
//     try {
//         const memberId = req.params.memberId;
//         const currentDate = req.params.currentDate;
//         const result = await subscriptionsDbOperations.getAllSubscriptionByMemberIdAndCourse(memberId, currentDate);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// // Get All subscription by module
// subscriptionsRouter.get('/module/mod/:module/:currentDate', authenticateToken, async (req, res) => {
//     try {
//         const moduleId = req.params.module;
//         const currentDate = req.params.currentDate;
//         const result = await subscriptionsDbOperations.getAllSubscriptionByModule(moduleId, currentDate);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// // Get All subscription by course
// subscriptionsRouter.get('/course/mod/:course/:date', authenticateToken, async (req, res) => {
//     try {
//         const courseId = req.params.course;
//         const date = req.params.date;
//         const result = await subscriptionsDbOperations.getAllSubscriptionByCourse(courseId, date);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// // Get All subscription by course
// subscriptionsRouter.get('/college/mod/:college/:date', authenticateToken, async (req, res) => {
//     try {
//         const collegeId = req.params.college;
//         const date = req.params.date;
//         const result = await subscriptionsDbOperations.getAllSubscriptionByCollege(collegeId, date);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// // Get All subscription by member ID
// subscriptionsRouter.get('/member/:memberId', authenticateToken, async (req, res) => {
//     try {
//         const memberId = req.params.memberId;
//         const result = await subscriptionsDbOperations.getAllSubscriptionByMemberIdAndCourse(memberId);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// // Update subscription by ID
// subscriptionsRouter.put('/:id', authenticateToken, async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { course_id, member_id, exp_date } = req.body;
//         const result = await subscriptionsDbOperations.updateSubscription(id, course_id, member_id, exp_date);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// // Delete subscription by ID
// subscriptionsRouter.delete('/:id', authenticateToken, async (req, res) => {
//     try {
//         const id = req.params.id;
//         const result = await subscriptionsDbOperations.deleteSubscription(id);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

module.exports = subscriptionsRouter;
