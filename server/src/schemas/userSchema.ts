let userSchema = `
  type user {
    id: ID!
    name: String!
    email: String!
    expertise: String!
  }

  type Query {
    getuser(id: ID!): user
  }

  type Mutation {
    createuser(name: String!, email: String!, expertise: String!, password: String!): user
  }
`;
userSchema += `
  extend type Query {
    user(id: ID!): user
  }
`;
export default userSchema;