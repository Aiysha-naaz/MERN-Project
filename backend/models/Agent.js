const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const agentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   password: { type: String, required: true }
// });


const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  phone: { type: String, required: true },
  password: { type: String, required: true },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User (Admin) model
    required: true
  }
});
agentSchema.index({ admin: 1, email: 1 }, { unique: true });

// Encrypt password before saving
agentSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Agent = mongoose.model('Agent', agentSchema);
module.exports = Agent;




