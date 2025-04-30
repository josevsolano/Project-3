import { gql } from 'apollo-server-express';

const userSchema = gql`
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

export default userSchema;