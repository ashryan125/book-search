const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    // return all books
    books: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Book.find();
    },
    // return single book
    book: async (parent, { bookId }) => {
      return Book.findOne({ bookId });
    },
    // return all users
    users: async () => {
      return User.find().select("-__v -password").populate("savedBooks");
    },
    // return single user
    user: async (parent, { username }) => {
      return User.findOne({ username }).select("-__v -password").populate('savedBooks');
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials!");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {

        const updateUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookData } },
            { new: true }
        );

        return updateUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {

            const updateUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId:bookId } } },
                { new: true }
            );
    
            return updateUser;
          }
          throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
