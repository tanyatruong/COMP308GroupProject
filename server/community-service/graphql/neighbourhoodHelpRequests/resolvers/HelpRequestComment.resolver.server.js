const HelpRequestCommentModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestComment.model.server.js");
const HelpRequestPostModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestPost.model.server.js");

const helpRequestCommentResolvers = {
  Query: {
    getHelpRequestComment: async (_, { id }) => {
      return await HelpRequestCommentModel.findById(id);
    },
    getHelpRequestCommentsOfHelpRequestPost: async (_, { postid }) => {
      const helpRequestPost = await HelpRequestPostModel.findById(postid);
      return helpRequestPost.comments;
    },
  },

  Mutation: {
    addHelpRequestCommentToHelpRequestPost: async () => {},
    deleteHelpRequestComment: async () => {},
  },

  // Post: {},

  // Comment: {},

  // Resident: {},
};

module.exports = { helpRequestCommentResolvers };
