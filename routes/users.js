const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user = {
        id: userId,
        name: "Davor",
        age: 25
    };
    res.json(user);
});

module.exports = router;