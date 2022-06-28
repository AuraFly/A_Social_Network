const { User, Thought } = require("../models");

module.exports = {
  //This will get all users. Try (get) http://localhost:3001/api/users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  //This will get a single user by ID. Try (get) http://localhost:3001/api/users/IDgoeshere
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      //Using this value for select from an example in the mini-project, but as I understand it this is a versioning value applied to generated data in mongoose and the select statement is removing it.
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "How sure are you of that ID? Check again.",
            })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //This will create a user. Try posting JSON to http://localhost:3001/api/users/
  //   {
  //     "username": "TestingThis",
  //   "email": "test@test.com"
  // }

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  //Updates user info. Try PUT JSON with the id of the record you got above to http://localhost:3001/api/users/IDgoeshere
  //   {
  //     "username": "TestThisInstead",
  //   "email": "test2@test.com"
  // }
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "How sure are you of that ID? Check again.",
            })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Adds a friend. Try a POST to http://localhost:3001/api/users/IDGOESHERE/friends/OTHERIDGOESHERE
  //--OR--
  //Try a PUT JSON to http://localhost:3001/api/users/IDgoeshere
  //!!WARNING!! THIS IS A PUT SO IT WILL UPDATE TO ONLY WHATEVER YOU PUT IN THERE!
  // {
  //   "friends": ["anotheridgoeshere"]
  // }
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "How sure are you of that ID? Check again.",
            })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //Removes a friend from a user. Try a DELETE to http://localhost:3001/api/users/IDGOESHERE/friends/IDGOESHERE
  //Alternately, you can do a PUT JSON to the user but enter a blank array.
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "How sure are you of that ID? Check again.",
            })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //DESTROYS A USER! BWAHAHAHA. Ahem, kidding, but yes this does delete a user and any associated thoughts tied to that ID.
  //Try Delete with the id of the record you used above to http://localhost:3001/api/users/IDgoeshere

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "How sure are you of that ID? Check again.",
            })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({
          message:
            "You have eliminated that user and silenced their thoughts! How rude.",
        })
      )
      .catch((err) => res.status(500).json(err));
  },
};
