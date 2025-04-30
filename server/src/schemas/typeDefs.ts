import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
    }

    type Tutor {
        id: ID!
        name: String!
        subject: String!
        hourlyRate: Float!
        availability: [String]!
    }

    type Query {
        users: [User]
        tutors: [Tutor]
        tutor(id: ID!): Tutor
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addTutor(name: String!, subject: String!, hourlyRate: Float!, availability: [String]!): Tutor
        removeTutor(id: ID!): Tutor
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        }

    type Auth {
        token: ID!
        user: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
        addTutor(name: String!, subject: String!, hourlyRate: Float!, availability: [String]!): Tutor
    }

    import { gql } from 'apollo-server-express';

    type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type Query {
    getAllUsers: [User!]!            # Fetch all users
    getUserById(id: ID!): User       # Fetch a user by ID
  }

  type Mutation {
    signUp(name: String!, email: String!, password: String!): String!  # User sign-up, returns a JWT token
    login(email: String!, password: String!): String!                 # User login, returns a JWT token
  }

  
`;

export default typeDefs;
`;

export default typeDefs;