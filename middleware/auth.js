const { verifyToken } = require("../utils/token");

function authenticate(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    throw new Error("Invalid token");
  }
}

module.exports = authenticate;
