const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//update user

router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('Account has been updated');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('you can update only your account');
  }
});
//delete user
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can delete only  your  account');
  }
});

//get a user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
//follow user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json('user has been followed');
      } else {
        res.status(403).json('you already follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(40).json('you cant follow yourself');
  }
});
//unfollow user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json('user has been unfollowed');
      } else {
        res.status(403).json('you already unfollow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(40).json('you cant unfollow yourself');
  }
});

//block user

router.put('/:id/block', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user.blockedUser.includes(req.body.userId)) {
        await user.updateOne({ $push: { blockedUser: req.body.userId } });
        res.status(200).json('user has been Blocked');
      } else {
        await user.updateOne({ $pull: { blockedUser: req.body.userId } });
        res.status(200).json('user has been UnBlocked');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(40).json('you cant block yourself');
  }
});

//get profile details
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const output = [
      user.username,
      user.followers.length,
      user.followings.length,
      user.post.length,
    ];
    res.status(200).json(output);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
