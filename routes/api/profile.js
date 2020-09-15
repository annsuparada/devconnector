const express = require("express");
const request = require("request");
const router = express.Router();
const auth = require("../../middlewere/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../modules/Profile");
const User = require("../../modules/User");

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is require").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Bulid profile object
    const profileFileds = {};
    profileFileds.user = req.user.id;
    if (company) profileFileds.company = company;
    if (website) profileFileds.website = website;
    if (location) profileFileds.location = location;
    if (bio) profileFildes.bio = bio;
    if (status) profileFileds.status = status;
    if (githubusername) profileFileds.githubusername = githubusername;
    if (skills) {
      //fomat string to array
      profileFileds.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Bulid social object
    profileFileds.social = {};
    if (youtube) profileFileds.social.youtube = youtube;
    if (facebook) profileFileds.social.facebook = facebook;
    if (twitter) profileFileds.social.twitter = twitter;
    if (instagram) profileFileds.social.instagram = instagram;
    if (linkedin) profileFileds.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFileds },
          { new: true }
        );
        return res.json(profile);
      }

      //create
      profile = new Profile(profileFileds);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user_id
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.log(err);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private

// we don't need user id because we have token by using auth middlewere
router.delete("/", auth, async (req, res) => {
  try {
    //remove profile
    await Profile.findOneAndDelete({ user: req.user.id });
    //remove user
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "User delered" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route   Put api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is require").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ erroes: errors.array() });

    const {
      title,
      company,
      from,
      to,
      location,
      current,
      description,
    } = req.body;

    const newExp = {
      // same as title: req.body.title
      title,
      company,
      from,
      to,
      location,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.send(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Delete api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    if (removeIndex === -1)
      return res.status(400).json({ msg: "Experience ID is not found" });

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// @route   Put api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Filed of study is required").not().isEmpty(),
      check("from", "From date is require").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ erroes: errors.array() });

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      location,
      current,
      description,
    } = req.body;

    const newEdu = {
      // same as title: req.body.title
      school,
      degree,
      fieldofstudy,
      from,
      to,
      location,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.send(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Delete api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    if (removeIndex === -1)
      return res.status(400).json({ msg: "Education ID is not found" });
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from GutHub
// @access  Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `http://api.github.com/users/${req.params.username}/repos?per_page=5&sort=create:asc&client_id=${process.env.GITHUB_CLIENT_ID}
      &client_secret=${process.env.GITHUB_SECRET}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);

      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: "No GitHub profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
