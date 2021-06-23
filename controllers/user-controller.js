const { User, Thought } = require('../models');

const userController = {

  // GET all users api/users
  getAllUsers(req, res) {
    User.find({})
        .select('-__v')
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
  },

  // GET specific user api/users/:id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
        .populate([
          { path: 'friends', select: '-__v'},
          { path: 'thoughts', select: '-__v'}
        ])
        .select('-__v')
        .then(userData => {
          if (!userData) {
            res.status(404).json({ message: 'No user with that ID!' });
            return;
          }
          res.json(userData);
        })
        .catch(err => res.status(400).json(err));
  },

  // POST new user api/users
  createUser({ body }, res) {
    User.create(body)
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
  },



}

module.exports = userController;