const router = require('express').Router();
const {
  getThought,
  getAllThoughts,  
  addThought,
  removeThought,
  updateThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router.route('/').get(getAllThoughts);

// /api/thought/<thoughtId>
router
.route('/:thoughtId')
.get(getThought);

// /api/thoughts/<userId>
router
.route('/:userId')
.get(getThought)
.put(updateThought)
.post(addThought);


// /api/thoughts/<userId>/<thoughtId>
router
.route('/:userId/:thoughtId')
.post(addReaction)
.delete(removeThought);



// /api/thoughts/<userId>/<thoughtId>/<reactionId>
router
.route('/:userId/:thoughtId/:reactionId')
.delete(removeReaction);

module.exports = router;