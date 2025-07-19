const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/css', express.static(path.join(__dirname, 'src/css')));

app.use('/components', express.static(path.join(__dirname, 'src/components')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/components/MainPage.html'));

});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/components/ProfilePage.html'));
});

const usersRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
app.use('/api/users', usersRoutes);
app.use('/api/ai-chat', aiRoutes);

app.use((req, res) => {
    res.status(404).send("Stranica nije pronađena");
});

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
