const HelpRequestPostModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestPost.model.server.js");

const helpRequestCommentResolvers = {
  // Post: {},

  // Comment: {},

  // Resident: {},

  Query: {
    // getHelpRequestPost(id: ID!): HelpRequestPost
    getHelpRequestPost: async (_, { id }) => {
      return await HelpRequestPostModel.findById(id);
    },
    // getHelpRequestPosts: [HelpRequestPost!]!
    getHelpRequestPosts: async () => {
      return await HelpRequestPostModel.find();
    },
  },

  Mutation: {
    // createHelpRequestPost(input: CreateHelpRequestPostObject!): Post!
    createHelpRequestPost: async (_, { input }) => {
      const { authorId, ...postData } = input;
      const HelpRequestPost = new HelpRequestPostModel({
        ...postData,
        author: authorId,
        comments: [],
      });

      await HelpRequestPost.save();
      return HelpRequestPost;
    },
  },
};

module.exports = { helpRequestCommentResolvers };
