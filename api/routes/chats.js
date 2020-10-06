const express = require('express');
const router = express.Router();


router.get('/',(req,res,next) => {
    res.status(200).json({
        message: "Chats were fetched"
    })
});

router.post('/',(req,res,next) => {
    res.status(201).json({
        message: "Chat was created"
    })
});

router.get('/:chatId', (req,res,next) => {
    const id = req.params.chatId;
    res.status(200).json({
        id,
        message: 'You chat the got!'
    })
});

router.delete('/:chatId', (req,res,next) => {
    const id = req.params.chatId;
    res.status(200).json({
        id,
        message: 'Deleted chat!'
    })
});

module.exports = router;