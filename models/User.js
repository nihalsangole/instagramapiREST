const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    mobile: {
      type: Number,
      min: 10,
      max: 10,
    },
    gender: {
      type: Number,
      enum: [1, 2, 3],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isPrivete: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    blockedUser: {
      type: Array,
      default: [],
    },
    posts: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
