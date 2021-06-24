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

  // PUT to update user api/users/:id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true
    })
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this ID!' });
        return;
      }
      res.json(userData);
    })
    .catch(err => res.status(400).json(err));
  },

  // DELETE user api/users/:id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
        .then(userData => {
          if (!userData) {
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
          }
          res.json(userData);
        })
        .catch(err => res.status(400).json(err));
  },

  // POST add friend to user api/users/:userId/friends/:friendId
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true, rundValidators: true }
    )
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this ID!' });
        return;
      }
      res.json(userData);
    })
    .catch(err => res.status(400).json(err));
  },

  // DELETE friend from user api/users/:userId/friends/:friendId
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this ID!' });
        return;
      }
      res.json(userData);
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = userController;