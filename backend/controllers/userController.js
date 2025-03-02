import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from "cloudinary";
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password -updateAt").lean();
        if (!user) return res.status(400).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error("Error in getUserProfile", err.message);
    }
};

const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailLower = email.trim().toLowerCase();
        const usernameLower = username.trim().toLowerCase();

        const userExists = await User.findOne({ $or: [{ email: emailLower }, { username: usernameLower }] }).lean();

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        if (!salt) {
            return res.status(500).json({ error: "Error generating salt" });
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        if (!hashedPassword) {
            return res.status(500).json({ error: "Error hashing password" });
        }

        const newUser = new User({
            name,
            email: emailLower,
            username: usernameLower,
            password: hashedPassword,
        });

        await newUser.save();

        if(newUser){
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
            profilePic: newUser.profilePic,
        });

    }else {
        res.status(400).json({error:"Invalid user data"});
    }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error("Error in signupUser:", err);
        
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ username: username.trim().toLowerCase() }).select("+password").lean();

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        console.error("Error in logoutUser:", err);
        res.status(500).json({ error: err.message });
    }
};

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
        }

        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            return res.status(200).json({ message: "User followed successfully" });
        }
    } catch (err) {
        console.error("Error in followUnfollowUser:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;

    const userId = req.user._id; // Ensure this is coming from protectRoute middleware

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ensure the correct user is updating their own profile
        if (req.params.id && req.params.id !== userId.toString()) {
            return res.status(403).json({ error: "You cannot update another user's profile" });
        }

        // If password is provided, hash it before updating
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Handle profile picture update
        if (profilePic) {
            if (user.profilePic) {
                // Extract public_id from Cloudinary URL and delete old image
                const publicId = user.profilePic.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new image to Cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        // Update user fields
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.username = username ?? user.username;
        user.profilePic = profilePic ?? user.profilePic;
        user.bio = bio ?? user.bio;

        user=await user.save();

        user.password = null;

        res.status(200).json(user);
    } catch (err) {
        console.error("Error in updateUser:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

export default updateUser;

export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile };
