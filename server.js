const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const exercisesPath = path.join(__dirname, 'exercises.json');
const usersRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/css', express.static(path.join(__dirname, 'src/css')));

app.use('/components', express.static(path.join(__dirname, 'src/components')));

app.use('/img', express.static(path.join(__dirname, 'src/components/img')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/components/LoginPage.html'));

});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/api/users', usersRoutes);
app.use('/api/ai-chat', aiRoutes);

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/components/RegisterPage.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/components/MainPage.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/components/ProfilePage.html'));
});

app.get('/routines', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/components/RoutinesPage.html'));
});

app.get('/logout', (req, res) => {
  res.clearCookie('sessionId'); 
  res.redirect('/');
});

app.get('/api/exercises', (req, res) => {
  fs.readFile(exercisesPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Ne mogu učitati vježbe.' });
    res.json(JSON.parse(data));
  });
});

app.use((req, res) => {
    res.status(404).send("Stranica nije pronađena");
});

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
