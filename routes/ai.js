const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { question, userData } = req.body;

    const response = {
        answer: "AI odgovor ovdje (mock)",
        originalQuestion: question,
        userData: userData
    };

    res.json(response);
});

module.exports = router;