const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:xMbWowefoEtMwEbyRDcwLKOmalFYbyYX@switchyard.proxy.rlwy.net:57303').then(async () => {
  console.log('Connected to MongoDB ✅');
  const result = await mongoose.connection.db
    .collection('users')
    .updateOne(
      { email: 'solo.bhavishya@gmail.com' },
      { $set: { role: 'admin' } }
    );
  console.log('Done:', result.modifiedCount, 'user updated ✅');
  process.exit();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});