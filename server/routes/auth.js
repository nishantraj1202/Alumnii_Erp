const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// Signup Route
// Signup Route
router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, branch, role } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        branch,
        role: role || "user",
      });
  
      await newUser.save();
  
      // Generate JWT token for immediate authentication
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.status(201).json({
        message: "User registered successfully",
        token,  // Send the token to the frontend
        user: { id: newUser._id, name: newUser.name, role: newUser.role, branch: newUser.branch }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating user" });
    }
  });
  

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role },process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, branch: user.branch } });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});
router.get("/me", async (req, res) => {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("role name email branch");
    if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid token" });
    }
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user, // Replace with your email
    pass: process.env.pass // Replace with your app password
  }
});

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request Password Reset - Send OTP
router.post("/forgot-password/request", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with timestamp (expires in 10 minutes)
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Send email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Generated OTP for ${email}: ${otp}`);
    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Verify OTP
router.post("/forgot-password/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOTPData = otpStore.get(email);
    console.log(`Stored OTP: ${storedOTPData.otp}, User entered OTP: ${otp}`);
    if (!storedOTPData) {
      return res.status(400).json({ message: "OTP expired or not requested" });
    }

    // Check if OTP is expired (10 minutes)
    if (Date.now() - storedOTPData.timestamp > 600000) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check if too many attempts
    if (storedOTPData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({ message: "Too many attempts. Please request a new OTP" });
    }

    if (storedOTPData.otp !== otp) {
      storedOTPData.attempts += 1;
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid
    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// Reset Password
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedOTPData = otpStore.get(email);
    if (!storedOTPData || storedOTPData.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    // Clear OTP
    otpStore.delete(email);

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
