// middlewares/checkMillionDollarIdea.js

const checkMillionDollarIdea = (req, res, next)=> {
    const { numWeeks, weeklyRevenue } = req.body;

    if (numWeeks && weeklyRevenue && numWeeks * weeklyRevenue >= 1000000) {
        // Proceed if the idea is worth a million dollars
        return next();
    }

    res.status(400).send({ error: "Idea does not meet million-dollar threshold." });
}

module.exports = checkMillionDollarIdea;
