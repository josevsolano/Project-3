export const typeDefs = `
  scalar DateTime

  type User {
    id: ID!
    email: String!
    skills: [String!]!
    needs: [String!]!
    createdAt: DateTime
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum SessionStatus {
    PENDING
    ACCEPTED
    DECLINED
  }

  type SessionRequest {
    id: ID!
    from: User!
    to: User!
    time: DateTime!
    status: SessionStatus!
  }

  type Message {
    id: ID!
    from: User!
    to: User!
    content: String!
    sentAt: DateTime!
  }

  type Query {
    me: User
    users(hasSkill: [String!], needsHelpWith: [String!]): [User!]!
    messages: [Message!]!
    sessionRequests: [SessionRequest!]!
    getSplash: landingPage
  }

  type landingPage {
    message: String!
  }

  type Mutation {
    signup(
      email: String!
      password: String!
      skills: [String!]!
      needs: [String!]!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    sendMessage(toUserId: ID!, content: String!): Message!
    requestSession(toUserId: ID!, time: DateTime!): SessionRequest!
    respondToSession(requestId: ID!, accept: Boolean!): SessionRequest!
  }
`;

export default typeDefs;