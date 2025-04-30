import { IResolvers } from '@graphql-tools/utils';
import { Post, User } from '../src/models';
import { AuthenticationError } from 'apollo-server-express';
import { User, Listing } from '../src/models';
import { signToken } from '../../utils/auth';

interface AddUserArgs {
    input:{
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
    thoughtId: string;
  }
  
  interface AddPostArgs {
    input:{
      thoughtText: string;
      thoughtAuthor: string;
    }
  }
  
  interface AddCommentArgs {
    thoughtId: string;
    commentText: string;
  }
  
  interface RemoveCommentArgs {
    thoughtId: string;
    commentId: string;
  }

const resolvers: IResolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (_parent, { id }) => {
            return User.findById(id);
        },
        listings: async () => {
            return Listing.find();
        },
        listing: async (_parent, { id }) => {
            return Listing.findById(id);
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return User.findById(context.user._id);
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        addUser: async (_parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        addListing: async (_parent, { title, description, price }, context) => {
            if (context.user) {
                const listing = await Listing.create({
                    title,
                    description,
                    price,
                    user: context.user._id,
                });
                return listing;
            }
            throw new AuthenticationError('You need to be logged in');
        },
        removeListing: async (_parent, { id }, context) => {
            if (context.user) {
                const listing = await Listing.findOneAndDelete({
                    _id: id,
                    user: context.user._id,
                });
                return listing;
            }
            throw new AuthenticationError('You need to be logged in');
        },
    },
};

export default resolvers;