import { DocumentDefinition, FilterQuery } from 'mongoose';
import { UserDocument, User } from '../model/user.model';

export const signupUser = async (
  input: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt'>>
) => {
  try {
    const user = await User.create(input);
    return user;
  } catch (err: any) {
    if (err.code === 11000) {
      throw new Error('Email is already reserved');
    }
    throw new Error();
  }
};
export const getAUser = async (query: string) => {
  try {
    const user = await User.findOne({ _id: query })
      .lean()
      .select('-password -confirmPassword');
    return user;
  } catch (err: any) {
    throw new Error();
  }
};

// find user with email
export const findUserByEmail = async (
  email: FilterQuery<UserDocument['email']>
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid Credentials');
  }
  return user;
};
export const getUsers = async (status = null, page = 1, limit = 2) => {
  const query = status !== null ? { verified: status } : {};
  const skip = (page - 1) * limit;
  const users = await User.find(query).skip(skip).limit(limit);
  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);
  return {
    users,
    currentPage: page,
    totalPages,
  };
};

export const searchUsers = async (query: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const searchQuery = {
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
    ],
  };

  try {
    const users = await User.find(searchQuery).skip(skip).limit(limit);

    const totalUsers = await User.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    throw new Error('Error while searching for users');
  }
};
