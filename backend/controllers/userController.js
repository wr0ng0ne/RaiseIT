import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

const getUserProfile = async (req,res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne ({ username }).select("-password").select("-updateat");
        if (!user) return res.status(400).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in getUserProfile", err.message);
    }
};

const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const emailLower = email.trim().toLowerCase();
        const usernameLower = username.trim().toLowerCase();

        const userExists = await User.findOne({ 
            $or: [{ email: emailLower }, { username: usernameLower }] 
        });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        if (!salt) {
            return res.status(500).json({ message: "Error generating salt" });
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        const newUser = new User({
            name,
            email: emailLower,
            username: usernameLower,
            password: hashedPassword,
        });

        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
        });

    } catch (err) {
        console.error("Error in signupUser:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username: username.trim().toLowerCase() }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        console.error("Error in logoutUser:", err);
        res.status(500).json({ message: err.message });
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
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        
        if (req.params.id && req.params.id !== userId.toString()) {
            return res.status(403).json({ message: "You cannot update other user's profile" });
        }

        
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.username = username ?? user.username;
        user.profilePic = profilePic ?? user.profilePic;
        user.bio = bio ?? user.bio;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
        console.error("Error in updateUser:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export { signupUser, loginUser, logoutUser,followUnfollowUser,updateUser, getUserProfile };
