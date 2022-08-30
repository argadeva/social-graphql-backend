const { gql } = require('apollo-server-core');

module.exports = gql`
  type Post {
    body: String!
    commentCount: Int!
    comments: [Comment]!
    createdAt: String!
    id: ID!
    image: String
    likeCount: Int!
    likes: [Like]!
    shortBody: String
    title: String!
    username: String!
  }

  type Comment {
    body: String!
    createdAt: String!
    id: ID!
    username: String!
  }

  type Like {
    createdAt: String!
    id: ID!
    username: String!    
  }

  type User {
    createdAt: String!
    email: String!
    id: ID!
    token: String!
    username: String!
  }

  input RegisterInput {
    confirmPassword: String!
    email: String!
    password: String!
    username: String!
  }

  type Query{
    getPosts(limit: Int): [Post]
    getPost(postId: ID!): Post
  }

  type Mutation{
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!, title: String!, image: String!, shortBody: String!): Post!,
    deletePost(postId: ID!): String!,
    createComment(postId: String!, body: String!): Post!,
    deleteComment(postId: ID!, commentId: ID!): Post!,
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!,
    test: Post!,
  }
`;