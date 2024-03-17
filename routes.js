/* Import the required modules */
const express = require('express');
const router = express.Router();
const path = require('path');
const { getUsers, createUser, updateUser, deleteUser, login } = 
require(path.resolve( __dirname, "./controller.js" ));

/* Define the routes for the CRUD operations using router.route() */
router.route('/users')
  .get(getUsers); // Read: Get all users

  router.route('/login')
  .post(login); 


router.route('/create')
   .post(createUser); // Create: Create a new user  

router.route('/users/:id')
  .patch(updateUser) // Update: Update a user by ID
  .delete(deleteUser); // Delete: Delete a user by ID

/* Export the router for use in other parts of the application */
module.exports = router;