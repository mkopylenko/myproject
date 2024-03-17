const bcrypt = require ('bcrypt');
const jwt = require("jsonwebtoken")
const users = [
    { id: 1, name: 'Hadi Soufan' },
    { id: 2, name: 'Melia Malik' },
    { id: 3, name: 'Zayn Cerny' }
  ];

  // @desc    login
  // @route   POST /api/v1/login
  // @access  Public
  exports.login = async (req,res) => {
    const user = users.find(user => user.name == req.body.name);
    //check to see if the user exists in the list of registered users
    if (user == null)
    { 
        res.status(404).send ("User does not exist!");
        return;
    }
    //if user does not exist, send a 400 response
    if (await bcrypt.compare(req.body.password, user.password)) {
    const accessToken = generateAccessToken ({user: req.body.name})
    const refreshToken = generateRefreshToken ({user: req.body.name})
    res.json ({accessToken: accessToken, refreshToken: refreshToken})
    } 
    else {
    res.status(401).send("Password Incorrect!")
    }
    }

    // @desc    refreshToken
  // @route   POST /api/v1/refreshToken
  // @access  Public
    exports.refreshToken= (req,res) => {
        if (!refreshTokens.includes(req.body.token)) res.status(400).send("Refresh Token Invalid");
        refreshTokens = refreshTokens.filter( (c) => c != req.body.token);
        //remove the old refreshToken from the refreshTokens list
        const accessToken = generateAccessToken ({user: req.body.name})
        const refreshToken = generateRefreshToken ({user: req.body.name})
        //generate new accessToken and refreshTokens
        res.json ({accessToken: accessToken, refreshToken: refreshToken})
        };
  
  // @desc    Get all users
  // @route   GET /api/v1/users
  // @access  Public
  exports.getUsers =  (req, res) => {

    res.status(200).json({ success: true, count: users.length, data: users});
  };
  
  // @desc    Create new user
  // @route   POST /api/v1/create
  // @access  Public
  exports.createUser = async (req, res) => {
    
  
    /* Generate a new ID for the user */
    const id = users.length + 1;
    const { name, hashedPassword } = await assignNamePassword(req);
    /* Add the new user to the users array */
    users.push({id: id, name: name, password: hashedPassword});
  
    /* Send a JSON response with a success message */
    res.status(201).json({ success: true, user: { id, name}, message: 'User created successfully' });
  
  };
  
  // @desc    Update a user
  // @route   PATCH /api/v1/users/:id
  // @access  Public
  exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, hashedPassword } = await assignNamePassword(req);
  
    /* Find the user with the specified ID */
    const user = users.find(user => user.id == id);
  
    if (user) {
      /* Update the user's name pass*/
     user.name = name;
     user.hashedPassword = hashedPassword;
  
      /* Send a JSON response with a success message and the updated user */
      res.json({ message: 'User updated successfully', user });
    } else {
      
      /* If no user with the specified ID was found, send a 404 response */
      res.status(404).json({ message: `User with ID ${id} not found` });
    }
  };
  
  // @desc    Delete a user
  // @route   DELETE /api/v1/users/:id
  // @access  Public
  exports.deleteUser = (req, res) => {
    const id = req.params.id;
  
    /* Find the index of the user with the specified ID */
    const index = users.findIndex(user => user.id == id);
  
    if (index != -1) {
      /* Remove the user from the users array */
      users.splice(index, 1);
  
      /* Send a JSON response with a success message */
      res.json({ message: 'User deleted successfully' });
    } else {
      /* If no user with the specified ID was found, send a 404 response */
      res.status(404).json({ message: `User with ID ${id} not found` });
    }
  };

async function assignNamePassword(req) {
    const name = req.body.name;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    return { name, hashedPassword };
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}); 
    }

    // refreshTokens
    let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken = 
    jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"});
    refreshTokens.push(refreshToken);
    return refreshToken;
    }

