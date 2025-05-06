const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    createdAt: String
  }

  type Tutor {
    id: ID!
    name: String!
    subject: String!
    hourlyRate: Float!
    availability: [String]!
  }

  type Post {
    id: ID!
    name: String!
    description: String!
  }

  type Comment {
    id: ID!
    postId: ID!
    content: String!
    createdAt: String!
  }

  type Contact {
    id: ID!
    name: String!
    email: String!
    message: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    tutors: [Tutor]
    tutor(id: ID!): Tutor
    getAllUsers: [User!]!
    getUserById(id: ID!): User
    getAllPosts: [Post!]!
    getPostById(id: ID!): Post
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    signUp(username: String!, email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): User
    addTutor(name: String!, subject: String!, hourlyRate: Float!, availability: [String]!): Tutor
    removeTutor(id: ID!): Tutor
    createPost(name: String!, description: String!): Post!
    deletePost(id: ID!): Post!
  }
`;

export default typeDefs;
