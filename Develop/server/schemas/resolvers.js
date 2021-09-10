const { Book } = require("../models");

const resolvers = {
  Query: {
    books: async (parent, { username }) => {
        const params = username ? { username } : {};
      return Book.find();
    },
  },
};

module.exports = resolvers;
