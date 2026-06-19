import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true, trim: true, uppercase: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['Admin', 'Para Head', 'Scientist', 'Technical Officer', 'Staff', 'Contractual Worker', 'Intern'],
      default: 'Staff',
    },
    department: { type: String, default: 'General Administration' },
    contactInfo: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    name: this.name,
    employeeId: this.employeeId,
    email: this.email,
    role: this.role,
    department: this.department,
    contactInfo: this.contactInfo,
    profileImage: this.profileImage,
    status: this.status,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
