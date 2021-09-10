const { Book, User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
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
      return User.findOne({ username }).select("-__v -password");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);

      return user;
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

      return user;
    },
  },
};

module.exports = resolvers;
