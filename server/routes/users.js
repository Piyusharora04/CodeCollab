const express = require("express");

const User = require("../models/users");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const cloudinary = require('../config/cloudinary.js');
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_images",
        format: async (req, file) => "png", // Save as PNG
        public_id: (req, file) => Date.now() + "-" + file.originalname,
    },
});

const upload = multer({ storage: storage });

router.post("/signup",upload.single("profileImage"), async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.send("userExists");
        }

        // Handle profile image (uploaded by multer & Cloudinary)
        let profileImageUrl = "/Images/default.png"; // Default profile image

        if (req.file) {
            profileImageUrl = req.file.path; // Cloudinary URL
        }

        // Create user in DB
        await User.create({
            name,
            email,
            phoneNumber: phone,
            password,
            profileImageUrl,
        });

        res.send("userCreated");
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/login", async (req, res) => {
    const userData = req.body.formData;

    const token = await User.matchPasswordAndGenerateToken(userData.email, userData.password);
    // console.log(token);

    if(token === 0){
        return res.send("notFound");
    }
    if(token === -1){
        return res.send("invalid");
    }
    // console.log(token);
    res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",   
        maxAge: 60 * 60 * 1000
    });
    
    res.send("userLoggedin");
});

router.get("/auth/check", (req,res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode
    console.log(token);
    res.json({ token: token });
});

router.get("/logout", (req,res) => {
    res.clearCookie("authToken");
    res.send("cleared");
});

router.get("/", (req, res) => {
    res.send("User Route is working");
});


module.exports = router;