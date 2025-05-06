import { Post, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import userSchema from '../schemas/userSchema.js';

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface UserArgs {
    username: string;
}

interface PostArgs {
    postId: string;
}

interface AddPostArgs {
    input: {
        postText: string;
        postAuthor: string;
    }
}

interface AddCommentArgs {
    postId: string;
    commentText: string;
}

interface RemoveCommentArgs {
    postId: string;
    commentId: string;
}

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('post');
        },
        user: async (_parent: any, { username }: UserArgs) => {
            return User.findOne({ username }).populate('post');
        },
        posts: async () => {
            return await Post.find().sort({ createdAt: -1 });
        },
        post: async (_parent: any, { postId }: PostArgs) => {
            return await Post.findOne({ _id: postId });
        },
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('post');
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });

            const userObject = user.toObject() as Partial<{ username: string; email: string; _id: unknown }>;
            const { username, email, _id } = userObject;

            if (!username || !email || !_id) {
                throw new Error('User object is missing required fields.');
            }
            const token = signToken(username, email, _id);

            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const userObject = user.toObject() as Partial<{ username: string; email: string; _id: unknown }>;
            if (!userObject.username || !userObject.email || !userObject._id) {
                throw new Error('User object is missing required fields.');
            }
            const token = signToken(userObject.username, userObject.email, userObject._id);

            return { token, user };
        },
        addpost: async (_parent: any, { input }: AddPostArgs, context: any) => {
            if (context.user) {
                const post = await Post.create({ ...input });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { post: post._id } }
                );

                return post;
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },
        addComment: async (_parent: any, { postId, commentText }: AddCommentArgs, context: any) => {
            if (context.user) {
                return Post.findOneAndUpdate(
                    { _id: postId },
                    {
                        $addToSet: {
                            comments: { commentText, commentAuthor: context.user.username },
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            }
            throw AuthenticationError;
        },
        removePost: async (_parent: any, { postId }: PostArgs, context: any) => {
            if (context.user) {
                const post = await Post.findOneAndDelete({
                    _id: postId,
                    postAuthor: context.user.username,
                });

                if (!post) {
                    throw AuthenticationError;
                }

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { post: post._id } }
                );

                return post;
            }
            throw AuthenticationError;
        },
        removeComment: async (_parent: any, { postId, commentId }: RemoveCommentArgs, context: any) => {
            if (context.user) {
                return Post.findOneAndUpdate(
                    { _id: postId },
                    {
                        $pull: {
                            comments: {
                                _id: commentId,
                                commentAuthor: context.user.username,
                            },
                        },
                    },
                    { new: true }
                );
            }
            throw AuthenticationError;
    },
    signup: async (_parent: any, { input }: AddUserArgs) => {
        const existingUser = await User.findOne({ email: input.email });

        if (existingUser) {
            throw new AuthenticationError('User with this email already exists.');
        }

        const user = await User.create({ ...input });

        const userObject = user.toObject() as Partial<{ username: string; email: string; _id: unknown }>;
        const token = signToken(userObject.username, userObject.email, userObject._id);

        return { token, user };
    },
    },
};

export default resolvers;