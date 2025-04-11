<<<<<<< HEAD
<<<<<<< HEAD
const HelpRequestCommentModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestComment.model.server.js");
const HelpRequestPostModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestPost.model.server.js");

const resolversHelpRequestComment = {
  Query: {
    getHelpRequestComment: async (_, { id }) => {
      return await HelpRequestCommentModel.findById(id);
    },
    getHelpRequestCommentsOfHelpRequestPost: async (_, { postid }) => {
      const helpRequestPost = await HelpRequestPostModel.findById(postid);
      const commentsIds = [];
      console.log(helpRequestPost.comments);
      helpRequestPost.comments.forEach((comment) => {
        commentsIds.push(comment._id.toString());
      });
      const returnCommentObjectsArray = HelpRequestCommentModel.find({
        _id: { $in: commentsIds },
      });
      console.log("returnCommentObjectsArray");
      console.log(returnCommentObjectsArray);
      return returnCommentObjectsArray;
    },
    // getHelpRequestCommentsOfHelpRequestPost: async (_, { postid }) => {
    //   const helpRequestPost = await HelpRequestPostModel.findById(postid);
    //   const comments = [];
    //   console.log(helpRequestPost.comments);
    //   helpRequestPost.comments.forEach((comment) => {
    //     const commentToBeAppended = await HelpRequestCommentModel.findById(comment._id);
    //     comments.push(comment._id.toString());
    //   });
    //   return comments;
    // },
  },

  Mutation: {
    // createAndAddHelpRequestCommentToHelpRequestPost: async (_, { input }) => {
    //   const { authorid, postid, text } = input;
    //   try {
    //     const createdComment = new HelpRequestCommentModel({
    //       authorid,
    //       postid,
    //       text,
    //     });
    //   } catch (error) {
    //     throw new Error("could not create Comment");
    //   }

    //   await createdComment.save();
    //   // add comment to post
    //   try {
    //     await HelpRequestPostModel.findByIdAndUpdate(
    //       postid,
    //       { $push: { comments: createdComment._id } },
    //       { new: true }
    //     );
    //   } catch (error) {
    //     throw new Error("could not append comment id to post");
    //   }
    //   // return comment
    //   return createdComment;
    // },
    createAndAddHelpRequestCommentToHelpRequestPost: async (_, { input }) => {
      const { authorid, postid, text } = input;
      const helpRequestComment = new HelpRequestCommentModel({
        authorid,
        postid,
        text,
      });
      // save comment object in mongo
      await helpRequestComment.save();
      // add comment to post object in mongo
      await HelpRequestPostModel.findByIdAndUpdate(
        postid,
        { $push: { comments: helpRequestComment._id } },
        { new: true }
      );
      return helpRequestComment;
    },
    deleteHelpRequestComment: async (_, { id }) => {
      try {
        const deleteHelpRequestCommentResultObject =
          await HelpRequestCommentModel.findByIdAndDelete(id);
        const targetPostToDeleteCommentFrom =
          await HelpRequestPostModel.findByIdAndUpdate(
            deleteHelpRequestCommentResultObject.postid,
            { $pull: { comments: id } },
            { new: true }
          );
        return {
          message: `Deletion Successful of Comment object id: ${id}`,
          success: true,
          error: "No error",
          deleteObjectId: id,
        };
      } catch (error) {
        return {
          message: `Deletion Failed of Comment object id: ${id}`,
          success: false,
          error: error,
          deleteObjectId: id,
        };
      }
    },
  },

  // Post: {},

  // Comment: {},

  // Resident: {},
};

module.exports = { resolversHelpRequestComment };
=======
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");
=======
const HelpRequestCommentModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestComment.model.server.js");
const HelpRequestPostModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestPost.model.server.js");
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)

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
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
