const User = require('../models/userModel');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  try {
    console.log('\n🔐 ═══════════════════════════════════');
    console.log('GOOGLE OAUTH REQUEST');
    console.log('═══════════════════════════════════\n');
    
    const { credential } = req.body;

    if (!credential) {
      console.error('❌ No credential provided');
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    console.log('🔍 Verifying Google token...');

    // Verify Google token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError.message);
      console.log('═══════════════════════════════════\n');
      
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token. Please try again.'
      });
    }

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      console.error('❌ No email in Google token');
      console.log('═══════════════════════════════════\n');
      
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google'
      });
    }

    console.log('✅ Google token verified');
    console.log('   Email:', email);
    console.log('   Name:', name);
    console.log('   Google ID:', googleId);

    // Check if user exists
    console.log('🔍 Checking database for existing user...');
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      console.log('✅ Existing user found');
      console.log('   User ID:', user._id);
      console.log('   Role:', user.role);
      
      // Update Google info if not set
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
        updated = true;
      }
      if (!user.isActive) {
        user.isActive = true;
        updated = true;
      }
      
      if (updated) {
        await user.save();
        console.log('✅ User info updated');
      }
    } else {
      console.log('🆕 Creating new user...');
      
      try {
        user = await User.create({
          email: email.toLowerCase(),
          name: name || email.split('@')[0],
          googleId,
          profilePicture: picture || '',
          role: 'student',
          password: 'google-auth-' + Date.now() + '-' + Math.random().toString(36),
          isActive: true
        });

        console.log('✅ New user created successfully!');
        console.log('   User ID:', user._id);
        console.log('   Email:', user.email);
        console.log('   Name:', user.name);
      } catch (createError) {
        console.error('❌ Failed to create user:', createError.message);
        console.log('═══════════════════════════════════\n');
        
        return res.status(500).json({
          success: false,
          message: 'Failed to create user account'
        });
      }
    }

    // Verify user in database
    const verifyUser = await User.findById(user._id);
    if (!verifyUser) {
      console.error('❌ User not found after save!');
      console.log('═══════════════════════════════════\n');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to save user to database'
      });
    }
    
    console.log('✅ User verified in database');

    // Generate JWT token
    console.log('🔑 Generating JWT token...');
    const token = user.generateAuthToken();
    console.log('✅ Token generated');

    const response = {
      success: true,
      message: 'Login successful! Welcome to SelfWinner 🎉',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture || ''
      }
    };

    console.log('✅ Sending success response');
    console.log('═══════════════════════════════════\n');
    
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Google auth error:', error.message);
    console.error('   Stack:', error.stack);
    console.log('═══════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = exports;