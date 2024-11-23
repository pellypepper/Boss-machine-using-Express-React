const express = require('express');
const minionRouter = express.Router();
const db = require('./db');



// GET all minions
minionRouter .get('/', (req, res) => {
    const allMinions = db.getAllFromDatabase('minions');
    res.send(allMinions);
});



// POST /api/minions
minionRouter.post('/', (req, res) => {
    const { name, title, salary } = req.body;

    // Validate input
    if (!name || title === undefined || isNaN(salary) || salary <= 0) {
        return res.status(400).send({ 
            error: "Invalid input. Ensure 'name', 'title', and a positive 'salary' are provided." 
        });
    }

    // Create a new minion object (addToDatabase will handle the id)
    const newMinion = { name, title, salary };

    try {
        // Call addToDatabase (it will handle id assignment and validation)
        const addedMinion = db.addToDatabase('minions', newMinion);
        res.status(201).send(addedMinion);  // Return the created minion
    } catch (error) {
        console.error('Error adding minion:', error);  // Log the error
        res.status(400).send({ error: 'Failed to add minion. Please check the input and try again.' });
    }
});


  





// GET a specific minion by ID
minionRouter .get('/:minionId', (req, res) => {
    const minionId = req.params.minionId;

    // Validate if minionId is numeric (or valid according to your needs)
    if (isNaN(minionId)) {
        return res.status(404).send({ error: "Invalid ID format." });
    }

    const minion = db.getFromDatabaseById('minions', minionId);
    if (!minion) {
        return res.status(404).send({ error: "Minion not found." });
    }

    res.send(minion);
});

// PUT (update) a specific minion by ID
minionRouter.put('/:minionId', (req, res) => {
    const minionId = req.params.minionId;
    const { name, title, salary, weaknesses = "" } = req.body;  // Set a default value for weaknesses

    if (!name || !title || isNaN(salary)) {
        return res.status(404).send({ error: "Invalid input. Ensure name, title, and salary are provided correctly." });
    }

    const existingMinion = db.getFromDatabaseById('minions', minionId);
    if (!existingMinion) {
        return res.status(404).send({ error: "Minion not found." });
    }

    const updatedMinion = { id: minionId, name, title, salary, weaknesses };
    const result = db.updateInstanceInDatabase('minions', updatedMinion);
    res.send(result);
});


// DELETE a specific minion by ID
minionRouter .delete('/:minionId', (req, res) => {
    const deleted = db.deleteFromDatabasebyId('minions', req.params.minionId);

    if (!deleted) {
        return res.status(404).send({ error: "Minion not found." });
    }

    res.status(204).send({ message: "Deleted successfully" });
});

module.exports = minionRouter;