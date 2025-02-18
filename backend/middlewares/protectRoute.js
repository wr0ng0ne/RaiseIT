import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userID).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found in DB" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Error in protectRoute:", err.message);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default protectRoute;
