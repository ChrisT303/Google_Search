const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  async getSingleUser({ user = null, params }, res) {
    const condition = user ? { _id: user._id } : { $or: [{ _id: params.id }, { username: params.username }] };
    const foundUser = await User.findOne(condition);

    if (!foundUser) return res.status(400).json({ message: 'Cannot find a user with this id!' });
    res.json(foundUser);
  },
  async createUser({ body }, res) {
    const user = await User.create(body);
    if (!user) return res.status(400).json({ message: 'Something is wrong!' });
    res.json({ token: signToken(user), user });
  },
  async login({ body }, res) {
    const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
    if (!user) return res.status(400).json({ message: "Can't find this user" });
    if (!await user.isCorrectPassword(body.password)) return res.status(400).json({ message: 'Wrong password!' });
    res.json({ token: signToken(user), user });
  },
  async saveBook({ user, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  async deleteBook({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "Couldn't find user with this id!" });
    res.json(updatedUser);
  },
};
