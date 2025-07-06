// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   firstName: String,
//   phone: String,
//   notes: String,
//   agent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Agent'
//   },
//   admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }

// });

// module.exports = mongoose.model('Lead', leadSchema);
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // ✅ Make sure this matches your actual Admin/User model name!
    required: true
  }
});

// Optional: add index to speed up admin-based queries
leadSchema.index({ admin: 1 });

module.exports = mongoose.model('Lead', leadSchema);
