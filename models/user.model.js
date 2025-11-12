import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["student", "teacher"],
        default: "student"
    },

});


userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = new mongoose.model('User', userSchema);
export default User;