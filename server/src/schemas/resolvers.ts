import { AuthenticationError } from '../utils/auth.js';
import { Candidate, contactRequest } from '../models/index.js';
import { signToken } from '../utils/auth.js';

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (!context.candidate) throw new AuthenticationError('Could not authenticate candidate.');
            const candidate = await Candidate.findById(context.candidate._id);
            if (!candidate) throw new AuthenticationError('Candidate not found.');
            return {
                id: candidate._id,
                email: candidate.email,
                skills: candidate.skills,
                needs: candidate.needs,
            };
        },
        users: async (_parent: any, { hasSkill, needsHelpWith }: { hasSkill?: string[]; needsHelpWith?: string[] }) => {
            const query: any = {};
            if (hasSkill) query.skills = { $in: hasSkill };
            if (needsHelpWith) query.needs = { $in: needsHelpWith };
            const candidates = await Candidate.find(query);
            return candidates.map((candidate) => ({
                id: candidate._id,
                email: candidate.email,
                skills: candidate.skills,
                needs: candidate.needs,
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
            if (await Candidate.findOne({ email })) {
                throw new AuthenticationError('Candidate with this email already exists.');
            }
            const candidate = await Candidate.create({ email, password, skills, needs });
            const { _id } = candidate.toObject();
            return {
                token: signToken(candidate.user, email, _id.toString()),
                user: {
                    id: _id,
                    email: candidate.email,
                    skills: candidate.skills,
                    needs: candidate.needs,
                },
            };
        },
        login: async (_parent: any, { email, password }: { email: string; password: string }) => {
            const candidate = await Candidate.findOne({ email });
            if (!candidate || !(await candidate.isCorrectPassword(password))) {
                throw new AuthenticationError('Could not authenticate candidate.');
            }
            const { _id } = candidate.toObject();
            return {
                token: signToken(candidate.user, email, _id.toString()),
                user: {
                    id: _id,
                    email: candidate.email,
                    skills: candidate.skills,
                    needs: candidate.needs,
                },
            };
        },
        sendMessage: async (_parent: any, { toUserId, content }: { toUserId: string; content: string }, context: any) => {
            if (!context.candidate) throw new AuthenticationError('You need to be logged in!');
            // Placeholder for sendMessage resolver
            return {
                id: 'message-id',
                from: {
                    id: context.candidate._id,
                    email: context.candidate.email,
                    skills: context.candidate.skills,
                    needs: context.candidate.needs,
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
            if (!context.candidate) throw new AuthenticationError('You need to be logged in!');
            // Placeholder for requestSession resolver
            return {
                id: 'session-request-id',
                from: {
                    id: context.candidate._id,
                    email: context.candidate.email,
                    skills: context.candidate.skills,
                    needs: context.candidate.needs,
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
            if (!context.candidate) throw new AuthenticationError('You need to be logged in!');
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
                    id: context.candidate._id,
                    email: context.candidate.email,
                    skills: context.candidate.skills,
                    needs: context.candidate.needs,
                },
                time: new Date(),
                status: accept ? 'ACCEPTED' : 'DECLINED',
            };
        },
    },
};

export default resolvers;
