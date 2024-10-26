// Route to verify OTP
const verifyOtp = (req, res, otpStorage) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required', statusCode: 400 });
      }
  
      // Log the incoming request
      console.log('Incoming request:', { email, otp });
  
      // Log the stored OTP for the given email
      const storedOtp = otpStorage[email];
      console.log('Stored OTP for email:', storedOtp);
  
      // Check if the OTP matches
      if (storedOtp && storedOtp === otp) {
        delete otpStorage[email]; // Optionally, remove the OTP after verification
        res.status(200).json({ message: 'OTP verified successfully', status: 'success', statusCode: 200 });
      } else {
        res.status(400).json({ message: 'Invalid OTP', status: 'failed', statusCode: 404 });
      }
    } catch (error) {
      // Catch any unexpected errors and respond with a server error
      console.error('Error during OTP verification:', error.message);
      res.status(500).json({ message: 'Internal server error', statusCode: 500 });
    }
  };
  
  module.exports = verifyOtp;
  