import mongoose from 'mongoose';

const UserPreferenceSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  darkMode: { type: Boolean, default: null }, // Optional if you want to keep this separate from theme
  // You can add more preferences here in the future
}, { timestamps: true });

const UserPreference = mongoose.models.UserPreference || mongoose.model('UserPreference', UserPreferenceSchema);

export default UserPreference;
