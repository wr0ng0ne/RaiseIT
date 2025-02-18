import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";  

const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ message: "postedBy and text fields are required" });
        }

        const user = await User.findById(postedBy);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to create post" });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ message: `Text must be less than ${maxLength} characters` });
        }

        const newPost = new Post({ postedBy, text, img: img || "" });
        await newPost.save();

        res.status(201).json({ message: "Post created successfully", newPost });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error(err);
    }
};


const getPost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        res.status(200).json({ post });

    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

const deletePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found"});
        }

        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Unauthorized to delete post"});
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({message: err.message });
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
            return res.status(200).json({ message: "Post liked successfully" });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ message: "Text field is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const reply = { userId, text, userProfilePic, username };

        if (!post.replies) {
            post.replies = [];
        }

        post.replies.push(reply);
        await post.save();

        res.status(200).json({ message: "Reply added successfully", post });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const following = user.following || [];

        const feedposts = await Post.find({ postedBy: { $in: following } })
            .sort({ createdAt: -1 })
            .populate("postedBy", "username profilePic")
            .populate("likes", "username") 
            .populate("replies.userId", "username profilePic"); 

        res.status(200).json({ feedposts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };
