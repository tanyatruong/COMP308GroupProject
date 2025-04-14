const HelpRequestCommentModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestComment.model.server.js");
const HelpRequestPostModel = require("../../../models/neighbourhoodHelpRequests/HelpRequestPost.model.server.js");
const mongoose = require("mongoose");
const resolversHelpRequestPost = {
  // Post: {},

  // Comment: {},

  // Resident: {},

  Query: {
    // getHelpRequestPost(id: ID!): HelpRequestPost
    getHelpRequestPost: async (_, { id }) => {
      return await HelpRequestPostModel.findById(id);
    },
    // getHelpRequestPosts: [HelpRequestPost!]!
    // getHelpRequestPosts: async (_, {}) => {
    //   return await HelpRequestPostModel.find();
    // },
    // getHelpRequestPosts: async () => {
    //   const postsWithComments = await HelpRequestPostModel.aggregate([
    //     {
    //       $lookup: {
    //         from: "helprequestcomments", // the name of the collection you're joining with
    //         localField: "comments", // field in Post
    //         foreignField: "_id", // field in Comment
    //         as: "comments", // replace the 'comments' field with the full documents
    //       },
    //     },
    //   ]);
    //   console.log("postsWithComments");
    //   console.log(postsWithComments);
    //   const formattedPostsWithComments = postsWithComments.map(
    //     ({ comments, ...rest }) => ({
    //       comments: {
    //         id: comments._id.toString(), // make sure to convert ObjectId to string if needed
    //         authorid: comments.authorid,
    //         createdAt: comments.createdAt,
    //         postid: comments.postid,
    //         text: comments.text,
    //         updatedAt: comments.updatedAt,
    //       },
    //       ...rest,
    //     })
    //   );
    //   return formattedPostsWithComments;
    // },
    getHelpRequestPosts: async () => {
      const postsWithComments = await HelpRequestPostModel.aggregate([
        {
          $lookup: {
            from: "helprequestcomments", // the name of the collection you're joining with
            localField: "comments", // field in Post
            foreignField: "_id", // field in Comment
            as: "comments", // replace the 'comments' field with the full documents
          },
        },
      ]);
      console.log("postsWithComments");
      console.log(postsWithComments);
      const formattedPostsWithComments = postsWithComments.map((post) => ({
        id: post._id.toString(),
        authorid: post.authorid.toString(),
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        comments: post.comments.map((comment) => ({
          id: comment._id.toString(),
          authorid: comment.authorid.toString(),
          postid: comment.postid.toString(),
          text: comment.text,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })),
        __v: post.__v,
      }));
      return formattedPostsWithComments;
    },
    // getHelpRequestPosts: async () => {
    //   const postsWithComments = await HelpRequestPostModel.aggregate([
    //     {
    //       $lookup: {
    //         from: "helprequestcomments", // the name of the collection you're joining with
    //         localField: "comments", // field in Post
    //         foreignField: "_id", // field in Comment
    //         as: "comments", // replace the 'comments' field with the full documents
    //       },
    //     },
    //   ]);
    //   console.log("postsWithComments");
    //   console.log(postsWithComments);
    //   const formattedPostsWithComments = postsWithComments.map(
    //     ({ _id, authorid, comments, content, createdAt, title, updatedAt }) => ({
    //       id: _id.toString(), // make sure to convert ObjectId to string if needed
    //       authorid: authorid,
    //       createdAt: createdAt,
    //       postid: postid,
    //       text: text,
    //       updatedAt: updatedAt,
    //     })
    //   );
    //   return formattedPostsWithComments;
    // },
  },

  Mutation: {
    createHelpRequestPost: async (_, { input }) => {
      const { authorid, ...postData } = input;
      const HelpRequestPost = new HelpRequestPostModel({
        ...postData,
        // author: new mongoose.Types.ObjectId(authorId),
        authorid: authorid,
        comments: [],
      });

      await HelpRequestPost.save();

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
