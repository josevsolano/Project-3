import { AuthenticationError } from '../utils/auth.js';
import { User } from '../models/index.js';
import { signToken } from '../utils/auth.js';

// Minimal public-facing shape of your user
interface IUser {
  _id: any;               // Mongoose ObjectId
  email: string;
  skills: string[];
  needs: string[];
  isCorrectPassword?: (pw: string) => Promise<boolean>;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.User) {
        throw new AuthenticationError('Could not authenticate User.');
      }
      const found = await User.findById(context.User._id).lean() as IUser | null;
      if (!found) {
        throw new AuthenticationError('User not found.');
      }

      const id = found._id.toString();
      return {
        id,
        email:  found.email,
        skills: found.skills,
        needs:  found.needs
      };
    },

    users: async (
      _parent: any,
      { hasSkill, needsHelpWith }: { hasSkill?: string[]; needsHelpWith?: string[] }
    ) => {
      const query: Record<string, any> = {};
      if (hasSkill)       query.skills = { $in: hasSkill };
      if (needsHelpWith)  query.needs  = { $in: needsHelpWith };

      const mongoUsers = await User.find(query).lean() as IUser[];
      return mongoUsers.map(u => ({
        id:     u._id.toString(),
        email:  u.email,
        skills: u.skills,
        needs:  u.needs
      }));
    },

    messages:        async () => [],  // placeholders
    sessionRequests: async () => [],
    getSplash:      async () => ({ message: 'Welcome to the landing page!' })
  },

  Mutation: {
    signup: async (
      _parent: any,
      { email, password, skills, needs }: { email: string; password: string; skills: string[]; needs: string[] }
    ) => {
      // 1) Prevent duplicate emails
      if (await User.findOne({ email })) {
        throw new AuthenticationError('User with this email already exists.');
      }

      // 2) Create & toObject()
      const created = await User.create({ email, password, skills, needs });
      const u = created.toObject() as IUser;

      // 3) Extract and rename _id
      const id = u._id.toString();

      // 4) Build a clean payload
      const payload = { id, email: u.email, skills: u.skills, needs: u.needs };

      // 5) Sign and return
      return {
        token: signToken(payload),
        user:  payload
      };
    },

    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ) => {
      const found = await User.findOne({ email }) as IUser | null;
      if (!found || !(await found.isCorrectPassword!(password))) {
        throw new AuthenticationError('Could not authenticate User.');
      }

      const u = (found as any).toObject() as IUser;
      const id = u._id.toString();
      const payload = { id, email: u.email, skills: u.skills, needs: u.needs };

      return {
        token: signToken(payload),
        user:  payload
      };
    },

    sendMessage: async (
      _parent: any,
      { toUserId, content }: { toUserId: string; content: string },
      context: any
    ) => {
      if (!context.User) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return {
        id:      'message-id',
        content,
        sentAt:  new Date(),
        from:    { id: context.User._id, email: context.User.email, skills: context.User.skills, needs: context.User.needs },
        to:      { id: toUserId,          email: 'recipient@example.com',             skills: [],               needs: [] }
      };
    },

    requestSession: async (
      _parent: any,
      { toUserId, time }: { toUserId: string; time: Date },
      context: any
    ) => {
      if (!context.User) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return {
        id:     'session-request-id',
        time,
        status: 'PENDING',
        from:   { id: context.User._id, email: context.User.email, skills: context.User.skills, needs: context.User.needs },
        to:     { id: toUserId,          email: 'recipient@example.com',             skills: [],               needs: [] }
      };
    },

    respondToSession: async (
      _parent: any,
      { requestId, accept }: { requestId: string; accept: boolean },
      context: any
    ) => {
      if (!context.User) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return {
        id:     requestId,
        time:   new Date(),
        status: accept ? 'ACCEPTED' : 'DECLINED',
        from:   { id: 'from-user-id',      email: 'from@example.com',                skills: [], needs: [] },
        to:     { id: context.User._id, email: context.User.email,              skills: context.User.skills, needs: context.User.needs }
      };
    }
  }
};

export default resolvers;
