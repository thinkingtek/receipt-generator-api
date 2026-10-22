import { prisma } from '../config/db.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            omit: { password: true},
        });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({error: "Could'nt fetch users"});
    }
};

export const getUserById = async (req, res, next) => {
    // try {
    //     const user = await User.findById(req.params.id).select('-password'); // Exclude password from the response

    //     if (!user) {
    //         const error = new Error('User not found');
    //         error.statusCode = 404;
    //         throw error;
    //     }

    //     res.status(200).json({ success: true, data: { user } });
    // } catch (error) {
    //     next(error);
    // }
};