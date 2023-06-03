import { User } from '../models/userModel.js';

const getAllUsers = async (req, res) => {
    try {
        const { username } = req.query;
        
        let query = User.find(username
            ? { 'userName': { $regex: `${username}`, $options: 'i' } }
            : req.query);

        const users = await query;

        if (users.length === 0) {
            res.status(200).json({
                status: 'success',
                results: users.length,
                message: 'No users',
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    };
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    };
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    };
};

export { getAllUsers, getUser, updateUser };