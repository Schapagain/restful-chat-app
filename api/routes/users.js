const express = require('express');
const router = express.Router();


router.get('/',(req,res,next) => {
    res.status(200).json({
        message: "Users were fetched"
    })
});

router.post('/',(req,res,next) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        cellNumber: req.body.cellNumber,
    }
    res.status(201).json({
        message: "User was created",
        user,
    })
});

router.get('/:userId', (req,res,next) => {
    const id = req.params.userId;
    res.status(200).json({
        id,
        message: 'User was fetched'
    })
});

router.patch('/:userId', (req,res,next) => {
    const id = req.params.userId;
    res.status(200).json({
        id,
        message: 'User was updated'
    })
});

router.delete('/:userId', (req,res,next) => {
    const id = req.params.userId;
    res.status(200).json({
        id,
        message: 'User was deleted'
    })
});

module.exports = router;