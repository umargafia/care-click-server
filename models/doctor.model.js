import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
 
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Doctor', doctorSchema);