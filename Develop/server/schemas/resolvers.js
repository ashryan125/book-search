const { Book, User } = require("../models");

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
        return User.find()
            .select('-__v -password')
            .populate('savedBooks')
    },
    // return single user
    user: async (parent, { username }) => {
        return User.findOne({ username })
            .select('-__v -password')
    }
  },
};

module.exports = resolvers;
