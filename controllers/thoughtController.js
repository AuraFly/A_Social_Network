const { User, Thought, Reaction } = require("../models");

module.exports = {
  //This will get all users. Try (get) http://localhost:3001/api/thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  //This will get a single user by ID. Try (get) http://localhost:3001/api/thoughts/IDgoeshere
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Cannot find that thought! Try again." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //This will create a thought. Try posting JSON to http://localhost:3001/api/thoughts/
  //   {
  //     "username": "UsernameHere",
  //   "thoughtText": "Something profound here"
  // }
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { username: thought.username },
          { $addToSet: { thoughts: thought._id } },
          { runValidators: true, new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Nice thought, but are you sure of that user?",
            })
          : res.json("A deep thought, indeed!")
      )
      .catch((err) => res.status(500).json(err));
  },

  //Updates user info. Try PUT JSON with the id of the record you got above to http://localhost:3001/api/thoughts/IDgoeshere
  //   {
  //     "username": "NewUsernameHere",
  //   "thoughtText": "Something more profound here"
  // }
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Cannot find that thought! Try again." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //Creates a reaction. Try to post to http://localhost:3001/api/thoughts/THOUGHTIDHERE/reactions
  //   {
  //     "username": "NewUsernameHere",
  //   "reactionBody": "Something more witty here"
  // }
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Cannot find that thought! Try again." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //This deletes a reaction. Try a DELETE with JSON to http://localhost:3001/api/thoughts/THOUGHTIDHERE/reactions/
  //   {
  //   "reactionID": "ASSOCIATEDREACTIONID"
  // }
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.body.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Cannot find that thought! Try again." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //This deletes a thought. Try a DELETE to http://localhost:3001/api/thoughts/THOUGHTIDHERE
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Cannot find that thought! Try again." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
