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
    // TODO latenight work, WORKS posts(with authors) and comments(with authors)
    getHelpRequestPosts: async () => {
      const postsWithComments = await HelpRequestPostModel.aggregate([
        {
          $sort: {
            createdAt: 1,
          },
        },
        // Join author of the post (resident)
        {
          $lookup: {
            from: "residents",
            localField: "authorid",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: false, // Filter out posts without a valid author
          },
        },
        // Join comments + comment author
        {
          $lookup: {
            from: "helprequestcomments",
            let: { commentIds: "$comments" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$commentIds"] },
                },
              },
              {
                $sort: { createdAt: 1 },
              },
              {
                $lookup: {
                  from: "residents",
                  localField: "authorid",
                  foreignField: "_id",
                  as: "resident",
                },
              },
              {
                $unwind: {
                  path: "$resident",
                  preserveNullAndEmptyArrays: false,
                },
              },
            ],
            as: "comments",
          },
        },
      ]);

      const formattedPostsWithComments = postsWithComments.map((post) => ({
        id: post._id.toString(),
        authorid: post.authorid.toString(),
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.author._id.toString(),
          username: post.author.username,
          role: post.author.role,
        },
        comments: post.comments.map((comment) => ({
          id: comment._id.toString(),
          authorid: comment.authorid.toString(),
          postid: comment.postid.toString(),
          text: comment.text,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          resident: {
            id: comment.resident._id.toString(),
            username: comment.resident.username,
            role: comment.resident.role,
          },
        })),
        __v: post.__v,
      }));

      return formattedPostsWithComments;
    },
    // TODO latenight work, works posts and comments(with authors)
    // getHelpRequestPosts: async () => {
    //   const postsWithComments = await HelpRequestPostModel.aggregate([
    //     {
    //       $sort: {
    //         createdAt: 1,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "helprequestcomments",
    //         let: { commentIds: "$comments" },
    //         pipeline: [
    //           {
    //             $match: {
    //               $expr: { $in: ["$_id", "$$commentIds"] },
    //             },
    //           },
    //           {
    //             $sort: { createdAt: 1 },
    //           },
    //           {
    //             $lookup: {
    //               from: "residents",
    //               localField: "authorid",
    //               foreignField: "_id",
    //               as: "resident",
    //             },
    //           },
    //           {
    //             $unwind: {
    //               path: "$resident",
    //               preserveNullAndEmptyArrays: false, // Filter out comments with no resident
    //             },
    //           },
    //         ],
    //         as: "comments",
    //       },
    //     },
    //   ]);

    //   const formattedPostsWithComments = postsWithComments.map((post) => ({
    //     id: post._id.toString(),
    //     authorid: post.authorid.toString(),
    //     title: post.title,
    //     content: post.content,
    //     createdAt: post.createdAt,
    //     updatedAt: post.updatedAt,
    //     comments: post.comments.map((comment) => ({
    //       id: comment._id.toString(),
    //       authorid: comment.authorid.toString(),
    //       postid: comment.postid.toString(),
    //       text: comment.text,
    //       createdAt: comment.createdAt,
    //       updatedAt: comment.updatedAt,
    //       resident: {
    //         id: comment.resident._id.toString(),
    //         username: comment.resident.username,
    //         role: comment.resident.role,
    //       },
    //     })),
    //     __v: post.__v,
    //   }));

    //   return formattedPostsWithComments;
    // },
    // TODO VERISON in testing refer to notepad for gpt prompt
    // sorts both posts (oldest to newest) and comments (newest to oldest), Adds resident object to comment
    // getHelpRequestPosts: async () => {
    //   const postsWithComments = await HelpRequestPostModel.aggregate([
    //     {
    //       $sort: {
    //         createdAt: 1,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "helprequestcomments",
    //         let: { commentIds: "$comments" },
    //         pipeline: [
    //           {
    //             $match: {
    //               $expr: { $in: ["$_id", "$$commentIds"] },
    //             },
    //           },
    //           {
    //             $sort: { createdAt: 1 },
    //           },
    //           // Now populate the resident (author) of each comment
    //           {
    //             $lookup: {
    //               from: "residents", // or whatever your residents collection is called
    //               localField: "authorid",
    //               foreignField: "_id",
    //               as: "resident",
    //             },
    //           },
    //           {
    //             $unwind: {
    //               path: "$resident",
    //               preserveNullAndEmptyArrays: true, // in case a resident was deleted
    //             },
    //           },
    //         ],
    //         as: "comments",
    //       },
    //     },
    //   ]);

    //   console.log("postsWithComments");
    //   console.log(postsWithComments);

    //   const formattedPostsWithComments = postsWithComments.map((post) => ({
    //     id: post._id.toString(),
    //     authorid: post.authorid.toString(),
    //     title: post.title,
    //     content: post.content,
    //     createdAt: post.createdAt,
    //     updatedAt: post.updatedAt,
    //     comments: post.comments.map((comment) => ({
    //       id: comment._id.toString(),
    //       authorid: comment.authorid.toString(),
    //       postid: comment.postid.toString(),
    //       text: comment.text,
    //       createdAt: comment.createdAt,
    //       updatedAt: comment.updatedAt,
    //       resident: comment.resident
    //         ? {
    //             id: comment.resident._id.toString(),
    //             name: comment.resident.name,
    //             email: comment.resident.email,
    //             // add more fields as needed
    //           }
    //         : null,
    //     })),
    //     __v: post.__v,
    //   }));

    //   return formattedPostsWithComments;
    // },
    // WORKING VERION:
    // // Works sorts both posts (oldest to newest) and comments (newest to oldest)
    // getHelpRequestPosts: async () => {
    //   const postsWithComments = await HelpRequestPostModel.aggregate([
    //     // First, sort the posts by createdAt (oldest first)
    //     {
    //       $sort: {
    //         createdAt: 1, // 1 for ascending (oldest first)
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "helprequestcomments", // the name of the collection you're joining with
    //         let: { commentIds: "$comments" },
    //         pipeline: [
    //           {
    //             $match: {
    //               $expr: { $in: ["$_id", "$$commentIds"] },
    //             },
    //           },
    //           {
    //             $sort: { createdAt: 1 }, // Sort comments by createdAt (oldest first)
    //           },
    //         ],
    //         as: "comments", // replace 'comments' field with the full documents
    //       },
    //     },
    //   ]);

    //   console.log("postsWithComments");
    //   console.log(postsWithComments);

    //   const formattedPostsWithComments = postsWithComments.map((post) => ({
    //     id: post._id.toString(),
    //     authorid: post.authorid.toString(),
    //     title: post.title,
    //     content: post.content,
    //     createdAt: post.createdAt,
    //     updatedAt: post.updatedAt,
    //     comments: post.comments.map((comment) => ({
    //       id: comment._id.toString(),
    //       authorid: comment.authorid.toString(),
    //       postid: comment.postid.toString(),
    //       text: comment.text,
    //       createdAt: comment.createdAt,
    //       updatedAt: comment.updatedAt,
    //     })),
    //     __v: post.__v,
    //   }));

    //   return formattedPostsWithComments;
    // },
    // Works sort comments old to new
    // getHelpRequestPosts: async () => {
    //   const postsWithComments = await HelpRequestPostModel.aggregate([
    //     {
    //       $lookup: {
    //         from: "helprequestcomments",
    //         let: { commentIds: "$comments" },
    //         pipeline: [
    //           {
    //             $match: {
    //               $expr: { $in: ["$_id", "$$commentIds"] },
    //             },
    //           },
    //           {
    //             $sort: { createdAt: 1 }, // Sort comments by createdAt, Acending (oldest to newest, meaning oldest renders at higher on page)
    //           },
    //         ],
    //         as: "comments",
    //       },
    //     },
    //   ]);

    //   const formattedPostsWithComments = postsWithComments.map((post) => ({
    //     id: post._id.toString(),
    //     authorid: post.authorid.toString(),
    //     title: post.title,
    //     content: post.content,
    //     createdAt: post.createdAt,
    //     updatedAt: post.updatedAt,
    //     comments: post.comments.map((comment) => ({
    //       id: comment._id.toString(),
    //       authorid: comment.authorid.toString(),
    //       postid: comment.postid.toString(),
    //       text: comment.text,
    //       createdAt: comment.createdAt,
    //       updatedAt: comment.updatedAt,
    //     })),
    //     __v: post.__v,
    //   }));

    //   return formattedPostsWithComments;
    // },

    // WORKS but no sort
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
    //   const formattedPostsWithComments = postsWithComments.map((post) => ({
    //     id: post._id.toString(),
    //     authorid: post.authorid.toString(),
    //     title: post.title,
    //     content: post.content,
    //     createdAt: post.createdAt,
    //     updatedAt: post.updatedAt,
    //     comments: post.comments.map((comment) => ({
    //       id: comment._id.toString(),
    //       authorid: comment.authorid.toString(),
    //       postid: comment.postid.toString(),
    //       text: comment.text,
    //       createdAt: comment.createdAt,
    //       updatedAt: comment.updatedAt,
    //     })),
    //     __v: post.__v,
    //   }));
    //   return formattedPostsWithComments;
    // },
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
