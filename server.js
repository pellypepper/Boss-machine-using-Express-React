const express = require('express');
const app = express();

const minionRouter = require('./server/minionroute');
const ideasRouter = require('./server/idearoute');

const meetingRouter = require('./server/meeting');

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;

// Add middleware for handling CORS requests from index.html
const cors = require('cors');
app.use(cors()); 


// Add middware for parsing request bodies here:
const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.use('/api/minions', minionRouter);
app.use('/api/ideas', ideasRouter);
app.use('/api/meetings', meetingRouter);
// This conditional is here for testing purposes:
if (!module.parent) { 
  // Add your code to start the server listening at PORT below:
 app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
}
 )};

 module.exports = app;