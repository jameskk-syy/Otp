// api/verifyOtp.js
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Check if OTP is correct
    if (global.otpStorage && global.otpStorage[email] === otp) {
        delete global.otpStorage[email]; // Optional: Remove OTP after successful verification
        res.status(200).json({ message: 'OTP verified successfully', status: 'success', statusCode: 200 });
    } else {
        res.status(400).json({ message: 'Invalid OTP', status: 'failed', statusCode: 404 });
    }
};

module.exports = verifyOtp;
