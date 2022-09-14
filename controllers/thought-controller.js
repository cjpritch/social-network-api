const { Thoughts, User } = require('../models')

const thoughtController = {
// get all thoughts 
    getAllThoughts(req,res) {
        Thoughts.find()
            .populate({
                path: 'reactions',
                select: '__v'
            })
            .select('__-v')
            .sort({_id: -1 })
            .then(dbThoughtsData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
// get a thought by ID 
    getThought({ params }, res) {
        Thoughts.findOne({ _id: params.thoughtId })
          .populate({
            path: 'reactions',
            select: '-__v'
          })
          .select('-__v')
          .then(dbThoughtsData => res.json(dbThoughtsData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
      },
// add a thought 
    addThought({ params, body }, res) {      
        Thoughts.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } },
            { new: true }         
            );
            })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
            res.status(404).json({ message: 'No user with this ID' });
            return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },
// update a thought 
    updateThought({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
            res.status(404).json({ message: 'No thought found with this ID' });
            return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },
// add a reaction 
    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
        )
        .then(dbReactionData => {
            if (!dbReactionData) {
            res.status(404).json({ message: 'No thought found with this ID' });
            return;
            }
            res.json(dbReactionData);
        })
        .catch(err => res.json(err));
    },
// remove a thought by ID
    removeThought({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.thoughtId })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought with this ID' });
            }
            return User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { thoughts: params.thoughtId } },
            { new: true }
            );
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this ID' });
            return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
// remove a reaction by ID
    removeReaction({ params }, res) {
        Thoughts.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
        )
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => res.json(err));
    }
    };

module.exports = thoughtController;

