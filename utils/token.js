const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

function generateToken(user) {
  const data = {
    id: user._id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(data, secret, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
