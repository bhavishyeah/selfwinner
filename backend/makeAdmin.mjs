import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const result = await mongoose.connection.db
    .collection('users')
    .updateOne(
      { email: 'solo.bhavishya@gmail.com' },  // ← your actual Gmail here
      { $set: { role: 'admin' } }
    );
  console.log('Done:', result.modifiedCount, 'user updated ✅');
  process.exit();
});