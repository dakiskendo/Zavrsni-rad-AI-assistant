const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../users.json');
const routinesPath = path.join(__dirname, '../routines.json');
const exercisesFile = path.join(__dirname, '../exercises.json');

router.get('/:id', (req, res) => {
  const userId = req.params.id;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Greška pri čitanju users.json", err);
      return res.status(500).json({ message: "Greška na serveru." });
    }
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error("Greška pri parsiranju users.json", parseErr);
      return res.status(500).json({ message: "Greška na serveru." });
    }

    const user = users.find(u => String(u.id) === String(userId));
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    const { password, ...safeUser } = user;
    return res.json(safeUser);
  });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "Email i lozinka su obavezni!"});
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if(err){
            console.error("Greška pri čitanju users.json", err);
            return res.status(500).json({ message: "Greška na serveru."});
        }
        let users = [];
        try{
            users = JSON.parse(data);
        }catch (parseErr) {
            console.error("Greška pri provjeri users.json", parseErr);
            return res.status(500).json({ message: "Greška na serveru"});
        }

        const user = users.find(u => u.email === email && u.password === password);

        if(!user){
            return res.status(401).json({ message: "Neispravan email ili lozinka"});
        }

        return res.json({ message: "Prijava uspješna!", userId: user.id});
    })
});

router.post('/register', (req, res) => {
    const { name, email, password, gender, age, height, weight, activityLevel, medicalConditions } = req.body;

    if (!name || !email || !password || !gender || !age || !height || !weight || !activityLevel) {
        return res.status(400).json({ error: 'Nedostaju obavezna polja!' });
    }

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
        return res.status(400).json({ error: 'Spol mora biti muški ili ženski' });
    }

    const caloricIntake = bmr * parseFloat(activityLevel);

    
    fs.readFile(usersFilePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error("Greška pri čitanju users.json:", err);
            return res.status(500).json({ error: "Greška na serveru." });
        }

        let users = [];
        try {
            users = JSON.parse(fileData);
        } catch (parseErr) {
            console.error("Greška pri parsiranju users.json:", parseErr);
            return res.status(500).json({ error: "Greška na serveru." });
        }

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Korisnik s ovim emailom već postoji!' });
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            gender,
            age,
            height,
            weight,
            activityLevel,
            medicalConditions,
            basalMetabolicRate: bmr,
            caloricIntake
        };

        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error("Greška pri unošenju korisnika u bazu podataka: ", writeErr);
                return res.status(500).json({ error: 'Greška na serveru' });
            }

            return res.status(201).json({ message: 'Uspješna registracija!' });
        });
    });
});

router.post('/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: "Server error reading users." });

    let users;
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: "Server error parsing users." });
    }

    const index = users.findIndex(u => u.id === parseInt(userId));
    if (index === -1) return res.status(404).json({ error: "User not found." });

    let bmr;
    if (updatedData.gender === 'male') {
      bmr = 10 * updatedData.weight + 6.25 * updatedData.height - 5 * updatedData.age + 5;
    } else if (updatedData.gender === 'female') {
      bmr = 10 * updatedData.weight + 6.25 * updatedData.height - 5 * updatedData.age - 161;
    } else {
      return res.status(400).json({ error: "Spol mora biti muški ili ženski." });
    }

    const caloricIntake = bmr * parseFloat(updatedData.activityLevel);

    users[index] = {
      ...users[index],
      ...updatedData,
      id: userId,
      basalMetabolicRate: bmr,
      caloricIntake: caloricIntake
    };

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Error saving user data." });
      res.json({ message: "User updated successfully." });
    });
  });
});

router.get('/:id/routines', (req, res) => {
    const userId = req.params.id;

    fs.readFile(routinesPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Greška pri čitanju rutina:", err);
            return res.status(500).json({ error: 'Greška na serveru.' });
        }

        let allRoutines = [];
        try {
            allRoutines = JSON.parse(data);
        } catch (parseErr) {
            console.error("Greška pri parsiranju rutina:", parseErr);
            return res.status(500).json({ error: 'Greška na serveru.' });
        }

        const userRoutines = allRoutines.find(u => String(u.userId) === String(userId));
        
        if (!userRoutines) {
            return res.json({ routines: [] });
        }

        return res.json(userRoutines);
    });
});

router.post('/:id/routines', (req, res) => {
    const userId = req.params.id;
    const { name, id, exercises } = req.body; 

    fs.readFile(routinesPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Greška pri čitanju rutina.' });

        let allRoutines = [];
        try {
            allRoutines = JSON.parse(data);
        } catch {
            return res.status(500).json({ error: 'Greška pri parsiranju rutina.' });
        }

        let user = allRoutines.find(u => String(u.userId) === String(userId));

        if (!user) {
            user = { userId, routines: [] };
            allRoutines.push(user);
        }

        if (name) {
          const newRoutine = {
                id: Date.now(),
                name,
                exercises: []
            };
            user.routines.push(newRoutine);
            fs.writeFile(routinesPath, JSON.stringify(allRoutines, null, 2), (err) => {
                if (err) return res.status(500).json({ error: 'Greška pri spremanju rutina.' });
                res.json({ message: 'Rutina dodana.', routineId: newRoutine.id });
            });
        } else {
            return res.status(400).json({ error: 'Naziv rutine je obavezan za kreiranje nove rutine.' });
        }
    });
});

router.post('/:id/routines/:routineId/add-exercise', (req, res) => {
    const userId = req.params.id;
    const routineId = req.params.routineId;
    const newExercise = req.body;

    fs.readFile(routinesPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Greška pri čitanju rutina.' });
        let allRoutines = JSON.parse(data);
        const userIndex = allRoutines.findIndex(u => String(u.userId) === String(userId));

        if (userIndex === -1) {
            return res.status(404).json({ error: 'Korisnik nije pronađen.' });
        }

        const routine = allRoutines[userIndex].routines.find(r => String(r.id) === String(routineId));

        if (!routine) {
            return res.status(404).json({ error: 'Rutina nije pronađena.' });
        }

        if (!routine.exercises) {
            routine.exercises = [];
        }

        routine.exercises.push(newExercise);

        fs.writeFile(routinesPath, JSON.stringify(allRoutines, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Greška pri spremanju vježbe.' });
            res.json({ message: 'Vježba dodana u rutinu.' });
        });
    });
});

router.get('/exercises', (req, res) => {
  fs.readFile(exercisesFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Greška pri čitanju exercises.json", err);
      return res.status(500).json({ message: "Greška na serveru." });
    }
    try {
      const exercises = JSON.parse(data);
      res.json(exercises);
    } catch (parseErr) {
      console.error("Greška pri parsiranju exercises.json", parseErr);
      res.status(500).json({ message: "Greška pri parsiranju podataka." });
    }
  });
});

module.exports = router;