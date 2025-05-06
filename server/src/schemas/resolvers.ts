import { AuthenticationError } from '../utils/auth.js';
import { User } from '../models/index.js';
import { signToken } from '../utils/auth.js';
import userSchema from './userSchema.js';

// Define or import the IUser interface
interface IUser {
    _id: string;
    email: string;
    skills: string[];
    needs: string[];
    isCorrectPassword?: (password: string) => Promise<boolean>;
}

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (!context.User) throw new AuthenticationError('Could not authenticate User.');
            const foundUser = await User.findById(context.User._id).lean() as unknown as IUser;
            if (!foundUser) throw new AuthenticationError('User not found.');
            return {
                id: foundUser._id,
                email: User.email,
                skills: User.skills,
                needs: User.needs,
            };
        },
        users: async (_parent: any, { hasSkill, needsHelpWith }: { hasSkill?: string[]; needsHelpWith?: string[] }) => {
            const query: any = {};
            if (hasSkill) query.skills = { $in: hasSkill };
            if (needsHelpWith) query.needs = { $in: needsHelpWith };
            const Users = await User.find(query) as IUser[];
            return Users.map((User) => ({
                id: User._id,
                email: User.email,
                skills: User.skills,
                needs: User.needs,
            }));
        },
        messages: async () => {
            // Placeholder for messages resolver
            return [];
        },
        sessionRequests: async () => {
            // Placeholder for sessionRequests resolver
            return [];
        },
        getSplash: async () => {
            // Placeholder for splash screen resolver
            return { message: 'Welcome to the landing page!' };
        },

    },
    Mutation: {
        signup: async (
            _parent: any,
            { email, password, skills, needs }: { email: string; password: string; skills: string[]; needs: string[] }
        ) => {
            if (await User.findOne({ email })) {
                throw new AuthenticationError('User with this email already exists.');
            }
            const newUser = (await User.create({ email, password, skills, needs })).toObject() as unknown as IUser;
            const { _id } = newUser;
            return {
                token: signToken({ ...newUser, _id }, email, _id.toString()),
                user: {
                    id: _id,
                    email: newUser.email,
                    skills: newUser.skills,
                    needs: newUser.needs,
                },
            };
        },
        login: async (_parent: any, { email, password }: { email: string; password: string }) => {
            const foundUser = await User.findOne({ email }) as IUser;
            if (!foundUser || !(await foundUser.isCorrectPassword(password))) {
                throw new AuthenticationError('Could not authenticate User.');
            }
            const { _id } = (foundUser as any).toObject();
            return {
                token: signToken({ ...(foundUser as any).toObject(), _id: _id.toString() }, email, _id.toString()),
                user: {
                    id: _id,
                    email: User.email,
                    skills: User.skills,
                    needs: User.needs,
                },
            };
        },
        sendMessage: async (_parent: any, { toUserId, content }: { toUserId: string; content: string }, context: any) => {
            if (!context.User) throw new AuthenticationError('You need to be logged in!');
            // Placeholder for sendMessage resolver
            return {
                id: 'message-id',
                from: {
                    id: context.User._id,
                    email: context.User.email,
                    skills: context.User.skills,
                    needs: context.User.needs,
                },
                to: {
                    id: toUserId,
                    email: 'recipient@example.com',
                    skills: [],
                    needs: [],
                },
                content,
                sentAt: new Date(),
            };
        },
        requestSession: async (_parent: any, { toUserId, time }: { toUserId: string; time: Date }, context: any) => {
            if (!context.User) throw new AuthenticationError('You need to be logged in!');
            // Placeholder for requestSession resolver
            return {
                id: 'session-request-id',
                from: {
                    id: context.User._id,
                    email: context.User.email,
                    skills: context.User.skills,
                    needs: context.User.needs,
                },
                to: {
                    id: toUserId,
                    email: 'recipient@example.com',
                    skills: [],
                    needs: [],
                },
                time,
                status: 'PENDING',
            };
        },
        respondToSession: async (
            _parent: any,
            { requestId, accept }: { requestId: string; accept: boolean },
            context: any
        ) => {
            if (!context.User) throw new AuthenticationError('You need to be logged in!');
            // Placeholder for respondToSession resolver
            return {
                id: requestId,
                from: {
                    id: 'from-user-id',
                    email: 'from@example.com',
                    skills: [],
                    needs: [],
                },
                to: {
                    id: context.User._id,
                    email: context.User.email,
                    skills: context.User.skills,
                    needs: context.User.needs,
                },
                time: new Date(),
                status: accept ? 'ACCEPTED' : 'DECLINED',
            };
        },
    },
};

export default resolvers;
