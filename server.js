/* Import the required modules */
const express = require('express');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const path = require('path');

const router = require(path.resolve( __dirname, "./routes.js" ));
/* Create a new instance of the express application */
const app = express();
app.use(validateToken);
/* Define the port number to listen on, using the PORT environment variable
if available */
const port = process.env.PORT || 3000;

/*Configure the app to use body-parser middleware to parse request bodies */
app.use(express.json());

/* Mount routes */
app.use('/api/v1', router);

/* Start the server and listen on the specified port */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


function validateToken(req, res, next) {
    console.log(req.path);
    const nonSecurePaths = ['/api/v1/login', '/api/v1/refreshToken','/api/v1/create'];
  if (nonSecurePaths.includes(req.path)) 
  {

    return next();
  }
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.sendStatus(400).send("Token not present")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { 
    res.status(403).send("Token invalid")
    }
    else {
    req.user = user
    next() //proceed to the next action in the calling function
    }
    }) //end of jwt.verify()
    } //end of function