const jwt = require("jsonwebtoken");

const SECRET = "12345";
const EXPIRES_IN = "1h";

function generateToken(user) {
  const data = {
    id: user._id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(data, SECRET, { expiresIn: EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
