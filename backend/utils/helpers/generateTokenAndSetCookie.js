import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: "15d", 
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, 
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", 
    });

    return token;
};

export default generateTokenAndSetCookie;
