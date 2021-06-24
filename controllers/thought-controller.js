const { User, Thought } = require('../models');

const thoughtController = {

  // GET all thoughts api/thoughts
  getAllThoughts(req, res) {
    Thought.find({})
        .populate({
          path: 'user',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.status(400).json(err));
  },

  // GET specific thought api/thoughts/:id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
        .populate({ path: 'user', select: '-__v'})
        .select('-__v')
        .then(thoughtData => {
          if (!thoughtData) {
            res.status(404).json({ message: 'No thought found with that ID!' });
            return;
          }
          res.json(thoughtData);
        })
        .catch(err => res.status(400).json(err));
  },

  // POST new thought api/thoughts
  createThought({ body }, res) {
    Thought.create(body)
        .then(thoughtData => {
          User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: thoughtData._id } },
            { new: true }
          )
        })
        .then(userData => {
          if (!userData) {
            res.status(404).json({ message: 'No user found with that ID!' });
            return;
          }
          res.json(userData);
        })
        .catch(err => res.status(400).json(err));
  },

  // PUT to update thought api/thoughts/:id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    })
    .then(thoughtData => {
      if (!thoughtData) {
        res.status(404).json({ message: 'No thought found with this ID!' });
        return;
      }
      res.json(thoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

  // DELETE thought api/thoughts/:id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
        .then(thoughtData => {
          if (!thoughtData) {
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
          }
          // delete reference from associated user
          User.findOneAndUpdate(
            { username: thoughtData.username },
            { $pull: { thoughts: params.id } }
          )
          .then(() => res.json({ message: 'Thought successfully deleted!' }));
        })
        .catch(err => res.status(400).json(err));
  },

  // POST add reaction to thought api/thoughts/:thoughtId/reactions
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, rundValidators: true }
    )
    .then(thoughtData => {
      if (!thoughtData) {
        res.status(404).json({ message: 'No thought found with this ID!' });
        return;
      }
      res.json(thoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

  // DELETE reaction from thought api/thoughts/:thoughtId/:reactionId
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
    .then(thoughtData => {
      if (!thoughtData) {
        res.status(404).json({ message: 'No thought found with this ID!' });
        return;
      }
      res.json(thoughtData);
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;