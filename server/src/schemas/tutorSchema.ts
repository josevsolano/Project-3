let tutorSchema = `
  type Tutor {
    id: ID!
    name: String!
    email: String!
    expertise: String!
  }

  type Query {
    getTutor(id: ID!): Tutor
  }

  type Mutation {
    createTutor(name: String!, email: String!, expertise: String!, password: String!): Tutor
  }
`;
tutorSchema += `
  extend type Query {
    tutor(id: ID!): Tutor
  }
`;
export default tutorSchema;