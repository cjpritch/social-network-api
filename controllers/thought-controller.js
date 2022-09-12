const { Thoughts, User } = require('../models');

const thoughtController = {
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
            res.status(404).json({ message: 'No user with this id!' });
            return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },
    updateThought({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },
    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
        )
        .then(dbReactionData => {
            if (!dbReactionData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(dbReactionData);
        })
        .catch(err => res.json(err));
    },
    removeThought({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.thoughtId })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { thoughts: params.thoughtId } },
            { new: true }
            );
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
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