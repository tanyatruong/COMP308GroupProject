const HelpRequestPostModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestPost.model.server.js");
<<<<<<< HEAD
<<<<<<< HEAD
const mongoose = require("mongoose");
const resolversHelpRequestPost = {
=======

const helpRequestCommentResolvers = {
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
=======
const mongoose = require("mongoose");
const resolversHelpRequestPost = {
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)
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
<<<<<<< HEAD
    createHelpRequestPost: async (_, { input }) => {
      const { authorid, ...postData } = input;
      const HelpRequestPost = new HelpRequestPostModel({
        ...postData,
        // author: new mongoose.Types.ObjectId(authorId),
        authorid: authorid,
=======
    // createHelpRequestPost(input: CreateHelpRequestPostObject!): Post!
=======
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)
    createHelpRequestPost: async (_, { input }) => {
      const { authorid, ...postData } = input;
      const HelpRequestPost = new HelpRequestPostModel({
        ...postData,
<<<<<<< HEAD
        author: authorId,
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
=======
        // author: new mongoose.Types.ObjectId(authorId),
        authorid: authorid,
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)
        comments: [],
      });

      await HelpRequestPost.save();
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)

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
<<<<<<< HEAD
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
=======
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)
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
          message: `Deletion Successful of object id: ${id}`,
          success: true,
          error: "No error",
          deleteObjectId: id,
        };
      } catch (error) {
        return {
          message: `Deletion Failed of object id: ${id}`,
          success: false,
          error: error,
          deleteObjectId: id,
        };
      }
    },
  },
};

<<<<<<< HEAD
module.exports = { helpRequestCommentResolvers };
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
=======
module.exports = { resolversHelpRequestPost };
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)
