const HelpRequestPostModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestPost.model.server.js");
<<<<<<< HEAD
const mongoose = require("mongoose");
const resolversHelpRequestPost = {
=======

const helpRequestCommentResolvers = {
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
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
<<<<<<< HEAD
    createHelpRequestPost: async (_, { input }) => {
      const { authorid, ...postData } = input;
      const HelpRequestPost = new HelpRequestPostModel({
        ...postData,
        // author: new mongoose.Types.ObjectId(authorId),
        authorid: authorid,
=======
    // createHelpRequestPost(input: CreateHelpRequestPostObject!): Post!
    createHelpRequestPost: async (_, { input }) => {
      const { authorId, ...postData } = input;
      const HelpRequestPost = new HelpRequestPostModel({
        ...postData,
        author: authorId,
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
        comments: [],
      });

      await HelpRequestPost.save();
<<<<<<< HEAD

      // const returnValue = {
      //   id: HelpRequestPost._id.toString(),
      //   authorId: authorId.toString(),
      //   title: HelpRequestPost.title,
      //   content: HelpRequestPost.content,
      //   comments: HelpRequestPost.comments,
      //   createdAt: HelpRequestPost.createdAt,
      //   updatedAt: HelpRequestPost.updatedAt,
      // };
      // return returnValue;
      // return {
      //   ...HelpRequestPost._doc,
      //   id: HelpRequestPost._id.toString(),
      // };
      return HelpRequestPost;
    },
    updateHelpRequestPost: async (_, { id, input }) => {
      const { title, content } = input;
      return await HelpRequestPostModel.findByIdAndUpdate(
        id,
        { title: title, content: content },
        { new: true }
      );
    },
    deleteHelpRequestPost: async (_, { id }) => {
      try {
        const deleteHelpRequestPostResultObject =
          await HelpRequestPostModel.findByIdAndDelete(id);
        return {
          message: `Deletion Successful of Post object id: ${id}`,
          success: true,
          error: "No error",
          deleteObjectId: id,
        };
      } catch (error) {
        return {
          message: `Deletion Failed of Post object id: ${id}`,
          success: false,
          error: error,
          deleteObjectId: id,
        };
      }
    },
  },
};

module.exports = { resolversHelpRequestPost };
=======
      return HelpRequestPost;
    },
  },
};

module.exports = { helpRequestCommentResolvers };
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
