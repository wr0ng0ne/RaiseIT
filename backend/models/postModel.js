import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
    ],
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
          default: "",
        },
        username: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


postSchema.index({ postedBy: 1 });
postSchema.index({ likes: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;

