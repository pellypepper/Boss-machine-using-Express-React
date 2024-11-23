const express = require('express');
const ideaRouter = express.Router();
const db = require('./db');

const checkMillionDollarIdea = require('./checkMillionDollarIdea');  // Define this middleware somewhere

// ----------- IDEAS ROUTES -----------

// GET all ideas
ideaRouter.get('/', (req, res) => {
    const allIdeas = db.getAllFromDatabase('ideas');
    res.send(allIdeas);
});

ideaRouter.post('/', checkMillionDollarIdea, (req, res) => {
    const { name, description, numWeeks, weeklyRevenue } = req.body;

    // Validate input
    if (!name || !description || description.trim() === '' || isNaN(numWeeks) || numWeeks <= 0 || isNaN(weeklyRevenue) || weeklyRevenue <= 0) {
        return res.status(400).send({
            error: "Invalid input. Ensure 'name', 'description', 'numWeeks' (positive number), and 'weeklyRevenue' (positive number) are provided correctly."
        });
    }

    // Prepare the new idea object (ID will be auto-assigned if needed)
    const newIdea = { name, description, numWeeks, weeklyRevenue };

    try {
        // Add the new idea to the database
        const addedIdea = db.addToDatabase('ideas', newIdea);
        res.status(201).send(addedIdea);  // Return the added idea
    } catch (error) {
        console.error('Error adding idea:', error);  // Log the error
        res.status(400).send({ error: 'Failed to add idea. Please check the input and try again.' });
    }
});




// GET a specific idea by ID
ideaRouter.get('/:ideaId', (req, res) => {
    const idea = db.getFromDatabaseById('ideas', req.params.ideaId);

    if (!idea) {
        return res.status(404).send({ error: "Idea not found." });
    }

    res.send(idea);
});

// PUT (update) a specific idea by ID
ideaRouter.put('/:ideaId', (req, res) => {
    const ideaId = req.params.ideaId;

    // Validate if ideaId is numeric (or valid according to your needs)
    if (isNaN(ideaId)) {
        return res.status(404).send({ error: "Idea not found." });  // Change from 400 to 404
    }

    const { name, description, numWeeks, weeklyRevenue } = req.body;

    if (!name || !description || isNaN(numWeeks) || isNaN(weeklyRevenue)) {
        return res.status(404).send({ error: "Invalid input. Ensure name, description, numWeeks, and weeklyRevenue are provided correctly." });
    }

    const existingIdea = db.getFromDatabaseById('ideas', ideaId);
    if (!existingIdea) {
        return res.status(404).send({ error: "Idea not found." });
    }

    const updatedIdea = { id: ideaId, name, description, numWeeks, weeklyRevenue };
    const result = db.updateInstanceInDatabase('ideas', updatedIdea);
    res.send(result);
});


// DELETE a specific idea by ID
ideaRouter.delete('/:ideaId', (req, res) => {
    const deleted = db.deleteFromDatabasebyId('ideas', req.params.ideaId);

    if (!deleted) {
        return res.status(404).send({ error: "Idea not found." });
    }

    res.status(204).send({ message: "Deleted successfully" });
});

module.exports = ideaRouter;
