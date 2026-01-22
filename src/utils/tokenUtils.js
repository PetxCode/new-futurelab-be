const jwt = require("jsonwebtoken");

const generateToken = (id, isAdmin = false) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET environment variable is not set. Please add it to your .env file."
    );
  }

  return jwt.sign({ id, isAdmin }, jwtSecret, {
    expiresIn: "30d",
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.isAdmin);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      grade: user.grade,
      class: user.class,
      academicLevel: user.academicLevel,
      levelProgress: user.levelProgress,
      points: user.points,
      achievements: user.achievements,
      isAdmin: user.isAdmin,
    },
  });
};

module.exports = { generateToken, sendTokenResponse };
