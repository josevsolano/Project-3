let userSchema = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
  }
`;
userSchema += `
  extend type Query {
    user(id: ID!): User
  }
`;
export default userSchema;