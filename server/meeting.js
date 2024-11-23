const express = require('express');
const meetingRouter = express.Router();
const db = require('./db');


meetingRouter.get('/', (req, res) => {
    const allMeetings = db.getAllFromDatabase('meetings');
    res.send(allMeetings);
});

meetingRouter.post('/', (req, res) => {
  
   const newMeeting = db.createMeeting();
    const addedMeeting = db.addToDatabase('meetings', newMeeting);
    res.status(201).send(addedMeeting);
});


meetingRouter.delete('/', (req, res) => {
    db.deleteAllFromDatabase('meetings');
    res.status(204).send({message: 'All meetings deleted'});
})


module.exports = meetingRouter;