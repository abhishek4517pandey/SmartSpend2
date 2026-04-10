import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: String,
    email: String,
    phone: String,
    college: String,
    course: String,
    semester: String,
    monthlyBudget: Number,
    avatarType: { type: String, enum: ['upload', 'prebuilt'], default: 'prebuilt' },
    avatarData: { type: String, default: '1' } // URL for upload, ID for prebuilt
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;