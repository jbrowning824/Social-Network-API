const User = require('../models/User');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}).populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Get a single user by id
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  // Update a user by id
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  // Delete a user by id
  deleteUser: async (req, res) => {
    try {
      const userToDelete = await User.findByIdAndDelete(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
     
      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Add a friend to a user's friend list
  addFriend: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } }, 
        { new: true, runValidators: true }
      ).populate('friends');
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  // Remove a friend from a user's friend list
  removeFriend: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      ).populate('friends'); // Populate to show updated list of friends
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};

module.exports = userController;