const { Post } = require('../models/Post');
const { Comment } = require('../models/Comment');

const resolvers = {
  Post: {
    __resolveReference: async (ref) => {
      return await Post.findById(ref.id).populate('comments');
    },
    author: async (parent) => {
      return { __typename: 'Resident', id: parent.author };
    },
    comments: async (parent) => {
      return await Comment.find({ postId: parent.id });
    }
  },
  
  Comment: {
    __resolveReference: async (ref) => {
      return await Comment.findById(ref.id);
    },
    author: async (parent) => {
      return { __typename: 'Resident', id: parent.author };
    }
  },
  
  Resident: {
    posts: async (parent) => {
      return await Post.find({ author: parent.id });
    },
    comments: async (parent) => {
      return await Comment.find({ author: parent.id });
    }
  },
  
  Query: {
    posts: async () => {
      return await Post.find().sort({ createdAt: -1 });
    },
    
    post: async (_, { id }) => {
      return await Post.findById(id);
    }
  },
  
  Mutation: {
    createPost: async (_, { input }) => {
      const { authorId, ...postData } = input;
      
      const post = new Post({
        ...postData,
        author: authorId,
        comments: []
      });
      
      await post.save();
      return post;
    },
    
    updatePost: async (_, { id, input }) => {
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      );
      
      if (!updatedPost) {
        throw new Error('Post not found');
      }
      
      return updatedPost;
    },
    
    deletePost: async (_, { id }) => {
      const post = await Post.findById(id);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Delete all comments for this post
      await Comment.deleteMany({ postId: id });
      
      // Delete the post
      await Post.findByIdAndDelete(id);
      
      return true;
    },
    
    addComment: async (_, { input }) => {
      const { postId, authorId, text } = input;
      
      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      
      const comment = new Comment({
        text,
        author: authorId,
        postId
      });
      
      await comment.save();
      
      // Add comment reference to post
      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } }
      );
      
      return comment;
    },
    
    updateComment: async (_, { id, text }) => {
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $set: { text } },
        { new: true }
      );
      
      if (!updatedComment) {
        throw new Error('Comment not found');
      }
      
      return updatedComment;
    },
    
    deleteComment: async (_, { id }) => {
      const comment = await Comment.findById(id);
      
      if (!comment) {
        throw new Error('Comment not found');
      }
      
      // Remove comment reference from post
      await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: id } }
      );
      
      // Delete the comment
      await Comment.findByIdAndDelete(id);
      
      return true;
    }
  }
};

module.exports = { resolvers };
